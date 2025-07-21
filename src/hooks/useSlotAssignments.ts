
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getSlotAssignments, 
  SlotAssignment,
  createSlotAssignment,
  deleteSlotAssignment,
  reassignSlot
} from '@/components/planning/utils/slotAssignmentUtils';

export const useSlotAssignments = (selectedDate: Date) => {
  const [assignments, setAssignments] = useState<SlotAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await getSlotAssignments(dateStr);
      setAssignments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des attributions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les attributions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAssignment = async (
    timeSlot: string,
    veterinarianId: string,
    type: 'auto' | 'manual' = 'manual'
  ) => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const success = await createSlotAssignment(dateStr, timeSlot, veterinarianId, type);
      
      if (success) {
        await fetchAssignments();
        toast({
          title: "Attribution créée",
          description: `Créneau ${timeSlot} attribué avec succès`,
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'attribution",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateAssignment = async (timeSlot: string, newVeterinarianId: string) => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const success = await reassignSlot(dateStr, timeSlot, newVeterinarianId);
      
      if (success) {
        await fetchAssignments();
        toast({
          title: "Attribution modifiée",
          description: `Créneau ${timeSlot} réassigné avec succès`,
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'attribution",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeAssignment = async (timeSlot: string) => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const success = await deleteSlotAssignment(dateStr, timeSlot);
      
      if (success) {
        await fetchAssignments();
        toast({
          title: "Attribution supprimée",
          description: `Attribution du créneau ${timeSlot} supprimée`,
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'attribution",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [selectedDate]);

  return {
    assignments,
    isLoading,
    createAssignment,
    updateAssignment,
    removeAssignment,
    refreshAssignments: fetchAssignments
  };
};
