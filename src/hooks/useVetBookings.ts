
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type BookingRow = Database['public']['Tables']['bookings']['Row']

export const useVetBookings = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setBookings(data || [])
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement'
      setError(errorMessage)
      console.error('Erreur lors du chargement des réservations:', err)
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

      if (error) {
        throw error
      }

      // Mettre à jour l'état local
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
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) {
        throw error
      }

      // Mettre à jour l'état local
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
