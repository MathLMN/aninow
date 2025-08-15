
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TimeSlotCell } from "./TimeSlotCell";
import { generateAllTimeSlots, isTimeSlotOpen, getBookingsForSlot, isFullHour } from "./utils/scheduleUtils";
import { isVeterinarianAbsent } from "./utils/veterinarianAbsenceUtils";
import { useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { useState, useEffect, useMemo } from "react";
import { formatDateLocal } from "@/utils/date";

interface DailyCalendarGridProps {
  selectedDate: Date;
  bookings: any[];
  columns: any[];
  daySchedule: any;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
  veterinarians: any[];
  // Nouvelles props pour les actions du planning
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onDuplicateBooking?: (booking: any) => void;
  onMoveBooking?: (booking: any) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onBlockSlot?: (timeSlot: { date: string; time: string; veterinarian: string }) => void;
}

export const DailyCalendarGrid = ({
  selectedDate,
  bookings,
  columns,
  daySchedule,
  onCreateAppointment,
  onAppointmentClick,
  veterinarians,
  onValidateBooking,
  onCancelBooking,
  onDuplicateBooking,
  onMoveBooking,
  onDeleteBooking,
  onBlockSlot
}: DailyCalendarGridProps) => {
  const { settings } = useClinicSettings();
  const { currentClinicId } = useClinicAccess();
  const { absences } = useVeterinarianAbsences();
  const timeSlots = generateAllTimeSlots();

  // Optimiser le calcul des bookings par slot avec useMemo pour éviter les recalculs
  const slotBookings = useMemo(() => {
    const newSlotBookings: Record<string, any[]> = {};
    
    console.log('🔄 Calculating slot bookings for date:', formatDateLocal(selectedDate));
    console.log('📊 Total bookings available:', bookings.length);
    
    for (const time of timeSlots) {
      for (const column of columns) {
        const key = `${time}-${column.id}`;
        
        // Filtrer directement les bookings pour ce créneau et cette colonne
        const dateStr = formatDateLocal(selectedDate);
        let bookingsForSlot = [];
        
        if (column.id === 'asv') {
          // Pour la colonne ASV : ne jamais afficher les blocages récurrents
          bookingsForSlot = bookings.filter(booking => {
            return booking.appointment_date === dateStr && 
                   booking.appointment_time === time &&
                   !booking.recurring_block_id && // Exclure les blocages récurrents
                   !booking.is_blocked && // Exclure tous les blocages
                   !booking.veterinarian_id; // Seulement les RDV sans vétérinaire assigné
          });
        } else {
          // Pour les colonnes vétérinaires : inclure tous les bookings assignés à ce vétérinaire
          bookingsForSlot = bookings.filter(booking => {
            return booking.appointment_date === dateStr && 
                   booking.appointment_time === time &&
                   booking.veterinarian_id === column.id;
          });
        }
        
        newSlotBookings[key] = bookingsForSlot;
        
        // Log pour les créneaux bloqués récurrents
        if (bookingsForSlot.some(b => b.recurring_block_id)) {
          console.log('🔒 Recurring block found for:', key, bookingsForSlot.filter(b => b.recurring_block_id));
        }
      }
    }
    
    return newSlotBookings;
  }, [timeSlots, columns, bookings, selectedDate]);

  // Fonction pour déterminer les plages de blocage continues
  const getBlockedSlotInfo = useMemo(() => {
    const blockedSlotInfo: Record<string, { isFirst: boolean; count: number }> = {};
    
    for (const column of columns) {
      let currentBlockStart = -1;
      let currentBlockCount = 0;
      let currentBlockId: string | null = null;
      
      for (let i = 0; i < timeSlots.length; i++) {
        const time = timeSlots[i];
        const key = `${time}-${column.id}`;
        const bookingsForSlot = slotBookings[key] || [];
        
        const isBlocked = bookingsForSlot.some(booking => 
          booking.consultation_reason === 'Créneau bloqué' || 
          booking.is_blocked || 
          booking.client_name === 'CRÉNEAU BLOQUÉ' ||
          booking.recurring_block_id
        );
        
        const recurringBlock = bookingsForSlot.find(booking => booking.recurring_block_id);
        const blockId = recurringBlock?.recurring_block_id || 'manual';
        
        if (isBlocked && (currentBlockStart === -1 || blockId === currentBlockId)) {
          // Début d'un nouveau bloc ou continuation du bloc actuel
          if (currentBlockStart === -1) {
            currentBlockStart = i;
            currentBlockCount = 1;
            currentBlockId = blockId;
          } else {
            currentBlockCount++;
          }
        } else {
          // Fin du bloc actuel, enregistrer les infos
          if (currentBlockStart !== -1) {
            for (let j = currentBlockStart; j < currentBlockStart + currentBlockCount; j++) {
              const blockTime = timeSlots[j];
              const blockKey = `${blockTime}-${column.id}`;
              blockedSlotInfo[blockKey] = {
                isFirst: j === currentBlockStart,
                count: currentBlockCount
              };
            }
          }
          
          // Reset pour le prochain bloc
          currentBlockStart = isBlocked ? i : -1;
          currentBlockCount = isBlocked ? 1 : 0;
          currentBlockId = isBlocked ? blockId : null;
        }
      }
      
      // Traiter le dernier bloc s'il se termine à la fin
      if (currentBlockStart !== -1) {
        for (let j = currentBlockStart; j < currentBlockStart + currentBlockCount; j++) {
          const blockTime = timeSlots[j];
          const blockKey = `${blockTime}-${column.id}`;
          blockedSlotInfo[blockKey] = {
            isFirst: j === currentBlockStart,
            count: currentBlockCount
          };
        }
      }
    }
    
    return blockedSlotInfo;
  }, [timeSlots, columns, slotBookings]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* En-tête des colonnes avec alignement correct */}
            <div className={`grid border-b border-vet-blue/20 bg-vet-beige/30`} style={{gridTemplateColumns: `100px repeat(${columns.length}, 1fr)`}}>
              {/* Colonne vide pour aligner avec la colonne horaire */}
              <div className="p-2 border-r border-vet-blue/20">
                <div className="text-xs text-vet-brown text-center font-medium">
                  Horaires
                </div>
              </div>
              
              {/* Colonnes des vétérinaires */}
              {columns.map((column) => {
                // Compter le total des RDV pour cette colonne pour toute la journée
                const totalBookings = timeSlots.reduce((total, time) => {
                  const key = `${time}-${column.id}`;
                  const bookingsForSlot = slotBookings[key] || [];
                  // Ne compter que les vrais rendez-vous, pas les blocages
                  return total + bookingsForSlot.filter(b => !b.is_blocked && !b.recurring_block_id).length;
                }, 0);

                return (
                  <div key={column.id} className="p-2 text-center border-l border-vet-blue/20">
                    <div className="font-semibold text-sm text-vet-navy">
                      {column.title}
                    </div>
                    <div className="text-xs text-vet-brown mt-1">
                      {totalBookings} RDV
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grille horaire 7h-21h avec lignes fines uniformes */}
            <div className="relative">
              {timeSlots.map((time, timeIndex) => {
                const isOpen = isTimeSlotOpen(time, daySchedule);
                
                return (
                  <div 
                    key={time} 
                    className={cn(
                      `grid relative`,
                      // Hauteur identique pour tous les créneaux
                      "h-[30px]",
                      // Lignes fines uniformes pour tous les créneaux
                      "border-b border-gray-200/50"
                    )} 
                    style={{gridTemplateColumns: `100px repeat(${columns.length}, 1fr)`}}
                  >
                    {/* Colonne horaire - affichage de toutes les heures avec alignement parfait */}
                    <div className={cn(
                      "text-xs text-center font-medium border-r flex items-center justify-center px-1",
                      isOpen 
                        ? "bg-white text-gray-700 border-gray-300" 
                        : "bg-gray-300/80 text-gray-600 border-gray-400",
                      // Police et style pour une meilleure lisibilité
                      "text-[11px] font-medium leading-none"
                    )}>
                      {/* Afficher toutes les heures pour un alignement parfait */}
                      {time}
                    </div>
                    
                    {/* Colonnes par vétérinaire et ASV */}
                    {columns.map((column) => {
                      const key = `${time}-${column.id}`;
                      const slotBookingsForCell = slotBookings[key] || [];
                      const blockInfo = getBlockedSlotInfo[key];
                      
                      // Vérifier si le vétérinaire est absent (seulement pour les colonnes vétérinaire, pas ASV)
                      const isVetAbsent = column.id !== 'asv' && isVeterinarianAbsent(column.id, selectedDate, absences);
                      
                      return (
                        <TimeSlotCell
                          key={`${column.id}-${time}`}
                          time={time}
                          columnId={column.id}
                          bookings={slotBookingsForCell}
                          isOpen={isOpen}
                          canBook={true}
                          onCreateAppointment={onCreateAppointment}
                          onAppointmentClick={onAppointmentClick}
                          selectedDate={selectedDate}
                          onValidateBooking={onValidateBooking}
                          onCancelBooking={onCancelBooking}
                          onDuplicateBooking={onDuplicateBooking}
                          onMoveBooking={onMoveBooking}
                          onDeleteBooking={onDeleteBooking}
                          onBlockSlot={onBlockSlot}
                          isVeterinarianAbsent={isVetAbsent}
                          isFirstBlockedSlot={blockInfo?.isFirst || false}
                          blockedSlotsCount={blockInfo?.count || 1}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
