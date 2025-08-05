
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVetAuth } from './useVetAuth';

export const useFirstLoginStatus = () => {
  const { user, isLoading: authLoading } = useVetAuth();
  const [needsFirstLogin, setNeedsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLoginStatus = async () => {
      if (authLoading || !user) {
        setIsLoading(authLoading);
        return;
      }

      try {
        console.log('🔄 Checking first login status for user:', user.id);
        
        // Check if user has provisional password metadata
        const hasProvisionalPassword = user.user_metadata?.provisional_password === true;
        const isFirstLogin = user.user_metadata?.first_login === true;

        if (hasProvisionalPassword && isFirstLogin) {
          console.log('✅ User needs first login flow');
          setNeedsFirstLogin(true);
        } else {
          // Double-check with admin_clinic_creations table
          const { data: adminCreation, error } = await supabase
            .from('admin_clinic_creations')
            .select('password_changed, first_login_completed')
            .eq('clinic_user_id', user.id)
            .single();

          if (!error && adminCreation) {
            const needsFlow = !adminCreation.password_changed || !adminCreation.first_login_completed;
            console.log('📊 Admin creation check:', { 
              needsFlow, 
              password_changed: adminCreation.password_changed,
              first_login_completed: adminCreation.first_login_completed
            });
            setNeedsFirstLogin(needsFlow);
          } else {
            setNeedsFirstLogin(false);
          }
        }
      } catch (error) {
        console.error('❌ Error checking first login status:', error);
        setNeedsFirstLogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLoginStatus();
  }, [user, authLoading]);

  return {
    needsFirstLogin,
    isLoading,
    refresh: () => {
      if (user) {
        setIsLoading(true);
        // Trigger re-check by updating the effect dependency
      }
    }
  };
};
