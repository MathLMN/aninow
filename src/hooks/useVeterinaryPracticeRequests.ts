
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVeterinaryPracticeRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: requests = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["veterinary-practice-requests"],
    queryFn: async () => {
      console.log('🔄 Fetching veterinary practice requests...');
      
      const { data, error } = await supabase
        .from("veterinary_practice_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error('❌ Error fetching requests:', error);
        throw error;
      }

      console.log('✅ Requests loaded:', data?.length || 0, 'items');
      return data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      console.log('🔄 Updating request status:', { id, status, notes });
      
      const updateData: any = { status, updated_at: new Date().toISOString() };
      if (notes) updateData.notes = notes;
      
      const { data, error } = await supabase
        .from("veterinary_practice_requests")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating request status:', error);
        throw error;
      }

      console.log('✅ Request status updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veterinary-practice-requests"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande a été modifié avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update request status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la demande",
        variant: "destructive",
      });
    },
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return {
    requests,
    isLoading,
    error: error?.message || null,
    stats,
    refetch,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
};
