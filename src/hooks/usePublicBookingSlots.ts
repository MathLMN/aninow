
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicContext } from '@/contexts/ClinicContext';
import { format, addDays } from 'date-fns';

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
          
          // Générer les créneaux pour cette journée
          const timeSlots = generateTimeSlotsForDay(daySchedule, settings.default_slot_duration_minutes || 30);
          const daySlots = [];
          
          console.log(`⏰ Generated time slots for ${dateStr}:`, timeSlots);
          
          for (const timeSlot of timeSlots) {
            for (const vet of veterinarians.filter(v => v.is_active)) {
              // Vérifier si ce créneau est déjà réservé ou bloqué
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
          
          if (daySlots.length > 0) {
            slots.push({
              date: dateStr,
              slots: daySlots
            });
            console.log(`✅ Added ${daySlots.length} slots for ${dateStr}`);
          } else {
            console.log(`⚠️ No available slots for ${dateStr}`);
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
