
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export const useAvailableSlots = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();

  // Récupérer les créneaux disponibles
  const { data: availableSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ['available-slots', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId) return [];
      
      // Logique pour récupérer les créneaux disponibles
      // Cette fonction doit être implémentée selon votre logique métier
      return [];
    },
    enabled: !!currentClinicId
  });

  const blockTimeSlot = useCallback(async (
    date: string,
    startTime: string,
    endTime: string,
    veterinarianId: string
  ): Promise<boolean> => {
    if (!currentClinicId) {
      console.error('❌ No clinic ID available for blocking slot');
      toast({
        title: "Erreur",
        description: "Impossible d'identifier la clinique",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Blocking time slot:', { date, startTime, endTime, veterinarianId, currentClinicId });

      // Calculer la durée en minutes
      const startDate = new Date(`2000-01-01T${startTime}:00`);
      const endDate = new Date(`2000-01-01T${endTime}:00`);
      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

      // Créer un booking de type "bloqué" au lieu d'utiliser available_slots
      const { error } = await supabase
        .from('bookings')
        .insert({
          clinic_id: currentClinicId,
          veterinarian_id: veterinarianId,
          appointment_date: date,
          appointment_time: startTime,
          appointment_end_time: endTime,
          client_name: 'CRÉNEAU BLOQUÉ',
          client_email: 'blocked@clinic.internal',
          client_phone: '0000000000',
          preferred_contact_method: 'email',
          animal_species: 'N/A',
          animal_name: 'N/A',
          consultation_reason: 'Créneau bloqué',
          status: 'confirmed',
          is_blocked: true,
          duration_minutes: durationMinutes
        });

      if (error) {
        console.error('❌ Error blocking time slot:', error);
        throw error;
      }

      console.log('✅ Time slot blocked successfully');
      
      // Invalider les queries pour rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['available-slots'] });

      toast({
        title: "Créneau bloqué",
        description: "Le créneau a été bloqué avec succès",
      });

      return true;
    } catch (error: any) {
      console.error('❌ Failed to block time slot:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de bloquer le créneau",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentClinicId, toast, queryClient]);

  return {
    availableSlots,
    blockTimeSlot,
    isLoading: isLoading || slotsLoading
  };
};
