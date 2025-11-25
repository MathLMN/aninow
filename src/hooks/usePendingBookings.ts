
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type BookingRow = Database['public']['Tables']['bookings']['Row'];

export const usePendingBookings = () => {
  const [pendingBookings, setPendingBookings] = useState<BookingRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingBookings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPendingBookings(data || []);
      
      // Compter tous les rendez-vous en attente
      setUnreadCount(data?.length || 0);
      
    } catch (err) {
      console.error('Erreur lors du chargement des réservations en attente:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de rendez-vous",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  useEffect(() => {
    fetchPendingBookings();

    // Écouter les nouvelles réservations et les mises à jour en temps réel
    const channel = supabase
      .channel('pending-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Nouvelle réservation:', payload);
          if (payload.new.status === 'pending') {
            setPendingBookings(prev => [payload.new as BookingRow, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title: "Nouvelle demande de rendez-vous",
              description: `${payload.new.client_name} souhaite prendre rendez-vous pour ${payload.new.animal_name}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Réservation mise à jour:', payload);
          // Rafraîchir la liste si un booking passe de pending à un autre statut
          if (payload.old.status === 'pending' || payload.new.status === 'pending') {
            fetchPendingBookings();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    pendingBookings,
    unreadCount,
    markAsRead,
    isLoading,
    refetch: fetchPendingBookings
  };
};
