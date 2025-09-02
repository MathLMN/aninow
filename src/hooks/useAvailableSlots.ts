import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

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
  hasTwoAnimals?: boolean // Nouveau paramètre
}

export const useAvailableSlots = ({ 
  clinicSlug, 
  selectedVeterinarianId, 
  noVeterinarianPreference = false,
  hasTwoAnimals = false 
}: UseAvailableSlotsProps) => {
  const [dates, setDates] = useState<Date[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

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
        .from('veterinarians')
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

      const allSchedules = []

      for (const date of dates) {
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
            continue
        }

        const { data: daySchedule, error: dayScheduleError } = await supabase
          .from('clinic_schedule')
          .select('*')
          .eq('clinic_id', clinic.id)
          .eq('day', dayName)
          .single()

        if (dayScheduleError && dayScheduleError.message !== 'Aucun résultat unique trouvé') {
          console.error('Error fetching schedule:', dayScheduleError)
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

        if (daySchedule?.isOpen) {
          const slots: TimeSlot[] = []
          
          // Générer les créneaux du matin
          if (daySchedule.morning?.start && daySchedule.morning?.end) {
            const morningSlots = generateTimeSlots(
              daySchedule.morning.start, 
              daySchedule.morning.end, 
              defaultDurationMinutes
            )
            slots.push(...morningSlots)
          }

          // Générer les créneaux de l'après-midi
          if (daySchedule.afternoon?.start && daySchedule.afternoon?.end) {
            const afternoonSlots = generateTimeSlots(
              daySchedule.afternoon.start, 
              daySchedule.afternoon.end, 
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
    refetchInterval: 60000, // Actualiser toutes les minutes
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

  return {
    slotsData,
    isLoading,
    error,
    refetch
  }
}
