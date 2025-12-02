import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';
import { useClinicContext } from '@/contexts/ClinicContext';

export const useClinicVeterinarians = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Essayer d'abord le contexte d'accès (pour l'interface vétérinaire)
  const { currentClinicId: accessClinicId } = useClinicAccess();
  
  // Puis le contexte public (pour l'interface de réservation)
  const { currentClinic } = useClinicContext();
  const contextClinicId = currentClinic?.id;
  
  // Utiliser l'ID de clinique disponible
  const currentClinicId = accessClinicId || contextClinicId;

  console.log('🔄 useClinicVeterinarians - Access clinic ID:', accessClinicId);
  console.log('🔄 useClinicVeterinarians - Context clinic ID:', contextClinicId);
  console.log('🔄 useClinicVeterinarians - Final clinic ID:', currentClinicId);

  const { 
    data: veterinarians = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clinic-veterinarians', currentClinicId],
    queryFn: async () => {
      console.log('🔄 Fetching clinic veterinarians for clinic:', currentClinicId);
      
      if (!currentClinicId) {
        console.log('❌ No clinic ID available');
        return [];
      }

      // Construire la requête en fonction du contexte
      let query = supabase
        .from('clinic_veterinarians')
        .select('id, name, specialty, is_active, clinic_id')
        .eq('is_active', true)
        .order('name', { ascending: true });

      // Si on a un clinic_id, filtrer par clinique
      if (currentClinicId) {
        query = query.eq('clinic_id', currentClinicId);
      }

      console.log('🔄 Executing query with clinic_id filter:', currentClinicId);

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching veterinarians:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Raw veterinarians data:', data);
      console.log('✅ Veterinarians loaded:', data?.length || 0, 'items');
      
      // Log chaque vétérinaire pour debug
      if (data && data.length > 0) {
        data.forEach((vet, index) => {
          console.log(`🏥 Veterinarian ${index + 1}:`, {
            id: vet.id,
            name: vet.name,
            specialty: vet.specialty,
            is_active: vet.is_active,
            clinic_id: vet.clinic_id
          });
        });
      }

      return data || [];
    },
    enabled: !!currentClinicId,
    retry: 3,
    staleTime: 30 * 1000, // 30 seconds
  });

  const addVeterinarianMutation = useMutation({
    mutationFn: async (vetData: { name: string; specialty: string; is_active: boolean }) => {
      if (!currentClinicId) {
        throw new Error('No clinic selected');
      }

      console.log('🔄 Adding veterinarian:', vetData);
      
      // 1. Créer le vétérinaire
      const { data: newVet, error: vetError } = await supabase
        .from('clinic_veterinarians')
        .insert([{
          ...vetData,
          clinic_id: currentClinicId
        }])
        .select()
        .single();

      if (vetError) {
        console.error('❌ Error adding veterinarian:', vetError);
        throw vetError;
      }

      console.log('✅ Veterinarian added:', newVet);

      // 2. Créer automatiquement les 7 schedules par défaut (Lundi-Vendredi travaillés, Samedi-Dimanche repos)
      const defaultSchedules = [0, 1, 2, 3, 4, 5, 6].map(day => ({
        veterinarian_id: newVet.id,
        clinic_id: currentClinicId,
        day_of_week: day,
        is_working: day >= 1 && day <= 5, // Lundi-Vendredi = true, Samedi/Dimanche = false
        morning_start: '08:00',
        morning_end: '12:00',
        afternoon_start: '14:00',
        afternoon_end: '18:00',
        available_for_online_booking: true
      }));

      const { error: scheduleError } = await supabase
        .from('veterinarian_schedules')
        .insert(defaultSchedules);

      if (scheduleError) {
        console.error('⚠️ Warning: Could not create default schedules:', scheduleError);
        // On ne fait pas échouer la création du vétérinaire si les schedules échouent
      } else {
        console.log('✅ Default schedules created for veterinarian:', newVet.id);
      }

      return newVet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-veterinarians'] });
      toast({
        title: "Vétérinaire ajouté",
        description: "Le vétérinaire a été ajouté avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to add veterinarian:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le vétérinaire",
        variant: "destructive",
      });
    },
  });

  const updateVeterinarianMutation = useMutation({
    mutationFn: async ({ id, vetData }: { id: string; vetData: { name: string; specialty: string; is_active: boolean } }) => {
      console.log('🔄 Updating veterinarian:', { id, vetData });
      
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .update(vetData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating veterinarian:', error);
        throw error;
      }

      console.log('✅ Veterinarian updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-veterinarians'] });
      toast({
        title: "Vétérinaire mis à jour",
        description: "Les informations du vétérinaire ont été mises à jour avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update veterinarian:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le vétérinaire",
        variant: "destructive",
      });
    },
  });

  const deleteVeterinarianMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🔄 Deactivating veterinarian:', id);
      
      const { error } = await supabase
        .from('clinic_veterinarians')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('❌ Error deactivating veterinarian:', error);
        throw error;
      }

      console.log('✅ Veterinarian deactivated');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-veterinarians'] });
      toast({
        title: "Vétérinaire désactivé",
        description: "Le vétérinaire a été désactivé avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to deactivate veterinarian:', error);
      toast({
        title: "Erreur",
        description: "Impossible de désactiver le vétérinaire",
        variant: "destructive",
      });
    },
  });

  return {
    veterinarians,
    isLoading,
    error: error?.message || null,
    refetch,
    addVeterinarian: async (vetData: { name: string; specialty: string; is_active: boolean }) => {
      try {
        await addVeterinarianMutation.mutateAsync(vetData);
        return true;
      } catch {
        return false;
      }
    },
    updateVeterinarian: async (id: string, vetData: { name: string; specialty: string; is_active: boolean }) => {
      try {
        await updateVeterinarianMutation.mutateAsync({ id, vetData });
        return true;
      } catch {
        return false;
      }
    },
    deleteVeterinarian: async (id: string) => {
      try {
        await deleteVeterinarianMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    }
  };
};
