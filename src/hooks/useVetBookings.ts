
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Interface temporaire pour les bookings
interface BookingRow {
  id: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  client_name: string
  client_email: string
  client_phone: string
  animal_species: string
  animal_name?: string
  consultation_reason: string
  appointment_date?: string
  appointment_time?: string
  created_at: string
  updated_at: string
  urgency_score?: number
}

export const useVetBookings = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      
      // Pour l'instant, utiliser des données simulées car nous n'avons pas encore de table bookings
      const mockBookings: BookingRow[] = [
        {
          id: '1',
          status: 'pending',
          client_name: 'Marie Dupont',
          client_email: 'marie@example.com',
          client_phone: '0123456789',
          animal_species: 'chien',
          animal_name: 'Max',
          consultation_reason: 'vaccination',
          appointment_date: new Date().toISOString().split('T')[0],
          appointment_time: '10:00',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          urgency_score: 5
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 500)) // Simuler un délai
      setBookings(mockBookings)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement'
      setError(errorMessage)
      console.error('Erreur lors du chargement des réservations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      // Simuler la mise à jour
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status, updated_at: new Date().toISOString() }
          : booking
      ))

      toast({
        title: "Statut mis à jour",
        description: `La réservation est maintenant ${status}`,
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      return false
    }
  }

  const deleteBooking = async (bookingId: string) => {
    try {
      // Simuler la suppression
      setBookings(prev => prev.filter(booking => booking.id !== bookingId))

      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Statistiques calculées
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    highUrgency: bookings.filter(b => (b.urgency_score || 0) >= 7).length,
    todayBookings: bookings.filter(b => {
      const today = new Date().toISOString().split('T')[0]
      return b.appointment_date === today
    }).length
  }

  return {
    bookings,
    isLoading,
    error,
    stats,
    fetchBookings,
    updateBookingStatus,
    deleteBooking
  }
}
