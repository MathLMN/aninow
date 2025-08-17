
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClinicAccess } from './useClinicAccess'
import type { Database } from '@/integrations/supabase/types'

type ConsultationTypeRow = Database['public']['Tables']['consultation_types']['Row']

export const useConsultationTypes = () => {
  const [consultationTypes, setConsultationTypes] = useState<ConsultationTypeRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { currentClinicId } = useClinicAccess()

  const fetchConsultationTypes = async () => {
    if (!currentClinicId) {
      console.log('⏳ No clinic ID available for fetching consultation types')
      setIsLoading(false)
      return
    }

    try {
      console.log('🔄 Fetching consultation types for clinic:', currentClinicId)
      
      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .eq('clinic_id', currentClinicId)
        .order('name')

      if (error) {
        console.error('❌ Error fetching consultation types:', error)
        throw error
      }

      console.log('✅ Consultation types loaded:', data?.length || 0)
      setConsultationTypes(data || [])
    } catch (err: any) {
      console.error('❌ Failed to fetch consultation types:', err)
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de consultation",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
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
    refetch: fetchConsultationTypes
  }
}
