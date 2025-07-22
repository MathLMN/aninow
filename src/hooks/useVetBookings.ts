
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVetBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: bookings = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["vet-bookings"],
    queryFn: async () => {
      console.log('🔄 Fetching vet bookings...');
      
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error('❌ Error fetching bookings:', error);
        throw error;
      }

      console.log('✅ Bookings loaded:', data?.length || 0, 'items');
      return data || [];
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('🔄 Updating booking status:', { id, status });
      
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating booking status:', error);
        throw error;
      }

      console.log('✅ Booking status updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vet-bookings"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du rendez-vous a été modifié avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update booking status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du rendez-vous",
        variant: "destructive",
      });
    },
  });

  return {
    bookings,
    isLoading,
    error: error?.message || null,
    refetch,
    updateBookingStatus: updateBookingStatusMutation.mutate,
  };
};
