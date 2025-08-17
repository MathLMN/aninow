import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export const useSlotManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();

  const { data, isLoading, error } = useQuery({
    queryKey: ['available-slots', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId) {
        console.log('No clinic ID available');
        return [];
      }

      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('clinic_id', currentClinicId);

      if (error) {
        console.error('Error fetching available slots:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!currentClinicId,
  });

  const createSlotMutation = useMutation({
    mutationFn: async (newSlot) => {
      const { data, error } = await supabase
        .from('available_slots')
        .insert([newSlot]);

      if (error) {
        console.error('Error creating slot:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      toast({
        title: "Créneau ajouté",
        description: "Le créneau a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error creating slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le créneau.",
        variant: "destructive"
      });
    },
  });

  const updateSlotMutation = useMutation({
    mutationFn: async ({ slotId, updatedSlot }) => {
      const { data, error } = await supabase
        .from('available_slots')
        .update(updatedSlot)
        .eq('id', slotId);

      if (error) {
        console.error('Error updating slot:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      toast({
        title: "Créneau mis à jour",
        description: "Le créneau a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error updating slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le créneau.",
        variant: "destructive"
      });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId) => {
      const { data, error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', slotId);

      if (error) {
        console.error('Error deleting slot:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      toast({
        title: "Créneau supprimé",
        description: "Le créneau a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error deleting slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le créneau.",
        variant: "destructive"
      });
    },
  });

  return {
    availableSlots: data || [],
    isLoading,
    error,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    createSlot: createSlotMutation.mutate,
    isCreating: createSlotMutation.isPending,
    updateSlot: updateSlotMutation.mutate,
    isUpdating: updateSlotMutation.isPending,
    deleteSlot: deleteSlotMutation.mutate,
    isDeleting: deleteSlotMutation.isPending,
  };
};
