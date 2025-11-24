import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook pour la synchronisation temps réel des bookings via Supabase Realtime
 * Écoute les événements INSERT, UPDATE, DELETE et met à jour automatiquement le cache React Query
 */
export const useRealtimeBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentClinicId } = useClinicAccess();

  useEffect(() => {
    if (!currentClinicId) {
      console.log('⏸️ Realtime: No clinic ID, skipping subscription');
      return;
    }

    console.log('🔌 Realtime: Setting up channel for clinic:', currentClinicId);

    // Créer un canal unique pour cette clinique
    const channel: RealtimeChannel = supabase
      .channel(`bookings-changes-${currentClinicId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `clinic_id=eq.${currentClinicId}`
        },
        (payload) => {
          console.log('➕ Realtime INSERT:', payload);
          
          // Invalider le cache pour forcer un refetch
          queryClient.invalidateQueries({ queryKey: ['vet-bookings', currentClinicId] });
          queryClient.invalidateQueries({ queryKey: ['pending-bookings', currentClinicId] });

          // Afficher une notification pour les nouveaux RDV créés par d'autres utilisateurs
          const booking = payload.new as any;
          if (booking.booking_source === 'online') {
            toast({
              title: "🆕 Nouvelle réservation en ligne",
              description: `${booking.client_name} - ${booking.animal_name}`,
              duration: 5000,
            });
          } else if (booking.booking_source === 'manual') {
            toast({
              title: "📅 Nouveau rendez-vous créé",
              description: `${booking.client_name} - ${booking.animal_name}`,
              duration: 4000,
            });
          } else if (booking.is_blocked) {
            toast({
              title: "🚫 Créneaux bloqués",
              description: `${booking.appointment_date} de ${booking.appointment_time} à ${booking.appointment_end_time}`,
              duration: 4000,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `clinic_id=eq.${currentClinicId}`
        },
        (payload) => {
          console.log('✏️ Realtime UPDATE:', payload);
          
          // Invalider le cache pour refetch
          queryClient.invalidateQueries({ queryKey: ['vet-bookings', currentClinicId] });
          queryClient.invalidateQueries({ queryKey: ['pending-bookings', currentClinicId] });

          const oldBooking = payload.old as any;
          const newBooking = payload.new as any;

          // Détecter le type de modification
          if (oldBooking.status !== newBooking.status) {
            // Changement de statut
            const statusLabels: Record<string, string> = {
              'pending': 'En attente',
              'confirmed': 'Confirmé',
              'cancelled': 'Annulé',
              'completed': 'Terminé',
              'no-show': 'Non présenté'
            };

            toast({
              title: "🔄 Statut modifié",
              description: `${newBooking.client_name} : ${statusLabels[newBooking.status] || newBooking.status}`,
              duration: 3000,
            });
          } else if (
            oldBooking.appointment_date !== newBooking.appointment_date ||
            oldBooking.appointment_time !== newBooking.appointment_time
          ) {
            // Déplacement de rendez-vous
            toast({
              title: "↔️ Rendez-vous déplacé",
              description: `${newBooking.client_name} - ${newBooking.appointment_date} à ${newBooking.appointment_time}`,
              duration: 4000,
              variant: "default",
            });
          } else {
            // Autre modification
            toast({
              title: "📝 Rendez-vous modifié",
              description: `Mise à jour : ${newBooking.client_name}`,
              duration: 3000,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookings',
          filter: `clinic_id=eq.${currentClinicId}`
        },
        (payload) => {
          console.log('🗑️ Realtime DELETE:', payload);
          
          // Invalider le cache
          queryClient.invalidateQueries({ queryKey: ['vet-bookings', currentClinicId] });
          queryClient.invalidateQueries({ queryKey: ['pending-bookings', currentClinicId] });

          const deletedBooking = payload.old as any;
          toast({
            title: "🗑️ Rendez-vous supprimé",
            description: `${deletedBooking.client_name || 'Rendez-vous'} a été supprimé`,
            duration: 3000,
            variant: "destructive",
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime: Successfully subscribed to bookings changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime: Channel error');
          toast({
            title: "⚠️ Erreur de connexion temps réel",
            description: "La synchronisation automatique est temporairement indisponible",
            variant: "destructive",
            duration: 5000,
          });
        } else if (status === 'TIMED_OUT') {
          console.error('⏱️ Realtime: Connection timed out');
        } else if (status === 'CLOSED') {
          console.log('🔌 Realtime: Channel closed');
        }
      });

    // Cleanup : se désabonner quand le composant est démonté
    return () => {
      console.log('🔌 Realtime: Unsubscribing from channel');
      supabase.removeChannel(channel);
    };
  }, [currentClinicId, queryClient, toast]);

  return {
    // Ce hook ne retourne rien pour le moment, il fonctionne en arrière-plan
    isRealtimeActive: !!currentClinicId
  };
};
