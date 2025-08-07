
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateClinicData {
  clinicName: string;
  userEmail: string;
  userName: string;
  customSlug?: string; // Optional custom slug
}

interface CreateClinicResult {
  clinicId: string;
  userId: string;
  provisionalPassword: string;
  slug: string;
}

export const useAdminClinicCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Function to validate slug format
  const validateSlug = (slug: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 50;
  };

  // Function to check slug availability
  const checkSlugAvailability = async (slug: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('id')
        .eq('slug', slug)
        .single();

      if (error && error.code === 'PGRST116') {
        // No results found - slug is available
        return true;
      }

      return false; // Slug exists or other error
    } catch (error) {
      console.error('Error checking slug availability:', error);
      return false;
    }
  };

  // Function to generate slug from clinic name
  const generateSlugFromName = (clinicName: string): string => {
    return clinicName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const createManualClinic = async (data: CreateClinicData): Promise<CreateClinicResult> => {
    setIsCreating(true);
    
    try {
      // Validate input
      if (!data.clinicName?.trim() || !data.userEmail?.trim() || !data.userName?.trim()) {
        throw new Error('Tous les champs sont requis');
      }

      // If custom slug provided, validate it
      if (data.customSlug) {
        const trimmedSlug = data.customSlug.trim().toLowerCase();
        
        if (!validateSlug(trimmedSlug)) {
          throw new Error('Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets, et faire entre 2 et 50 caractères');
        }

        const isAvailable = await checkSlugAvailability(trimmedSlug);
        if (!isAvailable) {
          throw new Error('Ce slug est déjà utilisé par une autre clinique');
        }
      }

      console.log('Creating manual clinic with data:', data);

      // Call the edge function
      const { data: result, error } = await supabase.functions.invoke('admin-create-clinic', {
        body: {
          clinicName: data.clinicName.trim(),
          userEmail: data.userEmail.trim(),
          userName: data.userName.trim(),
          customSlug: data.customSlug?.trim().toLowerCase()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erreur lors de la création de la clinique');
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Erreur inconnue lors de la création');
      }

      toast({
        title: "Succès",
        description: "Clinique créée avec succès",
      });

      return {
        clinicId: result.clinicId,
        userId: result.userId,
        provisionalPassword: result.provisionalPassword,
        slug: result.slug
      };

    } catch (error) {
      console.error('Error creating manual clinic:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createManualClinic,
    isCreating,
    validateSlug,
    checkSlugAvailability,
    generateSlugFromName
  };
};
