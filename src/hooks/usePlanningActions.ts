
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlanningActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Récupérer les détails complets du booking avant de confirmer
      const { data: bookingData, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError) throw fetchError;

      // Mettre à jour le statut
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      // Envoyer l'email de confirmation via l'edge function
      try {
        const { error: emailError } = await supabase.functions.invoke('send-confirmation-email', {
          body: {
            bookingId: bookingId,
            client_name: bookingData.client_name,
            client_email: bookingData.client_email,
            animal_name: bookingData.animal_name,
            appointment_date: bookingData.appointment_date,
            appointment_time: bookingData.appointment_time,
            clinic_id: bookingData.clinic_id
          }
        });

        if (emailError) {
          console.error('⚠️ Erreur lors de l\'envoi de l\'email:', emailError);
          // On continue quand même, l'email n'est pas critique
        } else {
          console.log('✅ Email de confirmation envoyé avec succès');
        }
      } catch (emailError) {
        console.error('⚠️ Exception lors de l\'envoi de l\'email:', emailError);
        // On continue quand même
      }

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
      
      // Utiliser la suppression directe avec la politique RLS appropriée
      const { error, count } = await supabase
        .from('bookings')
        .delete({ count: 'exact' })
        .eq('id', bookingId);

      if (error) {
        console.error('❌ Database error during deletion:', error);
        throw new Error(`Erreur de suppression: ${error.message}`);
      }

      if (count === 0) {
        throw new Error('Aucun rendez-vous trouvé avec cet ID');
      }

      console.log('✅ Deletion completed, rows affected:', count);

      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé définitivement",
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

  const updateBookingStatus = async (bookingId: string, status: string, notes?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const updateData: any = { status };
      if (notes) {
        updateData.client_comment = notes;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      const statusLabels: Record<string, string> = {
        'pending': 'en attente',
        'confirmed': 'confirmé',
        'cancelled': 'annulé',
        'completed': 'terminé',
        'no-show': 'absent'
      };

      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous a été marqué comme ${statusLabels[status] || status}`,
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
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
    moveAppointment,
    deleteBooking,
    updateBookingStatus,
    handleBlockSlot
  };
};
