
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClinicAccess } from './useClinicAccess'
import type { Database } from '@/integrations/supabase/types'

type ConsultationTypeRow = Database['public']['Tables']['consultation_types']['Row']

export const useConsultationTypes = () => {
  const [consultationTypes, setConsultationTypes] = useState<ConsultationTypeRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { currentClinicId } = useClinicAccess()

  const fetchConsultationTypes = async () => {
    if (!currentClinicId) {
      console.log('⏳ No clinic ID available, skipping consultation types fetch');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching consultation types for clinic:', currentClinicId);
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .eq('clinic_id', currentClinicId)
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
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de consultation",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createConsultationType = async (consultationType: Omit<ConsultationTypeRow, 'id' | 'created_at' | 'clinic_id'>) => {
    if (!currentClinicId) {
      toast({
        title: "Erreur",
        description: "Aucune clinique sélectionnée",
        variant: "destructive"
      })
      return false
    }

    try {
      console.log('🔄 Creating consultation type:', consultationType);
      const { data, error } = await supabase
        .from('consultation_types')
        .insert([{
          ...consultationType,
          clinic_id: currentClinicId
        }])
        .select()

      if (error) {
        console.error('❌ Error creating consultation type:', error);
        throw error;
      }

      console.log('✅ Consultation type created:', data);
      toast({
        title: "Type de consultation créé",
        description: "Le nouveau type a été ajouté avec succès",
      })

      // Refresh the list
      await fetchConsultationTypes()
      return true
    } catch (err: any) {
      console.error('❌ Failed to create consultation type:', err)
      toast({
        title: "Erreur",
        description: "Impossible de créer le type de consultation",
        variant: "destructive"
      })
      return false
    }
  }

  const updateConsultationType = async (id: string, updates: Partial<ConsultationTypeRow>) => {
    try {
      console.log('🔄 Updating consultation type:', id, updates);
      const { data, error } = await supabase
        .from('consultation_types')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        console.error('❌ Error updating consultation type:', error);
        throw error;
      }

      console.log('✅ Consultation type updated:', data);
      toast({
        title: "Type de consultation mis à jour",
        description: "Les modifications ont été sauvegardées",
      })

      // Refresh the list
      await fetchConsultationTypes()
      return true
    } catch (err: any) {
      console.error('❌ Failed to update consultation type:', err)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le type de consultation",
        variant: "destructive"
      })
      return false
    }
  }

  const deleteConsultationType = async (id: string) => {
    try {
      console.log('🔄 Deleting consultation type:', id);
      const { error } = await supabase
        .from('consultation_types')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting consultation type:', error);
        throw error;
      }

      console.log('✅ Consultation type deleted');
      toast({
        title: "Type de consultation supprimé",
        description: "Le type a été supprimé avec succès",
      })

      // Refresh the list
      await fetchConsultationTypes()
      return true
    } catch (err: any) {
      console.error('❌ Failed to delete consultation type:', err)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type de consultation",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    if (currentClinicId) {
      fetchConsultationTypes()
    }
  }, [currentClinicId])

  return {
    consultationTypes,
    isLoading,
    error,
    fetchConsultationTypes,
    createConsultationType,
    updateConsultationType,
    deleteConsultationType
  }
}
