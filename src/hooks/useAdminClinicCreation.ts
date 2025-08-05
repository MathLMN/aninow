
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateManualClinicData {
  clinicName: string;
  userEmail: string;
  userName: string;
}

interface ManualClinicCreationResult {
  clinicId: string;
  userId: string;
  provisionalPassword: string;
}

export const useAdminClinicCreation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createManualClinicMutation = useMutation({
    mutationFn: async (data: CreateManualClinicData): Promise<ManualClinicCreationResult> => {
      console.log('🔄 Creating manual clinic account via Edge Function:', data);
      
      // Call the Edge Function to handle the creation
      const { data: result, error } = await supabase.functions.invoke('admin-create-clinic', {
        body: {
          clinicName: data.clinicName,
          userEmail: data.userEmail,
          userName: data.userName
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(error.message || 'Failed to create clinic account');
      }

      if (!result) {
        throw new Error('No response from server');
      }

      if (result.error) {
        console.error('❌ Server error:', result.error);
        throw new Error(result.error);
      }

      console.log('✅ Manual clinic account created successfully via Edge Function');
      return {
        clinicId: result.clinicId,
        userId: result.userId,
        provisionalPassword: result.provisionalPassword
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-access'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['manually-created-accounts'] });
      toast({
        title: "Compte clinique créé",
        description: "Le compte a été créé avec succès. Les identifiants ont été générés.",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Failed to create manual clinic account:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le compte clinique",
        variant: "destructive",
      });
    },
  });

  return {
    createManualClinic: createManualClinicMutation.mutateAsync,
    isCreating: createManualClinicMutation.isPending,
    error: createManualClinicMutation.error
  };
};
