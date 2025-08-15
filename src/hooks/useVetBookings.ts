
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';
import { useRecurringSlotBlocks } from './useRecurringSlotBlocks';

export const useVetBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();
  const { generateRecurringBlocksForDate } = useRecurringSlotBlocks();

  // Récupérer tous les rendez-vous
  const { data: rawBookings = [], isLoading, error } = useQuery({
    queryKey: ['vet-bookings', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId) return [];
      
      console.log('🔄 Fetching bookings for clinic:', currentClinicId);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('clinic_id', currentClinicId)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('❌ Error fetching bookings:', error);
        throw error;
      }

      console.log('✅ Bookings fetched:', data?.length || 0, 'records');
      return data || [];
    },
    enabled: !!currentClinicId
  });

  // Combiner les bookings avec les blocages récurrents générés
  const bookings = useMemo(() => {
    if (!rawBookings) return [];
    
    // Générer les dates pour les 30 prochains jours
    const today = new Date();
    const generatedBlocks = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const recurringBlocks = generateRecurringBlocksForDate(date);
      generatedBlocks.push(...recurringBlocks);
    }
    
    // Combiner les bookings existants avec les blocages récurrents générés
    // Éviter les doublons en vérifiant si un booking réel existe déjà pour le même créneau
    const existingBookingKeys = new Set(
      rawBookings.map(booking => 
        `${booking.appointment_date}-${booking.appointment_time}-${booking.veterinarian_id}`
      )
    );
    
    const uniqueRecurringBlocks = generatedBlocks.filter(block => 
      !existingBookingKeys.has(`${block.appointment_date}-${block.appointment_time}-${block.veterinarian_id}`)
    );
    
    return [...rawBookings, ...uniqueRecurringBlocks];
  }, [rawBookings, generateRecurringBlocksForDate]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrer seulement les vrais rendez-vous (pas les blocages récurrents)
    const realBookings = rawBookings.filter(booking => !booking.is_recurring_block);
    
    const todayBookings = realBookings.filter(booking => 
      booking.appointment_date === today || booking.created_at.split('T')[0] === today
    ).length;
    
    const total = realBookings.length;
    const pending = realBookings.filter(booking => booking.status === 'pending').length;
    const highUrgency = realBookings.filter(booking => booking.urgency_score && booking.urgency_score >= 7).length;
    
    return {
      todayBookings,
      total,
      pending,
      highUrgency
    };
  }, [rawBookings]);

  // Mettre à jour le statut d'un rendez-vous
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
      toast({
        title: "Statut modifié",
        description: "Le statut du rendez-vous a été modifié avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Error updating booking status:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le statut du rendez-vous",
        variant: "destructive"
      });
    }
  });
  
  return {
    bookings,
    isLoading,
    error,
    stats,
    updateBookingStatus: updateBookingStatus.mutate,
    isUpdating: updateBookingStatus.isPending
  };
};
