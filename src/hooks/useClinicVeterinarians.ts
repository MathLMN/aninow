import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export const useClinicVeterinarians = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();

  const { 
    data: veterinarians = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clinic-veterinarians', currentClinicId],
    queryFn: async () => {
      console.log('🔄 Fetching clinic veterinarians for clinic:', currentClinicId);
      
      if (!currentClinicId) {
        console.log('❌ No clinic ID available');
        return [];
      }

      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .select('*')
        .eq('clinic_id', currentClinicId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching veterinarians:', error);
        throw error;
      }

      console.log('✅ Veterinarians loaded:', data?.length || 0, 'items');
      return data || [];
    },
    enabled: !!currentClinicId,
    retry: 3,
    staleTime: 30 * 1000, // 30 seconds
  });

  const addVeterinarianMutation = useMutation({
    mutationFn: async (vetData: { name: string; specialty: string; is_active: boolean }) => {
      if (!currentClinicId) {
        throw new Error('No clinic selected');
      }

      console.log('🔄 Adding veterinarian:', vetData);
      
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .insert([{
          ...vetData,
          clinic_id: currentClinicId
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding veterinarian:', error);
        throw error;
      }

      console.log('✅ Veterinarian added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-veterinarians'] });
      toast({
        title: "Vétérinaire ajouté",
        description: "Le vétérinaire a été ajouté avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to add veterinarian:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le vétérinaire",
        variant: "destructive",
      });
    },
  });

  const updateVeterinarianMutation = useMutation({
    mutationFn: async ({ id, vetData }: { id: string; vetData: { name: string; specialty: string; is_active: boolean } }) => {
      console.log('🔄 Updating veterinarian:', { id, vetData });
      
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .update(vetData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating veterinarian:', error);
        throw error;
      }

      console.log('✅ Veterinarian updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-veterinarians'] });
      toast({
        title: "Vétérinaire mis à jour",
        description: "Les informations du vétérinaire ont été mises à jour avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update veterinarian:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le vétérinaire",
        variant: "destructive",
      });
    },
  });

  const deleteVeterinarianMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🔄 Deleting veterinarian:', id);
      
      const { error } = await supabase
        .from('clinic_veterinarians')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting veterinarian:', error);
        throw error;
      }

      console.log('✅ Veterinarian deleted');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-veterinarians'] });
      toast({
        title: "Vétérinaire supprimé",
        description: "Le vétérinaire a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to delete veterinarian:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le vétérinaire",
        variant: "destructive",
      });
    },
  });

  return {
    veterinarians,
    isLoading,
    error: error?.message || null,
    refetch,
    addVeterinarian: async (vetData: { name: string; specialty: string; is_active: boolean }) => {
      try {
        await addVeterinarianMutation.mutateAsync(vetData);
        return true;
      } catch {
        return false;
      }
    },
    updateVeterinarian: async (id: string, vetData: { name: string; specialty: string; is_active: boolean }) => {
      try {
        await updateVeterinarianMutation.mutateAsync({ id, vetData });
        return true;
      } catch {
        return false;
      }
    },
    deleteVeterinarian: async (id: string) => {
      try {
        await deleteVeterinarianMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    }
  };
};
