import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClinicSettings } from './useClinicSettings'
import { useClinicVeterinarians } from './useClinicVeterinarians'

interface TimeSlot {
  time: string
  veterinarian_id: string
  available: boolean
  blocked: boolean
  is_assigned?: boolean // Nouveau: indique si le créneau est assigné via slot_assignments
}

interface DateSlots {
  date: string
  slots: TimeSlot[]
}

export const useAvailableSlots = () => {
  const [availableSlots, setAvailableSlots] = useState<DateSlots[]>([])
  const [blockedSlots, setBlockedSlots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { settings } = useClinicSettings()
  const { veterinarians } = useClinicVeterinarians()

  // Durées standard par vétérinaire
  const getVetDuration = (vetId: string) => {
    const vet = veterinarians.find(v => v.id === vetId)
    if (vet?.name === "Dr. JeremIE MAURICE") {
      return 15 // 15 minutes pour Dr. Jérémie Maurice
    }
    return 20 // 20 minutes pour tous les autres
  }

  const generateTimeSlots = (startTime: string, endTime: string, intervalMinutes: number = 15) => {
    const slots = []
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    
    while (start < end) {
      slots.push(start.toTimeString().slice(0, 5))
      start.setMinutes(start.getMinutes() + intervalMinutes)
    }
    
    return slots
  }

  // Nouvelle fonction pour l'attribution intelligente des créneaux
  const getOrAssignVeterinarianForSlot = async (date: string, time: string): Promise<string> => {
    try {
      // 1. Vérifier s'il existe déjà une attribution pour ce créneau
      const { data: existingAssignment, error: assignError } = await supabase
        .from('slot_assignments')
        .select('veterinarian_id')
        .eq('date', date)
        .eq('time_slot', time)
        .maybeSingle()

      if (assignError) throw assignError

      if (existingAssignment) {
        return existingAssignment.veterinarian_id
      }

      // 2. Si pas d'attribution existante, calculer le vétérinaire le moins chargé
      const activeVets = veterinarians.filter(vet => vet.is_active)
      if (activeVets.length === 0) return veterinarians[0]?.id || ''

      // Compter les attributions existantes pour cette date
      const { data: assignments, error: countError } = await supabase
        .from('slot_assignments')
        .select('veterinarian_id')
        .eq('date', date)

      if (countError) throw countError

      // Calculer la charge de chaque vétérinaire pour cette date
      const vetCounts = activeVets.reduce((acc, vet) => {
        acc[vet.id] = 0
        return acc
      }, {} as Record<string, number>)

      assignments?.forEach(assignment => {
        if (vetCounts[assignment.veterinarian_id] !== undefined) {
          vetCounts[assignment.veterinarian_id]++
        }
      })

      // Trouver le vétérinaire avec le moins d'attributions
      const leastBusyVet = activeVets.reduce((min, vet) => {
        return vetCounts[vet.id] < vetCounts[min.id] ? vet : min
      }, activeVets[0])

      // 3. Créer l'attribution persistante
      const { error: insertError } = await supabase
        .from('slot_assignments')
        .insert({
          date,
          time_slot: time,
          veterinarian_id: leastBusyVet.id,
          assignment_type: 'auto'
        })

      if (insertError) {
        console.error('Erreur lors de la création de l\'attribution:', insertError)
        // En cas d'erreur, retourner quand même le vétérinaire choisi
      }

      return leastBusyVet.id
    } catch (error) {
      console.error('Erreur dans getOrAssignVeterinarianForSlot:', error)
      // Fallback: retourner le premier vétérinaire actif
      return veterinarians.find(vet => vet.is_active)?.id || veterinarians[0]?.id || ''
    }
  }

  const generateDaySlots = async (date: Date) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
    const dayOfWeek = dayNames[date.getDay()]
    const daySchedule = settings.daily_schedules[dayOfWeek]
    
    if (!daySchedule.isOpen) return []
    
    const slots: TimeSlot[] = []
    const dateStr = date.toISOString().split('T')[0]
    
    // Générer tous les créneaux temporels possibles
    const allTimeSlots: string[] = []
    
    // Créneaux du matin
    if (daySchedule.morning.start && daySchedule.morning.end) {
      const morningSlots = generateTimeSlots(daySchedule.morning.start, daySchedule.morning.end)
      allTimeSlots.push(...morningSlots)
    }
    
    // Créneaux de l'après-midi
    if (daySchedule.afternoon.start && daySchedule.afternoon.end) {
      const afternoonSlots = generateTimeSlots(daySchedule.afternoon.start, daySchedule.afternoon.end)
      allTimeSlots.push(...afternoonSlots)
    }

    // Pour chaque créneau temporel, assigner un vétérinaire de manière intelligente
    for (const time of allTimeSlots) {
      const veterinarianId = await getOrAssignVeterinarianForSlot(dateStr, time)
      
      slots.push({
        time,
        veterinarian_id: veterinarianId,
        available: true,
        blocked: false,
        is_assigned: true
      })
    }
    
    return slots
  }

  const checkSlotAvailability = async (dateStr: string) => {
    try {
      // Récupérer les RDV existants pour cette date
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('appointment_date', dateStr)
        .in('status', ['pending', 'confirmed'])

      if (bookingsError) throw bookingsError

      // Récupérer les créneaux bloqués manuellement
      const { data: blocked, error: blockedError } = await supabase
        .from('available_slots')
        .select('*')
        .eq('date', dateStr)
        .eq('is_booked', true)
        .is('booking_id', null) // Créneaux bloqués manuellement

      if (blockedError) throw blockedError

      return { bookings: bookings || [], blockedSlots: blocked || [] }
    } catch (error) {
      console.error('Erreur lors de la vérification des disponibilités:', error)
      return { bookings: [], blockedSlots: [] }
    }
  }

  const generateAvailableSlots = async (daysAhead: number = 14) => {
    if (!settings.daily_schedules || veterinarians.length === 0) return

    setIsLoading(true)
    const slots: DateSlots[] = []
    
    for (let i = 0; i < daysAhead; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const { bookings, blockedSlots } = await checkSlotAvailability(dateStr)
      
      // Générer les créneaux avec attribution intelligente
      const daySlots = await generateDaySlots(date)
      
      // Appliquer les vérifications de disponibilité
      const processedSlots = daySlots.map(slot => {
        const vet = veterinarians.find(v => v.id === slot.veterinarian_id)
        if (!vet) return { ...slot, available: false }
        
        const vetDuration = getVetDuration(vet.id)
        
        // Vérifier si le créneau est occupé par un RDV
        const isBooked = bookings.some(booking => 
          booking.appointment_time === slot.time && 
          (booking.veterinarian_id === vet.id || !booking.veterinarian_id)
        )
        
        // Vérifier si le créneau est bloqué manuellement
        const isBlocked = blockedSlots.some(blocked => 
          blocked.start_time <= slot.time && 
          blocked.end_time > slot.time &&
          blocked.veterinarian_id === vet.id
        )
        
        // Vérifier les chevauchements avec les RDV selon la durée du vétérinaire
        const hasOverlap = bookings.some(booking => {
          if (booking.veterinarian_id !== vet.id && booking.veterinarian_id) return false
          
          const bookingStart = new Date(`2000-01-01T${booking.appointment_time}:00`)
          const bookingEnd = new Date(bookingStart.getTime() + (booking.duration_minutes || vetDuration) * 60000)
          const slotStart = new Date(`2000-01-01T${slot.time}:00`)
          const slotEnd = new Date(slotStart.getTime() + vetDuration * 60000)
          
          return (slotStart < bookingEnd && slotEnd > bookingStart)
        })
        
        return {
          ...slot,
          available: !isBooked && !isBlocked && !hasOverlap,
          blocked: isBlocked
        }
      })
      
      if (processedSlots.length > 0) {
        slots.push({
          date: dateStr,
          slots: processedSlots
        })
      }
    }
    
    setAvailableSlots(slots)
    setIsLoading(false)
  }

  const blockTimeSlot = async (date: string, startTime: string, endTime: string, veterinarianId: string) => {
    try {
      const { error } = await supabase
        .from('available_slots')
        .insert({
          date,
          start_time: startTime,
          end_time: endTime,
          veterinarian_id: veterinarianId,
          consultation_type_id: '16f9d223-ae87-498d-bcc8-b4f012d454bd', // Type "Urgence" par défaut
          is_booked: true,
          booking_id: null // Null pour indiquer un blocage manuel
        })

      if (error) throw error

      toast({
        title: "Créneau bloqué",
        description: "Le créneau a été bloqué avec succès",
      })

      // Recharger les créneaux
      await generateAvailableSlots()
      return true
    } catch (error) {
      console.error('Erreur lors du blocage:', error)
      toast({
        title: "Erreur",
        description: "Impossible de bloquer le créneau",
        variant: "destructive"
      })
      return false
    }
  }

  const unblockTimeSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', slotId)
        .is('booking_id', null) // Seulement les blocages manuels

      if (error) throw error

      toast({
        title: "Créneau débloqué",
        description: "Le créneau est maintenant disponible",
      })

      // Recharger les créneaux
      await generateAvailableSlots()
      return true
    } catch (error) {
      console.error('Erreur lors du déblocage:', error)
      toast({
        title: "Erreur",
        description: "Impossible de débloquer le créneau",
        variant: "destructive"
      })
      return false
    }
  }

  // Nouvelle fonction pour forcer la réassignation d'un créneau
  const reassignSlot = async (date: string, time: string, newVeterinarianId: string) => {
    try {
      const { error } = await supabase
        .from('slot_assignments')
        .upsert({
          date,
          time_slot: time,
          veterinarian_id: newVeterinarianId,
          assignment_type: 'manual'
        }, {
          onConflict: 'date,time_slot,veterinarian_id'
        })

      if (error) throw error

      toast({
        title: "Attribution modifiée",
        description: "Le créneau a été réassigné avec succès",
      })

      // Recharger les créneaux
      await generateAvailableSlots()
      return true
    } catch (error) {
      console.error('Erreur lors de la réassignation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de réassigner le créneau",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    if (settings.daily_schedules && veterinarians.length > 0) {
      generateAvailableSlots()
    }
  }, [settings, veterinarians])

  return {
    availableSlots,
    blockedSlots,
    isLoading,
    generateAvailableSlots,
    blockTimeSlot,
    unblockTimeSlot,
    reassignSlot,
    getVetDuration
  }
}