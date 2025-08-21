
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';
import { useRecurringSlotBlocks } from './useRecurringSlotBlocks';
import { formatDateLocal } from '@/utils/date';

export const useVetBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();
  const { generateRecurringBlocksForDate, recurringBlocks } = useRecurringSlotBlocks();

  // Récupérer uniquement les rendez-vous pris en ligne (booking_source = 'online')
  const { data: rawBookings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vet-bookings', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId) {
        console.log('❌ No current clinic ID available');
        return [];
      }
      
      console.log('🔄 Fetching online bookings for clinic:', currentClinicId);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('clinic_id', currentClinicId)
        .eq('booking_source', 'online')  // Filtrer uniquement les RDV pris en ligne
        .eq('is_blocked', false)         // Exclure les créneaux bloqués
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching online bookings:', error);
        throw error;
      }

      console.log('✅ Online bookings fetched:', data?.length || 0, 'records');
      console.log('🏥 Fetched for clinic ID:', currentClinicId);
      console.log('📋 Sample bookings:', data?.slice(0, 3));
      return data || [];
    },
    enabled: !!currentClinicId,
    staleTime: 10000, // 10 secondes seulement
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Toujours refetch au montage
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });

  // Pour la page /vet/appointments, on retourne directement les rawBookings (pas de combinaison avec les blocages récurrents)
  const bookings = rawBookings;

  // Calculer les statistiques basées uniquement sur les vrais rendez-vous pris en ligne
  const stats = useMemo(() => {
    const today = formatDateLocal(new Date());
    
    // rawBookings contient seulement les vrais rendez-vous pris en ligne
    const todayBookings = rawBookings.filter(booking => 
      booking.appointment_date === today || booking.created_at.split('T')[0] === today
    ).length;
    
    const total = rawBookings.length;
    const pending = rawBookings.filter(booking => booking.status === 'pending').length;
    const highUrgency = rawBookings.filter(booking => booking.urgency_score && booking.urgency_score >= 7).length;
    
    return {
      todayBookings,
      total,
      pending,
      highUrgency
    };
  }, [rawBookings]);

  // Mettre à jour le statut d'un rendez-vous avec invalidation du cache
  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalider et recharger les données
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

  // Fonction pour forcer le rechargement des données
  const refreshBookings = async () => {
    console.log('🔄 Force refreshing online bookings for clinic:', currentClinicId);
    await queryClient.invalidateQueries({ queryKey: ['vet-bookings', currentClinicId] });
    await refetch();
  };
  
  return {
    bookings,
    isLoading,
    error,
    stats,
    updateBookingStatus: updateBookingStatus.mutate,
    isUpdating: updateBookingStatus.isPending,
    refreshBookings
  };
};
