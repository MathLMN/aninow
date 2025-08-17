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

  // Récupérer tous les rendez-vous avec invalidation forcée après création
  const { data: rawBookings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vet-bookings', currentClinicId],
    queryFn: async () => {
      if (!currentClinicId) {
        console.log('❌ No current clinic ID available');
        return [];
      }
      
      console.log('🔄 Fetching bookings for clinic:', currentClinicId);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('clinic_id', currentClinicId)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching bookings:', error);
        throw error;
      }

      console.log('✅ Bookings fetched:', data?.length || 0, 'records');
      console.log('🏥 Fetched for clinic ID:', currentClinicId);
      console.log('📋 Sample bookings:', data?.slice(0, 3));
      return data || [];
    },
    enabled: !!currentClinicId,
    // Réduire le temps de cache pour s'assurer que les nouveaux RDV apparaissent rapidement
    staleTime: 10000, // 10 secondes seulement
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Toujours refetch au montage
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });

  // Combiner les bookings avec les blocages récurrents générés
  const bookings = useMemo(() => {
    if (!rawBookings || !recurringBlocks) return rawBookings || [];
    
    console.log('🔄 Generating recurring blocks for extended date range...');
    console.log('📋 Available recurring blocks:', recurringBlocks.length);
    
    // Générer les dates pour une plage plus étendue (6 mois dans le passé et 2 ans dans le futur)
    const today = new Date();
    const generatedBlocks = [];
    
    // Étendre la plage pour assurer la visibilité sur tous les calendriers
    for (let i = -180; i <= 730; i++) { // 6 mois passé, 2 ans futur
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const recurringBlocksForDate = generateRecurringBlocksForDate(date);
      if (recurringBlocksForDate.length > 0) {
        console.log(`📅 Adding ${recurringBlocksForDate.length} blocks for ${date.toISOString().split('T')[0]}`);
      }
      generatedBlocks.push(...recurringBlocksForDate);
    }
    
    console.log('📊 Total generated recurring blocks:', generatedBlocks.length);
    
    // Combiner les bookings existants avec les blocages récurrents générés
    // Éviter les doublons en vérifiant si un booking réel existe déjà pour le même créneau
    const existingBookingKeys = new Set(
      rawBookings.map(booking => 
        `${booking.appointment_date}-${booking.appointment_time}-${booking.veterinarian_id}`
      )
    );
    
    const uniqueRecurringBlocks = generatedBlocks.filter(block => {
      const key = `${block.appointment_date}-${block.appointment_time}-${block.veterinarian_id}`;
      return !existingBookingKeys.has(key);
    });
    
    console.log('🎯 Unique recurring blocks added:', uniqueRecurringBlocks.length);
    
    const combinedBookings = [...rawBookings, ...uniqueRecurringBlocks];
    console.log('📋 Total bookings (real + recurring):', combinedBookings.length);
    
    return combinedBookings;
  }, [rawBookings, generateRecurringBlocksForDate, recurringBlocks]);

  // Calculer les statistiques basées uniquement sur les vrais rendez-vous (rawBookings)
  const stats = useMemo(() => {
    const today = formatDateLocal(new Date());
    
    // rawBookings contient seulement les vrais rendez-vous de la base de données
    const todayBookings = rawBookings.filter(booking => 
      booking.appointment_date === today || booking.created_at.split('T')[0] === today
    ).length;
    
    const total = rawBookings.length;
    const pending = rawBookings.filter(booking => booking.status === 'pending').length;
    const confirmed = rawBookings.filter(booking => booking.status === 'confirmed').length;
    const highUrgency = rawBookings.filter(booking => booking.urgency_score && booking.urgency_score >= 7).length;
    
    return {
      todayBookings,
      total,
      pending,
      confirmed,
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
    console.log('🔄 Force refreshing bookings for clinic:', currentClinicId);
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
