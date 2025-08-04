
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
      console.log('🔄 Creating manual clinic account:', data);
      
      // Generate a provisional password
      const provisionalPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      
      // First, create the user account with Supabase Auth
      const { data: authResult, error: authError } = await supabase.auth.admin.createUser({
        email: data.userEmail,
        password: provisionalPassword,
        email_confirm: true,
        user_metadata: {
          name: data.userName,
          provisional_password: true,
          first_login: true
        }
      });

      if (authError || !authResult.user) {
        console.error('❌ Error creating user:', authError);
        throw new Error(authError?.message || 'Failed to create user account');
      }

      const userId = authResult.user.id;
      
      // Create the clinic
      const { data: clinic, error: clinicError } = await supabase
        .from('clinics')
        .insert([{ name: data.clinicName }])
        .select()
        .single();

      if (clinicError) {
        console.error('❌ Error creating clinic:', clinicError);
        throw new Error('Failed to create clinic');
      }

      // Create user clinic access with admin tracking
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      
      if (!adminUser) {
        throw new Error('Admin user not authenticated');
      }

      const { error: accessError } = await supabase
        .from('user_clinic_access')
        .insert([{
          user_id: userId,
          clinic_id: clinic.id,
          role: 'admin',
          is_active: true,
          created_by_admin: adminUser.id,
          provisional_password_set: true
        }]);

      if (accessError) {
        console.error('❌ Error creating clinic access:', accessError);
        throw new Error('Failed to create clinic access');
      }

      // Track the manual creation
      const { error: trackingError } = await supabase
        .from('admin_clinic_creations')
        .insert([{
          clinic_id: clinic.id,
          admin_user_id: adminUser.id,
          clinic_user_id: userId,
          provisional_password: provisionalPassword,
          password_changed: false,
          first_login_completed: false
        }]);

      if (trackingError) {
        console.error('❌ Error tracking manual creation:', trackingError);
        // Don't throw here as the main creation succeeded
      }

      console.log('✅ Manual clinic account created successfully');
      return {
        clinicId: clinic.id,
        userId,
        provisionalPassword
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
