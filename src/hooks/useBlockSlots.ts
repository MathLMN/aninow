import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

// Générer tous les créneaux de 15 minutes entre deux heures
const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;
  
  for (let minutes = startInMinutes; minutes < endInMinutes; minutes += 15) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  }
  
  return slots;
};

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
      
      // Générer tous les créneaux de 15 minutes à bloquer
      const timeSlots = generateTimeSlots(startTime, endTime);
      console.log('📋 Time slots to block:', timeSlots);
      
      // Créer un booking bloqué pour chaque créneau de 15 minutes
      const bookingsToInsert: Database['public']['Tables']['bookings']['Insert'][] = timeSlots.map((slot, index) => {
        // Calculer l'heure de fin (+ 15 minutes)
        const [hour, minute] = slot.split(':').map(Number);
        const endMinutes = hour * 60 + minute + 15;
        const endHour = Math.floor(endMinutes / 60);
        const endMin = endMinutes % 60;
        const slotEndTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        
        return {
          clinic_id: clinicId,
          veterinarian_id: veterinarianId,
          appointment_date: date,
          appointment_time: slot,
          appointment_end_time: slotEndTime,
          is_blocked: true,
          animal_species: 'blocked',
          animal_name: index === 0 ? 'Créneau bloqué' : 'Créneau bloqué (suite)',
          consultation_reason: 'blocked',
          client_name: 'Système',
          client_email: 'system@clinique.local',
          client_phone: '0000000000',
          client_comment: index === 0 && reason ? reason : null,
          preferred_contact_method: 'phone',
          status: 'confirmed',
          booking_source: 'blocked',
        };
      });

      console.log('📝 Inserting blocked bookings:', bookingsToInsert.length);

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingsToInsert)
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
