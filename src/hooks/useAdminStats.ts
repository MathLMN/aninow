
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalClinicsCreated: number;
  pendingPasswordChanges: number;
  activeClinicAccounts: number;
  recentCreations: Array<{
    id: string;
    clinic_name: string;
    created_at: string;
  }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('🔄 Fetching admin statistics...');
      
      // Get total clinics created manually
      const { data: totalCreations, error: totalError } = await supabase
        .from('admin_clinic_creations')
        .select('id');

      if (totalError) {
        console.error('❌ Error fetching total creations:', totalError);
        throw totalError;
      }

      // Get pending password changes
      const { data: pendingChanges, error: pendingError } = await supabase
        .from('admin_clinic_creations')
        .select('id')
        .eq('password_changed', false);

      if (pendingError) {
        console.error('❌ Error fetching pending changes:', pendingError);
        throw pendingError;
      }

      // Get active clinic accounts
      const { data: activeAccounts, error: activeError } = await supabase
        .from('user_clinic_access')
        .select('id')
        .eq('is_active', true)
        .eq('role', 'admin');

      if (activeError) {
        console.error('❌ Error fetching active accounts:', activeError);
        throw activeError;
      }

      // Get recent creations
      const { data: recentCreations, error: recentError } = await supabase
        .from('admin_clinic_creations')
        .select(`
          id,
          created_at,
          clinics (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) {
        console.error('❌ Error fetching recent creations:', recentError);
        throw recentError;
      }

      const stats: AdminStats = {
        totalClinicsCreated: totalCreations?.length || 0,
        pendingPasswordChanges: pendingChanges?.length || 0,
        activeClinicAccounts: activeAccounts?.length || 0,
        recentCreations: (recentCreations || []).map(creation => ({
          id: creation.id,
          clinic_name: (creation.clinics as any)?.name || 'Nom indisponible',
          created_at: creation.created_at
        }))
      };

      console.log('✅ Admin stats loaded:', stats);
      return stats;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
