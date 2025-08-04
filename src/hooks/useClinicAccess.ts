
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserClinicAccess {
  id: string;
  user_id: string;
  clinic_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clinics: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export const useClinicAccess = () => {
  const { toast } = useToast();

  const {
    data: clinicAccess,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clinic-access'],
    queryFn: async () => {
      console.log('🔄 Fetching user clinic access...');
      
      const { data, error } = await supabase
        .from('user_clinic_access')
        .select(`
          *,
          clinics (
            id,
            name,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching clinic access:', error);
        throw error;
      }

      console.log('✅ Clinic access loaded:', data?.length || 0, 'items');
      return (data || []) as UserClinicAccess[];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get the current clinic (first active one)
  const currentClinic = clinicAccess?.[0]?.clinics || null;
  const currentClinicId = currentClinic?.id || null;
  const userRole = clinicAccess?.[0]?.role || null;

  return {
    clinicAccess: clinicAccess || [],
    currentClinic,
    currentClinicId,
    userRole,
    isLoading,
    error: error?.message || null,
    refetch
  };
};
