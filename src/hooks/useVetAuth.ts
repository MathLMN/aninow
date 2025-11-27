
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface ClinicAccess {
  id: string;
  user_id: string;
  clinic_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useVetAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [clinicAccess, setClinicAccess] = useState<ClinicAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        console.log('📊 Full session object:', session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user logs in
        if (session?.user) {
          console.log('👤 User authenticated, fetching profile for user ID:', session.user.id);
          
          // Don't show loading screen for token refresh events
          const shouldShowLoading = event !== 'TOKEN_REFRESHED';
          
          setTimeout(() => {
            fetchUserProfile(session.user.id, shouldShowLoading);
          }, 0);
        } else {
          console.log('🚪 User logged out, clearing profiles');
          setAdminProfile(null);
          setClinicAccess(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📄 Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Found existing session, fetching profile for user ID:', session.user.id);
        fetchUserProfile(session.user.id);
      } else {
        console.log('❌ No existing session found');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, showLoading = true) => {
    try {
      console.log('🔄 Starting profile fetch for user:', userId);
      
      // Only show loading screen during initial load
      if (showLoading && isInitialLoad) {
        setIsLoading(true);
      }
      
      // First, check for admin profile
      console.log('👨‍💼 Checking for admin profile...');
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      console.log('👨‍💼 Admin query result:', { adminData, adminError });

      if (!adminError && adminData) {
        console.log('✅ Admin profile found:', adminData);
        setAdminProfile(adminData);
        setIsLoading(false);
        setIsInitialLoad(false);
        return;
      }

      // If no admin profile, check for clinic access
      console.log('🏥 No admin profile found, checking for clinic access...');
      
      const { data: clinicData, error: clinicError } = await supabase
        .from('user_clinic_access')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      console.log('🏥 Clinic access query result:', { clinicData, clinicError });

      if (!clinicError && clinicData) {
        console.log('✅ Clinic access found:', clinicData);
        setClinicAccess(clinicData);
      } else {
        console.log('❌ No clinic access found');
        console.log('🔍 Final status: No valid profile found for user ID:', userId);
        console.log('🗃️ User should have either:');
        console.log('   - admin_users entry (for global admins)');
        console.log('   - user_clinic_access entry (for clinic users)');
      }
      
      setIsLoading(false);
      setIsInitialLoad(false);
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      console.error('🚨 This might be a database structure issue');
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('🔄 Attempting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message === 'Invalid login credentials' 
            ? 'Email ou mot de passe incorrect'
            : error.message,
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Sign in successful for user:', data.user?.email);
      console.log('🎯 User ID:', data.user?.id);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      return { data, error: null };
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return { error };
    } finally {
      // Don't set loading to false here, let the auth state change handle it
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out...');
      const { error } = await supabase.auth.signOut();
      
      // Ignore "session not found" errors - session might already be invalid
      if (error && !error.message?.includes('session_not_found') && error.status !== 403) {
        console.error('❌ Sign out error:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la déconnexion",
          variant: "destructive"
        });
        // Still clear local state even if server logout fails
      }

      console.log('✅ Sign out successful (or session already invalid)');
      // Always clear local state regardless of server response
      setUser(null);
      setSession(null);
      setAdminProfile(null);
      setClinicAccess(null);
      
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error) {
      console.error('❌ Sign out exception:', error);
      // Clear local state even on exception
      setUser(null);
      setSession(null);
      setAdminProfile(null);
      setClinicAccess(null);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 Requesting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/vet/reset-password`,
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer l'email de réinitialisation",
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Password reset email sent');
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte email pour réinitialiser votre mot de passe",
      });

      return { error: null };
    } catch (error) {
      console.error('❌ Password reset exception:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('🔄 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Password update error:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le mot de passe",
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Password updated');
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });

      return { error: null };
    } catch (error) {
      console.error('❌ Password update exception:', error);
      return { error };
    }
  };

  // User is authenticated if they have either admin profile OR clinic access
  const isAuthenticated = !!user && (!!adminProfile || !!clinicAccess);

  console.log('🎯 Current auth status:', {
    user: !!user,
    adminProfile: !!adminProfile,
    clinicAccess: !!clinicAccess,
    isAuthenticated,
    isLoading
  });

  return {
    user,
    session,
    veterinarian: null, // Deprecated - kept for backward compatibility
    adminProfile,
    clinicAccess,
    isAdmin: !!adminProfile,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refetchProfile: () => {
      if (user) {
        fetchUserProfile(user.id);
      }
    }
  };
};
