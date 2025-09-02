import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

interface TimeSlot {
  time: string
  veterinarian_id: string
  available: boolean
  blocked: boolean
  availableVeterinarians?: string[]
}

interface UseAvailableSlotsProps {
  clinicSlug: string
  selectedVeterinarianId?: string
  noVeterinarianPreference?: boolean
  hasTwoAnimals?: boolean
}

export const useAvailableSlots = ({ 
  clinicSlug, 
  selectedVeterinarianId, 
  noVeterinarianPreference = false,
  hasTwoAnimals = false 
}: UseAvailableSlotsProps) => {
  const [dates, setDates] = useState<Date[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 6)

    const dateArray: Date[] = []
    let currentDate = today

    while (currentDate <= nextWeek) {
      dateArray.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setDates(dateArray)
    setSelectedDate(today)
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const { data: slotsData, isLoading, error, refetch } = useQuery({
    queryKey: ['available-slots', clinicSlug, selectedVeterinarianId, noVeterinarianPreference, hasTwoAnimals],
    queryFn: async () => {
      console.log('🔍 Fetching available slots for clinic:', clinicSlug)
      console.log('📊 Parameters:', { selectedVeterinarianId, noVeterinarianPreference, hasTwoAnimals })
      
      const { data: clinic, error: clinicError } = await supabase
        .from('clinics')
        .select('*')
        .eq('slug', clinicSlug)
        .single()

      if (clinicError) {
        throw new Error(`Erreur lors de la récupération de la clinique: ${clinicError.message}`)
      }

      if (!clinic) {
        throw new Error('Clinique non trouvée')
      }

      const { data: settings, error: settingsError } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('clinic_id', clinic.id)
        .single()

      if (settingsError) {
        throw new Error(`Erreur lors de la récupération des paramètres de la clinique: ${settingsError.message}`)
      }

      const { data: veterinarians, error: vetsError } = await supabase
        .from('clinic_veterinarians')
        .select('*')
        .eq('clinic_id', clinic.id)

      if (vetsError) {
        throw new Error(`Erreur lors de la récupération des vétérinaires: ${vetsError.message}`)
      }

      const defaultDurationMinutes = settings?.default_slot_duration_minutes || 30
      const requiredDurationMinutes = hasTwoAnimals ? defaultDurationMinutes * 2 : defaultDurationMinutes
      console.log('⏱️ Required duration for slots:', requiredDurationMinutes, 'minutes')

      if (!selectedDate) {
        throw new Error('Aucune date sélectionnée')
      }

      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 6)

      const dates: Date[] = []
      let currentDate = today

      while (currentDate <= nextWeek) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      const allSchedules: { date: string; schedule: any | null }[] = []

      for (const date of dates) {
        const dayOfWeek = date.getDay() // 0 (Sun) -> 6 (Sat)

        // NOTE: day_of_week column is integer in DB, so we must compare with a number, not a string
        const { data: daySchedule, error: dayScheduleError } = await supabase
          .from('veterinarian_schedules')
          .select('*')
          .eq('clinic_id', clinic.id)
          .eq('day_of_week', dayOfWeek) // FIX: use number instead of string day name
          .single()

        if (dayScheduleError && dayScheduleError.message !== 'Aucun résultat unique trouvé') {
          console.error('Error fetching schedule:', dayScheduleError)
          allSchedules.push({ date: date.toISOString().split('T')[0], schedule: null })
          continue
        }

        allSchedules.push({ date: date.toISOString().split('T')[0], schedule: daySchedule })
      }

      const todayDate = new Date()
      const nextWeekDate = new Date()
      nextWeekDate.setDate(todayDate.getDate() + 7)

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('clinic_id', clinic.id)
        .gte('appointment_date', todayDate.toISOString().split('T')[0])
        .lte('appointment_date', nextWeekDate.toISOString().split('T')[0])

      if (bookingsError) {
        throw new Error(`Erreur lors de la récupération des réservations: ${bookingsError.message}`)
      }

      const processedSlots = new Map()

      dates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0]
        const dayOfWeek = date.getDay()
        let dayName = ''

        switch (dayOfWeek) {
          case 0:
            dayName = 'sunday'
            break
          case 1:
            dayName = 'monday'
            break
          case 2:
            dayName = 'tuesday'
            break
          case 3:
            dayName = 'wednesday'
            break
          case 4:
            dayName = 'thursday'
            break
          case 5:
            dayName = 'friday'
            break
          case 6:
            dayName = 'saturday'
            break
          default:
            console.warn('Invalid day of week:', dayOfWeek)
            return
        }

        const daySchedule = allSchedules.find(schedule => schedule.date === dateStr)?.schedule

        if (daySchedule?.is_available) {
          const slots: TimeSlot[] = []
          
          // Générer les créneaux du matin
          if (daySchedule.morning_start && daySchedule.morning_end) {
            const morningSlots = generateTimeSlots(
              daySchedule.morning_start, 
              daySchedule.morning_end, 
              defaultDurationMinutes
            )
            slots.push(...morningSlots)
          }

          // Générer les créneaux de l'après-midi
          if (daySchedule.afternoon_start && daySchedule.afternoon_end) {
            const afternoonSlots = generateTimeSlots(
              daySchedule.afternoon_start, 
              daySchedule.afternoon_end, 
              defaultDurationMinutes
            )
            slots.push(...afternoonSlots)
          }

          // Filtrer les créneaux selon les réservations existantes et la durée requise
          const availableSlots = slots.map(slot => {
            const slotTime = slot.time
            
            // Pour 2 animaux, vérifier si le créneau actuel ET le suivant sont libres
            if (hasTwoAnimals) {
              const currentSlotAvailable = !bookings.some(booking =>
                booking.appointment_date === dateStr &&
                booking.appointment_time === slotTime &&
                (!selectedVeterinarianId || booking.veterinarian_id === selectedVeterinarianId)
              )

              // Calculer l'heure du créneau suivant
              const nextSlotTime = addMinutesToTime(slotTime, defaultDurationMinutes)
              const nextSlotAvailable = !bookings.some(booking =>
                booking.appointment_date === dateStr &&
                booking.appointment_time === nextSlotTime &&
                (!selectedVeterinarianId || booking.veterinarian_id === selectedVeterinarianId)
              )

              // Le créneau n'est disponible que si les deux sont libres
              const bothSlotsAvailable = currentSlotAvailable && nextSlotAvailable

              return {
                ...slot,
                available: bothSlotsAvailable,
                veterinarian_id: selectedVeterinarianId || slot.veterinarian_id
              }
            } else {
              // Pour 1 animal, logique normale
              const isBooked = bookings.some(booking =>
                booking.appointment_date === dateStr &&
                booking.appointment_time === slotTime &&
                (!selectedVeterinarianId || booking.veterinarian_id === selectedVeterinarianId)
              )

              return {
                ...slot,
                available: !isBooked,
                veterinarian_id: selectedVeterinarianId || slot.veterinarian_id
              }
            }
          }).filter(slot => slot.available) // Ne garder que les créneaux disponibles

          processedSlots.set(dateStr, availableSlots)
        }
      })

      console.log('✅ Processed slots:', processedSlots)
      return processedSlots
    },
    enabled: !!clinicSlug,
    refetchInterval: 60000,
  })

  // Fonction utilitaire pour ajouter des minutes à une heure
  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, mins, 0, 0)
    date.setMinutes(date.getMinutes() + minutes)
    return date.toTimeString().slice(0, 5)
  }

  const generateTimeSlots = (startTime: string, endTime: string, durationMinutes: number): TimeSlot[] => {
    const slots: TimeSlot[] = []
    let currentTime = startTime

    while (currentTime < endTime) {
      slots.push({
        time: currentTime,
        veterinarian_id: '',
        available: false,
        blocked: false
      })

      currentTime = addMinutesToTime(currentTime, durationMinutes)
    }

    return slots
  }

  const blockTimeSlotMutation = useMutation({
    mutationFn: async ({
      date,
      startTime,
      endTime,
      veterinarianId
    }: {
      date: string;
      startTime: string;
      endTime: string;
      veterinarianId: string;
    }) => {
      console.log('🔄 Blocking time slot:', { date, startTime, endTime, veterinarianId });
      
      const { data: clinic } = await supabase
        .from('clinics')
        .select('id')
        .eq('slug', clinicSlug)
        .single();

      if (!clinic) {
        throw new Error('Clinic not found');
      }

      // Build a minimal valid booking payload for a blocked slot.
      // bookings.Insert requires several fields even for a block.
      const blockedInsert: Database['public']['Tables']['bookings']['Insert'] = {
        clinic_id: clinic.id,
        veterinarian_id: veterinarianId || null,
        appointment_date: date,
        appointment_time: startTime,
        appointment_end_time: endTime,
        is_blocked: true,
        // Required fields with placeholders for a blocked slot:
        animal_species: 'blocked',
        animal_name: 'Blocage',
        consultation_reason: 'Blocage de créneau',
        client_name: 'Blocage',
        client_email: 'blocage@placeholder.local',
        client_phone: '0000000000',
        preferred_contact_method: 'phone',
        // Status must be one of the allowed values
        status: 'pending',
        booking_source: 'blocked',
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(blockedInsert)
        .select()
        .single();

      if (error) {
        console.error('❌ Error blocking slot:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      toast({
        title: "Créneau bloqué",
        description: "Le créneau a été bloqué avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to block slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de bloquer le créneau",
        variant: "destructive",
      });
    },
  });

  const blockTimeSlot = async (
    date: string,
    startTime: string,
    endTime: string,
    veterinarianId: string
  ): Promise<boolean> => {
    try {
      await blockTimeSlotMutation.mutateAsync({
        date,
        startTime,
        endTime,
        veterinarianId
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    slotsData,
    isLoading,
    error,
    refetch,
    blockTimeSlot
  }
}
