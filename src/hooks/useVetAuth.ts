
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VeterinarianProfile {
  id: string;
  name: string;
  specialty?: string;
  email: string;
  is_active: boolean;
}

interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  role: string;
  is_active: boolean;
}

export const useVetAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [veterinarian, setVeterinarian] = useState<VeterinarianProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setVeterinarian(null);
          setAdminProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📄 Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔄 Fetching user profile for user:', userId);
      
      // First, try to get veterinarian profile
      const { data: authLink, error: linkError } = await supabase
        .from('veterinarian_auth_users')
        .select(`
          veterinarian:clinic_veterinarians(
            id,
            name,
            specialty,
            email,
            is_active
          )
        `)
        .eq('user_id', userId)
        .single();

      if (!linkError && authLink?.veterinarian) {
        console.log('✅ Veterinarian profile loaded:', authLink.veterinarian);
        setVeterinarian(authLink.veterinarian as VeterinarianProfile);
        setIsLoading(false);
        return;
      }

      // If no veterinarian profile, check for admin profile
      console.log('🔄 No veterinarian profile found, checking for admin profile');
      
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (!adminError && adminData) {
        console.log('✅ Admin profile loaded:', adminData);
        setAdminProfile(adminData);
      } else {
        console.log('❌ No valid profile found for user');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      setIsLoading(false);
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

      console.log('✅ Sign in successful');
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
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la déconnexion",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Sign out successful');
      setUser(null);
      setSession(null);
      setVeterinarian(null);
      setAdminProfile(null);
      
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error) {
      console.error('❌ Sign out exception:', error);
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

  // User is authenticated if they have either a veterinarian profile OR an admin profile
  const isAuthenticated = !!user && (!!veterinarian || !!adminProfile);

  return {
    user,
    session,
    veterinarian,
    adminProfile,
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
