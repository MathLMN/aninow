
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClinicAccess } from './useClinicAccess';

export const useConsultationTypes = () => {
  const { currentClinicId } = useClinicAccess();

  const { data: consultationTypes = [], isLoading, error } = useQuery({
    queryKey: ['consultation-types', currentClinicId],
    queryFn: async () => {
      console.log('🔄 Fetching consultation types for clinic:', currentClinicId);
      
      if (!currentClinicId) {
        console.log('❌ No clinic ID available');
        return [];
      }

      const { data, error } = await supabase
        .from('consultation_types')
        .select('*')
        .eq('clinic_id', currentClinicId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching consultation types:', error);
        throw error;
      }

      console.log('✅ Consultation types loaded:', data?.length || 0, 'items');
      return data || [];
    },
    enabled: !!currentClinicId,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    consultationTypes,
    isLoading,
    error: error?.message || null
  };
};
