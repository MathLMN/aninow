
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateClinicData {
  name: string;
}

interface ClinicData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const useClinicManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createClinicMutation = useMutation({
    mutationFn: async (clinicData: CreateClinicData) => {
      console.log('🔄 Creating new clinic:', clinicData);
      
      // First, create the clinic
      const { data: clinic, error: clinicError } = await supabase
        .from('clinics')
        .insert([clinicData])
        .select()
        .single();

      if (clinicError) {
        console.error('❌ Error creating clinic:', clinicError);
        throw clinicError;
      }

      // Then, create the user's access to this clinic
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: accessError } = await supabase
        .from('user_clinic_access')
        .insert([{
          user_id: user.id,
          clinic_id: clinic.id,
          role: 'admin',
          is_active: true
        }]);

      if (accessError) {
        console.error('❌ Error creating clinic access:', accessError);
        throw accessError;
      }

      console.log('✅ Clinic and access created:', clinic);
      return clinic as ClinicData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-access'] });
      toast({
        title: "Clinique créée",
        description: "La nouvelle clinique a été créée avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to create clinic:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la clinique",
        variant: "destructive",
      });
    },
  });

  const updateClinicMutation = useMutation({
    mutationFn: async ({ clinicId, clinicData }: { clinicId: string; clinicData: Partial<CreateClinicData> }) => {
      console.log('🔄 Updating clinic:', { clinicId, clinicData });
      
      const { data, error } = await supabase
        .from('clinics')
        .update(clinicData)
        .eq('id', clinicId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating clinic:', error);
        throw error;
      }

      console.log('✅ Clinic updated:', data);
      return data as ClinicData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-access'] });
      toast({
        title: "Clinique mise à jour",
        description: "Les informations de la clinique ont été mises à jour",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update clinic:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la clinique",
        variant: "destructive",
      });
    },
  });

  return {
    createClinic: async (clinicData: CreateClinicData) => {
      try {
        await createClinicMutation.mutateAsync(clinicData);
        return true;
      } catch {
        return false;
      }
    },
    updateClinic: async (clinicId: string, clinicData: Partial<CreateClinicData>) => {
      try {
        await updateClinicMutation.mutateAsync({ clinicId, clinicData });
        return true;
      } catch {
        return false;
      }
    },
    isCreatingClinic: createClinicMutation.isPending,
    isUpdatingClinic: updateClinicMutation.isPending
  };
};
