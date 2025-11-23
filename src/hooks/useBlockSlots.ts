import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";


export const useBlockSlots = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const blockSlotsMutation = useMutation({
    mutationFn: async ({
      date,
      startTime,
      endTime,
      veterinarianId,
      clinicId,
      reason
    }: {
      date: string;
      startTime: string;
      endTime: string;
      veterinarianId: string;
      clinicId: string;
      reason?: string;
    }) => {
      console.log('🔄 Blocking time slots:', { date, startTime, endTime, veterinarianId, clinicId });
      
// Créer UN SEUL booking bloqué pour toute la plage horaire
      const bookingToInsert: Database['public']['Tables']['bookings']['Insert'] = {
        clinic_id: clinicId,
        veterinarian_id: veterinarianId,
        appointment_date: date,
        appointment_time: startTime,
        appointment_end_time: endTime,
        is_blocked: true,
        animal_species: 'blocked',
        animal_name: 'Créneau bloqué',
        consultation_reason: 'blocked',
        client_name: 'Système',
        client_email: 'system@clinique.local',
        client_phone: '0000000000',
        client_comment: reason || null,
        preferred_contact_method: 'phone',
        status: 'confirmed',
        booking_source: 'blocked',
      };

      console.log('📝 Inserting single blocked booking from', startTime, 'to', endTime);

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingToInsert])
        .select();

      if (error) {
        console.error('❌ Error inserting blocked bookings:', error);
        throw new Error(`Erreur d'insertion: ${error.message}`);
      }

      console.log('✅ Blocked bookings created:', data?.length);
      return data;
    },
    onSuccess: () => {
      console.log('✅ Block slots mutation succeeded');
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
      toast({
        title: "Créneaux bloqués",
        description: "Les créneaux ont été bloqués avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to block slots:', error);
      const errorMessage = error?.message || 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    blockSlots: blockSlotsMutation.mutateAsync,
    isBlocking: blockSlotsMutation.isPending
  };
};
