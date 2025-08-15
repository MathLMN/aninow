
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export interface RecurringSlotBlock {
  id: string;
  clinic_id: string;
  veterinarian_id: string;
  title: string;
  description?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useRecurringSlotBlocks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();

  // Récupérer tous les blocages récurrents
  const { data: recurringBlocks = [], isLoading: blocksLoading } = useQuery({
    queryKey: ['recurring-slot-blocks', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId) return [];
      
      const { data, error } = await supabase
        .from('recurring_slot_blocks')
        .select('*')
        .eq('clinic_id', currentClinicId)
        .eq('is_active', true)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      return data as RecurringSlotBlock[];
    },
    enabled: !!currentClinicId
  });

  // Créer un nouveau blocage récurrent
  const createRecurringBlock = useMutation({
    mutationFn: async (blockData: Omit<RecurringSlotBlock, 'id' | 'created_at' | 'updated_at' | 'clinic_id'>) => {
      if (!currentClinicId) throw new Error('No clinic ID available');

      const { data, error } = await supabase
        .from('recurring_slot_blocks')
        .insert({
          ...blockData,
          clinic_id: currentClinicId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-slot-blocks'] });
      toast({
        title: "Blocage récurrent créé",
        description: "Le blocage récurrent a été créé avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Error creating recurring block:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le blocage récurrent",
        variant: "destructive"
      });
    }
  });

  // Mettre à jour un blocage récurrent
  const updateRecurringBlock = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RecurringSlotBlock> & { id: string }) => {
      const { data, error } = await supabase
        .from('recurring_slot_blocks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-slot-blocks'] });
      toast({
        title: "Blocage récurrent modifié",
        description: "Le blocage récurrent a été modifié avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Error updating recurring block:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le blocage récurrent",
        variant: "destructive"
      });
    }
  });

  // Supprimer un blocage récurrent (désactivation)
  const deleteRecurringBlock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recurring_slot_blocks')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-slot-blocks'] });
      toast({
        title: "Blocage récurrent supprimé",
        description: "Le blocage récurrent a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting recurring block:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le blocage récurrent",
        variant: "destructive"
      });
    }
  });

  return {
    recurringBlocks,
    isLoading: isLoading || blocksLoading,
    createRecurringBlock: createRecurringBlock.mutateAsync,
    updateRecurringBlock: updateRecurringBlock.mutateAsync,
    deleteRecurringBlock: deleteRecurringBlock.mutateAsync,
    isCreating: createRecurringBlock.isPending,
    isUpdating: updateRecurringBlock.isPending,
    isDeleting: deleteRecurringBlock.isPending
  };
};
