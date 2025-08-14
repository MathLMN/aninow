
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

interface VeterinarianAbsence {
  id: string;
  veterinarian_id: string;
  start_date: string;
  end_date: string;
  absence_type: 'vacation' | 'sick_leave' | 'training' | 'other';
  reason: string;
  is_recurring: boolean;
  clinic_id: string;
  created_at: string;
  updated_at: string;
  clinic_veterinarians?: {
    id: string;
    name: string;
    email: string;
  };
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
      if (!currentClinicId) {
        console.log('❌ No clinic ID available for fetching absences');
        return [];
      }

      console.log('🔄 Fetching veterinarian absences for clinic:', currentClinicId);
      
      const { data, error } = await supabase
        .from('veterinarian_absences')
        .select(`
          *,
          clinic_veterinarians!inner (
            id,
            name,
            email
          )
        `)
        .eq('clinic_id', currentClinicId)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching absences:', error);
        throw error;
      }

      console.log('✅ Absences loaded:', data?.length || 0);
      return (data || []) as VeterinarianAbsence[];
    },
    enabled: !!currentClinicId,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  const addAbsenceMutation = useMutation({
    mutationFn: async (absence: Omit<VeterinarianAbsence, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('🔄 Adding absence:', absence);
      
      if (!currentClinicId) {
        throw new Error('No clinic ID available');
      }

      const { data, error } = await supabase
        .from('veterinarian_absences')
        .insert([{ ...absence, clinic_id: currentClinicId }])
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
      queryClient.invalidateQueries({ queryKey: ['veterinarian-absences', currentClinicId] });
      toast({
        title: "Absence ajoutée",
        description: "L'absence a été programmée avec succès",
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

  const updateAbsenceMutation = useMutation({
    mutationFn: async ({ id, absence }: { id: string; absence: Omit<VeterinarianAbsence, 'id' | 'created_at' | 'updated_at'> }) => {
      console.log('🔄 Updating absence:', id, absence);
      
      const { data, error } = await supabase
        .from('veterinarian_absences')
        .update(absence)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating absence:', error);
        throw error;
      }

      console.log('✅ Absence updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarian-absences', currentClinicId] });
      toast({
        title: "Absence modifiée",
        description: "L'absence a été modifiée avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update absence:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'absence",
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
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarian-absences', currentClinicId] });
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
    addAbsence: async (absence: Omit<VeterinarianAbsence, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        await addAbsenceMutation.mutateAsync(absence);
        return true;
      } catch {
        return false;
      }
    },
    updateAbsence: async (id: string, absence: Omit<VeterinarianAbsence, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        await updateAbsenceMutation.mutateAsync({ id, absence });
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
    },
  };
};
