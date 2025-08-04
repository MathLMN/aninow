
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdvancedVetAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      console.log('🔄 Demande de changement de mot de passe...');

      const { data, error } = await supabase.functions.invoke('vet-auth-advanced', {
        body: {
          action: 'change_password',
          current_password: currentPassword,
          new_password: newPassword
        }
      });

      if (error) {
        console.error('❌ Erreur lors du changement de mot de passe:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de changer le mot de passe",
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Mot de passe changé avec succès');
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Exception lors du changement de mot de passe:', error);
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

  const createVetAccount = async (email: string, password: string, veterinarianId: string) => {
    try {
      setIsLoading(true);
      console.log('🔄 Création d\'un compte vétérinaire...');

      const { data, error } = await supabase.functions.invoke('vet-auth-advanced', {
        body: {
          action: 'create_vet_account',
          email,
          password,
          veterinarian_id: veterinarianId
        }
      });

      if (error) {
        console.error('❌ Erreur lors de la création du compte:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de créer le compte",
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Compte créé avec succès');
      toast({
        title: "Compte créé",
        description: `Compte créé avec succès pour ${email}`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Exception lors de la création du compte:', error);
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

  const deactivateAccount = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Désactivation du compte...');

      const { data, error } = await supabase.functions.invoke('vet-auth-advanced', {
        body: {
          action: 'deactivate_account'
        }
      });

      if (error) {
        console.error('❌ Erreur lors de la désactivation:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de désactiver le compte",
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Compte désactivé avec succès');
      toast({
        title: "Compte désactivé",
        description: "Votre compte a été désactivé avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Exception lors de la désactivation:', error);
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

  return {
    changePassword,
    createVetAccount,
    deactivateAccount,
    isLoading
  };
};
