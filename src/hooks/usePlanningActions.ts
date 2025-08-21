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
      console.log('🗑️ Starting deletion process for booking ID:', bookingId);
      
      // Vérifier d'abord que le booking existe
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('id, client_name, animal_name, appointment_date, appointment_time')
        .eq('id', bookingId)
        .single();

      if (fetchError || !existingBooking) {
        console.error('❌ Booking not found:', fetchError);
        throw new Error('Rendez-vous introuvable dans la base de données');
      }

      console.log('✅ Found booking to delete:', existingBooking);

      // Procéder à la suppression avec une requête directe
      const { error: deleteError, count } = await supabase
        .from('bookings')
        .delete({ count: 'exact' })
        .eq('id', bookingId);

      if (deleteError) {
        console.error('❌ Database error during deletion:', deleteError);
        throw new Error(`Erreur de base de données: ${deleteError.message}`);
      }

      console.log('✅ Deletion completed, rows affected:', count);

      // Vérifier que la suppression a bien eu lieu
      const { data: checkBooking } = await supabase
        .from('bookings')
        .select('id')
        .eq('id', bookingId)
        .single();

      if (checkBooking) {
        console.error('❌ Booking still exists after deletion attempt');
        throw new Error('La suppression n\'a pas été effectuée correctement');
      }

      console.log('✅ Booking successfully deleted and verified');

      toast({
        title: "Rendez-vous supprimé",
        description: `Le rendez-vous de ${existingBooking.client_name} a été supprimé définitivement`,
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error during deletion process:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la suppression';
      
      toast({
        title: "Erreur de suppression",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockSlot = async (timeSlot: { date: string; time: string; veterinarian: string }): Promise<boolean> => {
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
