
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VeterinarianSchedule {
  id?: string;
  veterinarian_id: string;
  day_of_week: number;
  is_working: boolean;
  morning_start?: string;
  morning_end?: string;
  afternoon_start?: string;
  afternoon_end?: string;
}

export const useVeterinarianSchedules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: schedules = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['veterinarian-schedules'],
    queryFn: async () => {
      console.log('🔄 Fetching veterinarian schedules...');
      
      const { data, error } = await supabase
        .from('veterinarian_schedules')
        .select(`
          *,
          clinic_veterinarians(name)
        `)
        .order('veterinarian_id')
        .order('day_of_week');

      if (error) {
        console.error('❌ Error fetching schedules:', error);
        throw error;
      }

      console.log('✅ Schedules loaded:', data?.length || 0, 'items');
      return data || [];
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async (schedule: VeterinarianSchedule) => {
      console.log('🔄 Updating schedule:', schedule);
      
      const scheduleData = {
        veterinarian_id: schedule.veterinarian_id,
        day_of_week: schedule.day_of_week,
        is_working: schedule.is_working,
        morning_start: schedule.morning_start || null,
        morning_end: schedule.morning_end || null,
        afternoon_start: schedule.afternoon_start || null,
        afternoon_end: schedule.afternoon_end || null,
      };

      const { data, error } = await supabase
        .from('veterinarian_schedules')
        .upsert(scheduleData, {
          onConflict: 'veterinarian_id,day_of_week'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating schedule:', error);
        throw error;
      }

      console.log('✅ Schedule updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarian-schedules'] });
      toast({
        title: "Horaires mis à jour",
        description: "Les horaires du vétérinaire ont été mis à jour avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to update schedule:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les horaires",
        variant: "destructive",
      });
    },
  });

  return {
    schedules,
    isLoading,
    error: error?.message || null,
    refetch,
    updateSchedule: async (schedule: VeterinarianSchedule) => {
      try {
        await updateScheduleMutation.mutateAsync(schedule);
        return true;
      } catch {
        return false;
      }
    }
  };
};
