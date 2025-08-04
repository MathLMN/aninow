
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export interface VeterinarianAbsence {
  id?: string;
  veterinarian_id: string;
  start_date: string;
  end_date: string;
  absence_type: string;
  reason?: string;
  is_recurring: boolean;
  clinic_id?: string;
}

export const useVeterinarianAbsences = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();

  const { 
    data: absences = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['veterinarian-absences', currentClinicId],
    queryFn: async () => {
      console.log('🔄 Fetching veterinarian absences for clinic:', currentClinicId);
      
      const { data, error } = await supabase
        .from('veterinarian_absences')
        .select(`
          *,
          clinic_veterinarians(name)
        `)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching absences:', error);
        throw error;
      }

      console.log('✅ Absences loaded:', data?.length || 0, 'items');
      return data || [];
    },
    enabled: !!currentClinicId,
  });

  const addAbsenceMutation = useMutation({
    mutationFn: async (absence: Omit<VeterinarianAbsence, 'id'>) => {
      if (!currentClinicId) {
        throw new Error('No clinic selected');
      }

      console.log('🔄 Adding absence:', absence);
      
      const { data, error } = await supabase
        .from('veterinarian_absences')
        .insert([{
          ...absence,
          clinic_id: currentClinicId
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding absence:', error);
        throw error;
      }

      console.log('✅ Absence added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarian-absences'] });
      toast({
        title: "Absence ajoutée",
        description: "L'absence a été ajoutée avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to add absence:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'absence",
        variant: "destructive",
      });
    },
  });

  const deleteAbsenceMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🔄 Deleting absence:', id);
      
      const { error } = await supabase
        .from('veterinarian_absences')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting absence:', error);
        throw error;
      }

      console.log('✅ Absence deleted');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarian-absences'] });
      toast({
        title: "Absence supprimée",
        description: "L'absence a été supprimée avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to delete absence:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'absence",
        variant: "destructive",
      });
    },
  });

  return {
    absences,
    isLoading,
    error: error?.message || null,
    refetch,
    addAbsence: async (absence: Omit<VeterinarianAbsence, 'id'>) => {
      try {
        await addAbsenceMutation.mutateAsync(absence);
        return true;
      } catch {
        return false;
      }
    },
    deleteAbsence: async (id: string) => {
      try {
        await deleteAbsenceMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    }
  };
};
