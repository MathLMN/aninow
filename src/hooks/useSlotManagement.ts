
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type ClinicVeterinarianRow = Database['public']['Tables']['clinic_veterinarians']['Row']
type ConsultationTypeRow = Database['public']['Tables']['consultation_types']['Row']
type AvailableSlotRow = Database['public']['Tables']['available_slots']['Row']
type SlotInsert = Database['public']['Tables']['available_slots']['Insert']

export const useSlotManagement = () => {
  const [consultationTypes, setConsultationTypes] = useState<ConsultationTypeRow[]>([])
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Note: Veterinarian fetching is now handled by useClinicVeterinarians hook
  // This provides proper clinic-scoped access for authenticated users

  const fetchConsultationTypes = async () => {
    try {
      console.log('🔄 Fetching consultation types...');
      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .order('name')

      if (error) {
        console.error('❌ Error fetching consultation types:', error);
        throw error;
      }
      console.log('✅ Consultation types loaded:', data?.length || 0);
      setConsultationTypes(data || [])
    } catch (err: any) {
      console.error('❌ Failed to fetch consultation types:', err)
      setError(err.message)
      // Don't show toast for this error, it's handled by the main component
    }
  }

  const fetchAvailableSlots = async (date?: string) => {
    try {
      console.log('🔄 Fetching available slots...');
      let query = supabase
        .from('available_slots')
        .select('*')
        .order('date')
        .order('start_time')

      if (date) {
        query = query.eq('date', date)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ Error fetching slots:', error);
        throw error;
      }
      console.log('✅ Available slots loaded:', data?.length || 0);
      setAvailableSlots(data || [])
    } catch (err: any) {
      console.error('❌ Failed to fetch available slots:', err)
      setError(err.message)
      // Don't show toast for this error, it's handled by the main component
    }
  }

  const createSlot = async (slotData: Omit<SlotInsert, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('🔄 Creating slot:', slotData);
      const { data, error } = await supabase
        .from('available_slots')
        .insert([slotData])
        .select()

      if (error) {
        console.error('❌ Error creating slot:', error);
        throw error;
      }

      console.log('✅ Slot created:', data);
      toast({
        title: "Créneau créé",
        description: "Le créneau a été ajouté avec succès",
      })

      // Recharger les créneaux
      await fetchAvailableSlots()
      return true
    } catch (err: any) {
      console.error('❌ Failed to create slot:', err)
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de créer le créneau",
        variant: "destructive"
      })
      return false
    }
  }

  const deleteSlot = async (slotId: string) => {
    try {
      console.log('🔄 Deleting slot:', slotId);
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', slotId)

      if (error) {
        console.error('❌ Error deleting slot:', error);
        throw error;
      }

      console.log('✅ Slot deleted');
      toast({
        title: "Créneau supprimé",
        description: "Le créneau a été supprimé avec succès",
      })

      // Recharger les créneaux
      await fetchAvailableSlots()
      return true
    } catch (err: any) {
      console.error('❌ Failed to delete slot:', err)
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le créneau",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Loading slot management data...');
      setIsLoading(true)
      setError(null)
      
      try {
        await Promise.all([
          fetchConsultationTypes(),
          fetchAvailableSlots()
        ])
        console.log('✅ All slot management data loaded successfully');
      } catch (err: any) {
        console.error('❌ Failed to load slot management data:', err);
        setError(err.message || 'Erreur lors du chargement des données')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return {
    consultationTypes,
    availableSlots,
    isLoading,
    error,
    fetchAvailableSlots,
    createSlot,
    deleteSlot
  }
}
