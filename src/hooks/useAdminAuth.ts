
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useVetAuth } from './useVetAuth';

export const useAdminAuth = () => {
  const { user } = useVetAuth();

  const { data: adminUser, isLoading: adminLoading } = useQuery({
    queryKey: ['admin-user', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('🔄 Checking admin status for user:', user.id);
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error checking admin status:', error);
        throw error;
      }

      console.log('✅ Admin check result:', data);
      return data;
    },
    enabled: !!user?.id,
    retry: 1,
  });

  return {
    adminUser,
    isAdmin: !!adminUser,
    adminLoading
  };
};
