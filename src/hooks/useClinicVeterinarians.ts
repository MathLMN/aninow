
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Veterinarian {
  id?: string
  name: string
  email?: string
  specialty?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export const useClinicVeterinarians = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchVeterinarians = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .select('*')
        .order('name')

      if (error) throw error

      setVeterinarians(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement des vétérinaires:', err)
      toast({
        title: "Erreur",
        description: "Impossible de charger les vétérinaires",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addVeterinarian = async (veterinarian: Omit<Veterinarian, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .insert([veterinarian])
        .select()
        .single()

      if (error) throw error

      setVeterinarians(prev => [...prev, data])
      toast({
        title: "Vétérinaire ajouté",
        description: "Le vétérinaire a été ajouté avec succès",
      })

      return true
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le vétérinaire",
        variant: "destructive"
      })
      return false
    }
  }

  const updateVeterinarian = async (id: string, updates: Partial<Veterinarian>) => {
    try {
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setVeterinarians(prev => prev.map(vet => vet.id === id ? data : vet))
      toast({
        title: "Vétérinaire mis à jour",
        description: "Les informations ont été sauvegardées",
      })

      return true
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le vétérinaire",
        variant: "destructive"
      })
      return false
    }
  }

  const deleteVeterinarian = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clinic_veterinarians')
        .delete()
        .eq('id', id)

      if (error) throw error

      setVeterinarians(prev => prev.filter(vet => vet.id !== id))
      toast({
        title: "Vétérinaire supprimé",
        description: "Le vétérinaire a été supprimé avec succès",
      })

      return true
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le vétérinaire",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    fetchVeterinarians()
  }, [])

  return {
    veterinarians,
    isLoading,
    addVeterinarian,
    updateVeterinarian,
    deleteVeterinarian
  }
}
