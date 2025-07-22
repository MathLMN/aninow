
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClinicVeterinarians = () => {
  const { 
    data: veterinarians = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clinic-veterinarians'],
    queryFn: async () => {
      console.log('🔄 Fetching clinic veterinarians...');
      
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching veterinarians:', error);
        throw error;
      }

      console.log('✅ Veterinarians loaded:', data?.length || 0, 'items');
      return data || [];
    },
  });

  return {
    veterinarians,
    isLoading,
    error: error?.message || null,
    refetch
  };
};
