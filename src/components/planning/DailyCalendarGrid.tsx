import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TimeSlotCell } from "./TimeSlotCell";
import { generateAllTimeSlots, isTimeSlotOpen, getBookingsForSlot, isFullHour } from "./utils/scheduleUtils";
import { isVeterinarianAbsent } from "./utils/veterinarianAbsenceUtils";
import { useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { useState, useEffect, useMemo } from "react";
import { formatDateLocal } from "@/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DailyCalendarGridProps {
  selectedDate: Date;
  bookings: any[];
  columns: any[];
  daySchedule: any;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
  veterinarians: any[];
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onCopyBooking?: (booking: any) => void;
  onCutBooking?: (booking: any) => void;
  onPasteBooking?: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onBlockSlot?: (timeSlot: { date: string; time: string; veterinarian: string }) => void;
  hasClipboard?: boolean;
  fixedHeaders?: boolean;
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
  onCopyBooking,
  onCutBooking,
  onPasteBooking,
  onDeleteBooking,
  onBlockSlot,
  hasClipboard = false,
  fixedHeaders = false
}: DailyCalendarGridProps) => {
  const { settings } = useClinicSettings();
  const { currentClinicId } = useClinicAccess();
  const { absences } = useVeterinarianAbsences();
  const { consultationTypes } = useSlotManagement();
  const timeSlots = generateAllTimeSlots();

  // Optimiser le calcul des bookings par slot avec useMemo pour éviter les recalculs
  const slotBookings = useMemo(() => {
    const newSlotBookings: Record<string, any[]> = {};
    const dateStr = formatDateLocal(selectedDate);
    
    console.log('🔄 Calculating slot bookings for date:', dateStr);
    console.log('📊 Total bookings available:', bookings.length);
    console.log('📋 Sample bookings for today:', bookings.filter(b => b.appointment_date === dateStr).slice(0, 3));
    
    for (const time of timeSlots) {
      for (const column of columns) {
        const key = `${time}-${column.id}`;
        
        // Filtrer directement les bookings pour ce créneau et cette colonne
        let bookingsForSlot = [];
        
        if (column.id === 'asv') {
          // Pour la colonne ASV : afficher les rendez-vous sans vétérinaire assigné
          bookingsForSlot = bookings.filter(booking => {
            const matchesDate = booking.appointment_date === dateStr;
            const matchesTime = booking.appointment_time === time;
            const hasNoVet = !booking.veterinarian_id || booking.veterinarian_id === 'asv';
            
            const matches = matchesDate && matchesTime && hasNoVet;
            
            if (matches) {
              console.log('📍 ASV booking found:', booking.client_name, time);
            }
            
            return matches;
          });
        } else {
          // Pour les colonnes vétérinaires : inclure tous les bookings assignés à ce vétérinaire
          bookingsForSlot = bookings.filter(booking => {
            const matchesDate = booking.appointment_date === dateStr;
            const matchesTime = booking.appointment_time === time;
            const matchesVet = booking.veterinarian_id === column.id;
            
            const matches = matchesDate && matchesTime && matchesVet;
            
            if (matches) {
              console.log('👨‍⚕️ Vet booking found:', booking.client_name, column.title, time, 'Source:', booking.booking_source);
            }
            
            return matches;
          });
        }
        
        newSlotBookings[key] = bookingsForSlot;
        
        // Log pour les créneaux bloqués
        if (bookingsForSlot.some(b => b.is_blocked || b.recurring_block_id || b.booking_source === 'blocked')) {
          console.log('🔒 Blocked slot found for:', key, bookingsForSlot.filter(b => b.is_blocked || b.recurring_block_id || b.booking_source === 'blocked'));
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
          booking.recurring_block_id ||
          booking.booking_source === 'blocked'
        );
        
        const blockingBooking = bookingsForSlot.find(booking => 
          booking.recurring_block_id || booking.is_blocked || booking.booking_source === 'blocked'
        );
        const blockId = blockingBooking?.recurring_block_id || blockingBooking?.id || 'manual';
        
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
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* En-tête fixe des colonnes - hauteur harmonisée */}
        <div className={`grid border-b border-vet-blue/20 bg-vet-beige/30 flex-shrink-0 h-12`} style={{gridTemplateColumns: `80px repeat(${columns.length}, 1fr)`}}>
          {/* Colonne vide pour aligner avec la colonne horaire */}
          <div className="p-2 border-r border-vet-blue/20 flex items-center justify-center">
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
              return total + bookingsForSlot.filter(b => 
                !b.is_blocked && 
                !b.recurring_block_id && 
                b.booking_source !== 'blocked'
              ).length;
            }, 0);

            return (
              <div key={column.id} className="p-2 text-center border-l border-vet-blue/20 flex flex-col justify-center">
                <div className="font-semibold text-sm text-vet-navy leading-tight">
                  {column.title}
                </div>
                <div className="text-xs text-vet-brown mt-1">
                  {totalBookings} RDV
                </div>
              </div>
            );
          })}
        </div>

        {/* Zone scrollable avec les créneaux horaires - hauteur ajustée */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="relative">
              {timeSlots.map((time, timeIndex) => {
                const isOpen = isTimeSlotOpen(time, daySchedule);
                
                return (
                  <div 
                    key={time} 
                    className={cn(
                      "grid relative h-5 border-b border-gray-200/50"
                    )} 
                    style={{gridTemplateColumns: `80px repeat(${columns.length}, 1fr)`}}
                  >
                    {/* Colonne horaire - alignement centré */}
                    <div className={cn(
                      "text-xs text-center font-medium border-r flex items-center justify-center px-1",
                      isOpen 
                        ? "bg-white text-gray-700 border-gray-300" 
                        : "bg-gray-300/80 text-gray-600 border-gray-400",
                      "text-[10px] font-medium leading-none"
                    )}>
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
                          onCopyBooking={onCopyBooking}
                          onCutBooking={onCutBooking}
                          onPasteBooking={onPasteBooking}
                          onDeleteBooking={onDeleteBooking}
                          onBlockSlot={onBlockSlot}
                          isVeterinarianAbsent={isVetAbsent}
                          isFirstBlockedSlot={blockInfo?.isFirst || false}
                          blockedSlotsCount={blockInfo?.count || 1}
                          consultationTypes={consultationTypes}
                          hasClipboard={hasClipboard}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
