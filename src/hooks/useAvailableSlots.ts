
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';
import { useClinicVeterinarians } from './useClinicVeterinarians';
import { useClinicSettings } from './useClinicSettings';
import { format, addDays, startOfDay } from 'date-fns';

export const useAvailableSlots = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();
  const { veterinarians } = useClinicVeterinarians();
  const { settings } = useClinicSettings();

  // Récupérer les créneaux disponibles pour la réservation en ligne
  const { data: availableSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ['available-slots', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId || !veterinarians?.length || !settings) return [];
      
      console.log('🔄 Fetching available slots for clinic:', currentClinicId);
      
      try {
        const slots = [];
        const today = new Date();
        
        // Générer les créneaux pour les 14 prochains jours
        for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
          const date = addDays(today, dayOffset);
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayOfWeek = date.getDay();
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const dayName = dayNames[dayOfWeek];
          
          // Vérifier si la clinique est ouverte ce jour
          const daySchedule = settings.daily_schedules?.[dayName];
          if (!daySchedule?.isOpen) continue;
          
          // Récupérer tous les bookings (y compris les créneaux bloqués) pour cette date
          const { data: existingBookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('appointment_time, veterinarian_id, is_blocked, duration_minutes')
            .eq('clinic_id', currentClinicId)
            .eq('appointment_date', dateStr);
            
          if (bookingsError) {
            console.error('❌ Error fetching bookings:', bookingsError);
            continue;
          }
          
          console.log(`📅 Bookings for ${dateStr}:`, existingBookings);
          
          // Générer les créneaux pour chaque période d'ouverture
          const timeSlots = generateTimeSlotsForDay(daySchedule);
          const daySlots = [];
          
          for (const timeSlot of timeSlots) {
            for (const vet of veterinarians.filter(v => v.is_active)) {
              // Vérifier si ce créneau est déjà réservé ou bloqué
              const isSlotTaken = existingBookings?.some(booking => 
                booking.appointment_time === timeSlot && 
                booking.veterinarian_id === vet.id
              );
              
              // Vérifier si ce créneau est bloqué manuellement
              const isSlotBlocked = existingBookings?.some(booking => 
                booking.appointment_time === timeSlot && 
                booking.veterinarian_id === vet.id &&
                booking.is_blocked === true
              );
              
              // Exclure les créneaux bloqués manuellement de la réservation en ligne
              if (!isSlotTaken && !isSlotBlocked) {
                daySlots.push({
                  date: dateStr,
                  time: timeSlot,
                  veterinarian_id: vet.id,
                  veterinarian_name: vet.name,
                  available: true
                });
              }
            }
          }
          
          if (daySlots.length > 0) {
            slots.push({
              date: dateStr,
              slots: daySlots
            });
          }
        }
        
        console.log('✅ Generated available slots:', slots);
        return slots;
        
      } catch (error) {
        console.error('❌ Error generating available slots:', error);
        return [];
      }
    },
    enabled: !!currentClinicId && !!veterinarians?.length && !!settings
  });

  // Fonction utilitaire pour générer les créneaux horaires d'une journée
  const generateTimeSlotsForDay = (daySchedule: any) => {
    const slots = [];
    const slotDuration = settings?.default_slot_duration_minutes || 30;
    
    // Créneaux du matin
    if (daySchedule.morning?.start && daySchedule.morning?.end) {
      const morningSlots = generateSlotsForPeriod(
        daySchedule.morning.start, 
        daySchedule.morning.end, 
        slotDuration
      );
      slots.push(...morningSlots);
    }
    
    // Créneaux de l'après-midi
    if (daySchedule.afternoon?.start && daySchedule.afternoon?.end) {
      const afternoonSlots = generateSlotsForPeriod(
        daySchedule.afternoon.start, 
        daySchedule.afternoon.end, 
        slotDuration
      );
      slots.push(...afternoonSlots);
    }
    
    return slots;
  };

  // Fonction utilitaire pour générer les créneaux d'une période
  const generateSlotsForPeriod = (startTime: string, endTime: string, duration: number) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    
    for (let currentMin = startTotalMin; currentMin < endTotalMin; currentMin += duration) {
      const hour = Math.floor(currentMin / 60);
      const min = currentMin % 60;
      const timeSlot = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(timeSlot);
    }
    
    return slots;
  };

  const blockTimeSlot = useCallback(async (
    date: string,
    startTime: string,
    endTime: string,
    veterinarianId: string
  ): Promise<boolean> => {
    if (!currentClinicId) {
      console.error('❌ No clinic ID available for blocking slot');
      toast({
        title: "Erreur",
        description: "Impossible d'identifier la clinique",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Blocking time slot:', { date, startTime, endTime, veterinarianId, currentClinicId });

      // Calculer la durée en minutes
      const startDate = new Date(`2000-01-01T${startTime}:00`);
      const endDate = new Date(`2000-01-01T${endTime}:00`);
      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

      // Créer un booking de type "bloqué"
      const { error } = await supabase
        .from('bookings')
        .insert({
          clinic_id: currentClinicId,
          veterinarian_id: veterinarianId,
          appointment_date: date,
          appointment_time: startTime,
          appointment_end_time: endTime,
          client_name: 'CRÉNEAU BLOQUÉ',
          client_email: 'blocked@clinic.internal',
          client_phone: '0000000000',
          preferred_contact_method: 'email',
          animal_species: 'N/A',
          animal_name: 'N/A',
          consultation_reason: 'Créneau bloqué',
          status: 'confirmed',
          is_blocked: true,
          duration_minutes: durationMinutes
        });

      if (error) {
        console.error('❌ Error blocking time slot:', error);
        throw error;
      }

      console.log('✅ Time slot blocked successfully');
      
      // Invalider les queries pour rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['available-slots'] });

      toast({
        title: "Créneau bloqué",
        description: "Le créneau a été bloqué avec succès",
      });

      return true;
    } catch (error: any) {
      console.error('❌ Failed to block time slot:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de bloquer le créneau",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentClinicId, toast, queryClient]);

  return {
    availableSlots,
    blockTimeSlot,
    isLoading: isLoading || slotsLoading
  };
};
