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

  // Récupérer TOUS les rendez-vous (manuels, en ligne, et bloqués)
  const { data: rawBookings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vet-bookings', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId) {
        console.log('❌ No current clinic ID available');
        return [];
      }
      
      console.log('🔄 Fetching ALL bookings for clinic:', currentClinicId);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          consultation_types!consultation_type_id (
            id,
            name,
            color,
            duration_minutes
          )
        `)
        .eq('clinic_id', currentClinicId)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching bookings:', error);
        throw error;
      }

      console.log('✅ All bookings fetched:', data?.length || 0, 'records');
      console.log('🏥 Fetched for clinic ID:', currentClinicId);
      console.log('📋 Sample bookings:', data?.slice(0, 3));
      console.log('📊 Booking sources:', data?.reduce((acc, booking) => {
        acc[booking.booking_source || 'unknown'] = (acc[booking.booking_source || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      
      // Transformer les données pour ajouter consultation_type_color directement
      const transformedData = data?.map(booking => ({
        ...booking,
        consultation_type_color: booking.consultation_types?.color || null,
        consultation_type_name: booking.consultation_types?.name || null,
      })) || [];
      
      return transformedData;
    },
    enabled: !!currentClinicId,
    staleTime: 10000, // 10 secondes seulement
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Toujours refetch au montage
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });

  // Combiner avec les blocages récurrents pour le planning
  const bookings = useMemo(() => {
    if (!currentClinicId) return rawBookings;

    // Générer les blocages récurrents pour les 30 prochains jours
    const today = new Date();
    const recurringBookings = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const blocksForDate = generateRecurringBlocksForDate(date);
      recurringBookings.push(...blocksForDate);
    }

    console.log('🔄 Combined bookings:', {
      rawBookings: rawBookings.length,
      recurringBlocks: recurringBookings.length,
      total: rawBookings.length + recurringBookings.length
    });

    return [...rawBookings, ...recurringBookings];
  }, [rawBookings, currentClinicId, generateRecurringBlocksForDate]);

  // Calculer les statistiques basées uniquement sur les vrais rendez-vous
  const stats = useMemo(() => {
    const today = formatDateLocal(new Date());
    
    // Filtrer les vrais rendez-vous (pas les blocages)
    const realBookings = rawBookings.filter(booking => 
      booking?.is_blocked !== true &&
      booking.booking_source !== 'blocked'
    );
    
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
    console.log('🔄 Force refreshing ALL bookings for clinic:', currentClinicId);
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
