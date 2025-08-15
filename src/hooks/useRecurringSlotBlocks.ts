
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
      queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
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
      queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
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
      queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
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

  // Fonction pour générer les blocages récurrents pour une date donnée
  const generateRecurringBlocksForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return recurringBlocks
      .filter(block => block.day_of_week === dayOfWeek)
      .map(block => ({
        id: `recurring-${block.id}-${date.toISOString().split('T')[0]}`,
        clinic_id: block.clinic_id,
        veterinarian_id: block.veterinarian_id,
        appointment_date: date.toISOString().split('T')[0],
        appointment_time: block.start_time,
        appointment_end_time: block.end_time,
        client_name: 'CRÉNEAU BLOQUÉ',
        client_email: 'blocked@clinic.internal',
        client_phone: '0000000000',
        preferred_contact_method: 'email',
        animal_species: 'N/A',
        animal_name: 'N/A',
        consultation_reason: block.title,
        status: 'confirmed',
        is_blocked: true,
        duration_minutes: calculateDurationMinutes(block.start_time, block.end_time),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
  };

  // Fonction utilitaire pour calculer la durée en minutes
  const calculateDurationMinutes = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  };

  return {
    recurringBlocks,
    generateRecurringBlocksForDate,
    isLoading: isLoading || blocksLoading,
    createRecurringBlock: createRecurringBlock.mutateAsync,
    updateRecurringBlock: updateRecurringBlock.mutateAsync,
    deleteRecurringBlock: deleteRecurringBlock.mutateAsync,
    isCreating: createRecurringBlock.isPending,
    isUpdating: updateRecurringBlock.isPending,
    isDeleting: deleteRecurringBlock.isPending
  };
};
