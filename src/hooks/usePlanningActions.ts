
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlanningActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Rendez-vous validé",
        description: "Le rendez-vous a été confirmé avec succès",
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider le rendez-vous",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Rendez-vous annulé",
        description: "Le rendez-vous a été annulé",
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler le rendez-vous",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const duplicateBooking = async (booking: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Créer une copie du booking sans l'ID et avec un status pending
      const { id, created_at, updated_at, ...bookingData } = booking;
      const duplicatedBooking = {
        ...bookingData,
        status: 'pending',
        client_comment: `[DUPLIQUÉ] ${bookingData.client_comment || ''}`
      };

      const { error } = await supabase
        .from('bookings')
        .insert([duplicatedBooking]);

      if (error) throw error;

      toast({
        title: "Rendez-vous dupliqué",
        description: "Le rendez-vous a été dupliqué avec succès",
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le rendez-vous",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const moveAppointment = async (appointmentId: string, newDate: string, newTime: string, newVetId?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const updateData: any = {
        appointment_date: newDate,
        appointment_time: newTime
      };

      if (newVetId) {
        updateData.veterinarian_id = newVetId;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Rendez-vous déplacé",
        description: "Le rendez-vous a été déplacé avec succès",
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déplacer le rendez-vous",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé définitivement",
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction simplifiée pour ouvrir la modale de blocage
  const handleBlockSlot = async (timeSlot: { date: string; time: string; veterinarian: string }): Promise<boolean> => {
    // Cette fonction ne fait que retourner true pour indiquer que la modale doit s'ouvrir
    // Le blocage réel se fera dans la modale BlockSlotModal
    return true;
  };

  return {
    isLoading,
    validateBooking,
    cancelBooking,
    duplicateBooking,
    moveAppointment,
    deleteBooking,
    handleBlockSlot
  };
};
