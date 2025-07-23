
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type VeterinarianRow = Database['public']['Tables']['clinic_veterinarians']['Row']
type ConsultationTypeRow = Database['public']['Tables']['consultation_types']['Row']
type AvailableSlotRow = Database['public']['Tables']['available_slots']['Row']
type SlotInsert = Database['public']['Tables']['available_slots']['Insert']

export const useSlotManagement = () => {
  const [veterinarians, setVeterinarians] = useState<VeterinarianRow[]>([])
  const [consultationTypes, setConsultationTypes] = useState<ConsultationTypeRow[]>([])
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchVeterinarians = async () => {
    try {
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .select('*')
        .order('name')

      if (error) throw error
      setVeterinarians(data || [])
    } catch (err: any) {
      console.error('Erreur lors du chargement des vétérinaires:', err)
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de charger les vétérinaires",
        variant: "destructive"
      })
    }
  }

  const fetchConsultationTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .order('name')

      if (error) throw error
      setConsultationTypes(data || [])
    } catch (err: any) {
      console.error('Erreur lors du chargement des types de consultation:', err)
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de consultation",
        variant: "destructive"
      })
    }
  }

  const fetchAvailableSlots = async (date?: string) => {
    try {
      let query = supabase
        .from('available_slots')
        .select(`
          *,
          clinic_veterinarians(name, specialty),
          consultation_types(name, duration_minutes, color)
        `)
        .order('date')
        .order('start_time')

      if (date) {
        query = query.eq('date', date)
      }

      const { data, error } = await query

      if (error) throw error
      setAvailableSlots(data || [])
    } catch (err: any) {
      console.error('Erreur lors du chargement des créneaux:', err)
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de charger les créneaux",
        variant: "destructive"
      })
    }
  }

  const createSlot = async (slotData: Omit<SlotInsert, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('available_slots')
        .insert([slotData])
        .select()

      if (error) throw error

      toast({
        title: "Créneau créé",
        description: "Le créneau a été ajouté avec succès",
      })

      // Recharger les créneaux
      await fetchAvailableSlots()
      return true
    } catch (err: any) {
      console.error('Erreur lors de la création du créneau:', err)
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
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', slotId)

      if (error) throw error

      toast({
        title: "Créneau supprimé",
        description: "Le créneau a été supprimé avec succès",
      })

      // Recharger les créneaux
      await fetchAvailableSlots()
      return true
    } catch (err: any) {
      console.error('Erreur lors de la suppression du créneau:', err)
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
      setIsLoading(true)
      setError(null)
      await Promise.all([
        fetchVeterinarians(),
        fetchConsultationTypes(),
        fetchAvailableSlots()
      ])
      setIsLoading(false)
    }

    loadData()
  }, [])

  return {
    veterinarians,
    consultationTypes,
    availableSlots,
    isLoading,
    error,
    fetchAvailableSlots,
    createSlot,
    deleteSlot
  }
}
