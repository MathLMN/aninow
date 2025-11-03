
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicContext } from '@/contexts/ClinicContext';
import { format, addDays, isToday, parseISO, addHours, isAfter, startOfDay } from 'date-fns';
import { isVeterinarianAbsent } from '@/components/planning/utils/veterinarianAbsenceUtils';

export const usePublicBookingSlots = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentClinic } = useClinicContext();

  // Récupérer les vétérinaires via la fonction RPC sécurisée
  const { data: veterinarians = [], isLoading: vetsLoading } = useQuery({
    queryKey: ['public-veterinarians', currentClinic?.slug],
    queryFn: async () => {
      if (!currentClinic?.slug) return [];

      console.log('🔄 Fetching public veterinarians for:', currentClinic.slug);
      
      const { data, error } = await supabase.rpc('get_clinic_veterinarians_for_booking', {
        clinic_slug: currentClinic.slug
      });

      if (error) {
        console.error('❌ Error fetching public veterinarians:', error);
        throw error;
      }

      console.log('✅ Public veterinarians loaded:', data?.length || 0);
      return data || [];
    },
    enabled: !!currentClinic?.slug,
  });

  // Récupérer les paramètres de la clinique via la nouvelle fonction
  const { data: clinicData, isLoading: settingsLoading } = useQuery({
    queryKey: ['public-clinic-settings', currentClinic?.slug],
    queryFn: async () => {
      if (!currentClinic?.slug) return null;

      console.log('🔄 Fetching clinic settings for:', currentClinic.slug);

      const { data, error } = await supabase.functions.invoke('get_clinic_settings_for_booking', {
        body: { clinic_slug: currentClinic.slug }
      });

      if (error) {
        console.error('❌ Error fetching clinic settings:', error);
        throw error;
      }

      console.log('✅ Clinic settings loaded:', data);
      return data;
    },
    enabled: !!currentClinic?.slug,
  });

  // Fonction pour filtrer les créneaux selon le délai minimum et les créneaux passés
  const filterSlotsByMinimumDelay = (slots: any[], date: string, minimumDelayHours: number) => {
    const slotDate = parseISO(date);
    const now = new Date();
    
    // Calculer la date/heure minimum autorisée
    const minimumAllowedDateTime = addHours(now, minimumDelayHours);
    
    return slots.filter(slot => {
      const [slotHour, slotMinute] = slot.time.split(':').map(Number);
      const slotDateTime = new Date(slotDate);
      slotDateTime.setHours(slotHour, slotMinute, 0, 0);
      
      // Garder seulement les créneaux après le délai minimum (avec marge de sécurité de 15 min)
      return isAfter(slotDateTime, addHours(minimumAllowedDateTime, 0.25));
    });
  };

  // Générer les créneaux disponibles
  const { data: availableSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ['public-available-slots', currentClinic?.slug, veterinarians.length],
    queryFn: async () => {
      if (!currentClinic || !veterinarians?.length || !clinicData?.settings) {
        console.log('⚠️ Missing data for slot generation:', {
          clinic: !!currentClinic,
          vets: veterinarians?.length || 0,
          settings: !!clinicData?.settings
        });
        return [];
      }
      
      console.log('🔄 Generating available slots for clinic:', currentClinic.slug);
      
      try {
        const slots = [];
        const today = new Date();
        const settings = clinicData.settings;
        const minimumDelayHours = settings.minimum_booking_delay_hours || 0;
        
        // Récupérer les horaires des vétérinaires
        const { data: vetSchedules, error: schedError } = await supabase
          .from('veterinarian_schedules')
          .select('*')
          .eq('clinic_id', currentClinic.id);
          
        if (schedError) {
          console.error('❌ Error fetching vet schedules:', schedError);
        }
        
        // Récupérer les absences des vétérinaires
        const { data: vetAbsences, error: absError } = await supabase
          .from('veterinarian_absences')
          .select('*')
          .eq('clinic_id', currentClinic.id)
          .gte('end_date', format(today, 'yyyy-MM-dd'));
          
        if (absError) {
          console.error('❌ Error fetching vet absences:', absError);
        }
        
        // Récupérer les blocs récurrents
        const { data: recurringBlocks, error: blocksError } = await supabase
          .from('recurring_slot_blocks')
          .select('*')
          .eq('clinic_id', currentClinic.id)
          .eq('is_active', true);
          
        if (blocksError) {
          console.error('❌ Error fetching recurring blocks:', blocksError);
        }
        
        console.log('📊 Loaded scheduling data:', {
          vetSchedules: vetSchedules?.length || 0,
          vetAbsences: vetAbsences?.length || 0,
          recurringBlocks: recurringBlocks?.length || 0,
          minimumDelayHours
        });
        
        // Générer les créneaux pour les 14 prochains jours
        for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
          const date = addDays(today, dayOffset);
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayOfWeek = date.getDay();
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const dayName = dayNames[dayOfWeek];
          
          // Vérifier si la clinique est ouverte ce jour
          const daySchedule = settings.daily_schedules?.[dayName];
          if (!daySchedule?.isOpen) {
            console.log(`🚫 Clinic closed on ${dayName} (${dateStr})`);
            continue;
          }
          
          console.log(`📅 Processing ${dayName} (${dateStr}):`, daySchedule);
          
          // Récupérer tous les bookings pour cette date
          const { data: existingBookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('appointment_time, veterinarian_id, is_blocked, duration_minutes')
            .eq('clinic_id', currentClinic.id)
            .eq('appointment_date', dateStr);
            
          if (bookingsError) {
            console.error('❌ Error fetching bookings for', dateStr, ':', bookingsError);
            continue;
          }
          
          console.log(`📋 Existing bookings for ${dateStr}:`, existingBookings);
          
          // Générer les créneaux pour cette journée selon les horaires de la clinique
          const timeSlots = generateTimeSlotsForDay(daySchedule, settings.default_slot_duration_minutes || 30);
          let daySlots = [];
          
          console.log(`⏰ Generated time slots for ${dateStr}:`, timeSlots);
          
          for (const timeSlot of timeSlots) {
            for (const vet of veterinarians.filter(v => v.is_active)) {
              // 1. Vérifier si le vétérinaire est absent ce jour
              if (vetAbsences && isVeterinarianAbsent(vet.id, date, vetAbsences)) {
                console.log(`🚫 Vet ${vet.name} is absent on ${dateStr}`);
                continue;
              }
              
              // 2. Vérifier les horaires de travail du vétérinaire
              const vetDaySchedule = vetSchedules?.find(
                s => s.veterinarian_id === vet.id && s.day_of_week === dayOfWeek
              );
              
              if (vetDaySchedule && !vetDaySchedule.is_working) {
                continue;
              }
              
              // Vérifier si le créneau est dans les horaires de travail du vétérinaire
              if (vetDaySchedule) {
                const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
                const slotTimeInMinutes = slotHour * 60 + slotMinute;
                
                let isInVetSchedule = false;
                
                // Vérifier matin
                if (vetDaySchedule.morning_start && vetDaySchedule.morning_end) {
                  const [mStartH, mStartM] = vetDaySchedule.morning_start.split(':').map(Number);
                  const [mEndH, mEndM] = vetDaySchedule.morning_end.split(':').map(Number);
                  const morningStart = mStartH * 60 + mStartM;
                  const morningEnd = mEndH * 60 + mEndM;
                  
                  if (slotTimeInMinutes >= morningStart && slotTimeInMinutes < morningEnd) {
                    isInVetSchedule = true;
                  }
                }
                
                // Vérifier après-midi
                if (vetDaySchedule.afternoon_start && vetDaySchedule.afternoon_end) {
                  const [aStartH, aStartM] = vetDaySchedule.afternoon_start.split(':').map(Number);
                  const [aEndH, aEndM] = vetDaySchedule.afternoon_end.split(':').map(Number);
                  const afternoonStart = aStartH * 60 + aStartM;
                  const afternoonEnd = aEndH * 60 + aEndM;
                  
                  if (slotTimeInMinutes >= afternoonStart && slotTimeInMinutes < afternoonEnd) {
                    isInVetSchedule = true;
                  }
                }
                
                if (!isInVetSchedule) {
                  continue;
                }
              }
              
              // 3. Vérifier les blocs récurrents
              const isBlockedByRecurring = recurringBlocks?.some(block => {
                if (block.veterinarian_id !== vet.id) return false;
                if (block.day_of_week !== dayOfWeek) return false;
                
                // Vérifier si le bloc est actif pour cette date
                if (block.start_date && new Date(block.start_date) > date) return false;
                if (block.end_date && new Date(block.end_date) < date) return false;
                
                const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
                const [blockStartH, blockStartM] = block.start_time.split(':').map(Number);
                const [blockEndH, blockEndM] = block.end_time.split(':').map(Number);
                
                const slotTime = slotHour * 60 + slotMinute;
                const blockStart = blockStartH * 60 + blockStartM;
                const blockEnd = blockEndH * 60 + blockEndM;
                
                return slotTime >= blockStart && slotTime < blockEnd;
              });
              
              if (isBlockedByRecurring) {
                console.log(`🚫 Slot ${timeSlot} blocked by recurring block for vet ${vet.name}`);
                continue;
              }
              
              // 4. Vérifier si ce créneau est déjà réservé ou bloqué
              const isSlotTaken = existingBookings?.some(booking => 
                booking.appointment_time === timeSlot && 
                booking.veterinarian_id === vet.id
              );
              
              if (!isSlotTaken) {
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

          // Regrouper les créneaux par heure pour éviter les doublons
          const groupedSlots: { [key: string]: any } = {};
          daySlots.forEach(slot => {
            const timeKey = slot.time;
            
            if (!groupedSlots[timeKey]) {
              groupedSlots[timeKey] = {
                ...slot,
                availableVeterinarians: [slot.veterinarian_id]
              };
            } else {
              // Ajouter ce vétérinaire à la liste des vétérinaires disponibles
              groupedSlots[timeKey].availableVeterinarians.push(slot.veterinarian_id);
            }
          });

          // Convertir les créneaux groupés en tableau
          daySlots = Object.values(groupedSlots);

          // Filtrer selon le délai minimum de réservation
          daySlots = filterSlotsByMinimumDelay(daySlots, dateStr, minimumDelayHours);
          
          if (daySlots.length > 0) {
            slots.push({
              date: dateStr,
              slots: daySlots
            });
            console.log(`✅ Added ${daySlots.length} available slots for ${dateStr} (after all filters)`);
          } else {
            console.log(`⚠️ No available slots for ${dateStr} (after all filters)`);
          }
        }
        
        console.log('✅ Final generated slots:', slots.length, 'days with slots');
        return slots;
        
      } catch (error) {
        console.error('❌ Error generating available slots:', error);
        return [];
      }
    },
    enabled: !!currentClinic && !!veterinarians?.length && !!clinicData?.settings
  });

  // Fonction utilitaire pour générer les créneaux horaires d'une journée
  const generateTimeSlotsForDay = (daySchedule: any, slotDuration: number) => {
    const slots = [];
    
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

  return {
    availableSlots,
    veterinarians,
    isLoading: isLoading || slotsLoading || vetsLoading || settingsLoading
  };
};
