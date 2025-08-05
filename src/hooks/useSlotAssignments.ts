
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export const useSlotAssignments = (selectedDate: Date) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentClinicId } = useClinicAccess();

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!currentClinicId) {
        console.log('❌ No clinic ID available for slot assignments');
        setAssignments([]);
        return;
      }

      console.log('🔄 Fetching slot assignments for date:', selectedDate.toISOString().split('T')[0]);
      
      const { data, error: fetchError } = await supabase
        .from('slot_assignments')
        .select('*')
        .eq('date', selectedDate.toISOString().split('T')[0])
        .or(`clinic_id.eq.${currentClinicId},clinic_id.is.null`);

      if (fetchError) {
        console.error('❌ Error fetching slot assignments:', fetchError);
        setError(fetchError.message);
        throw fetchError;
      }

      console.log('✅ Slot assignments loaded:', data?.length || 0, 'items');
      setAssignments(data || []);
    } catch (err: any) {
      console.error('❌ Failed to fetch slot assignments:', err);
      setError(err.message || 'Erreur lors du chargement des attributions');
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && currentClinicId) {
      fetchAssignments();
    } else {
      setAssignments([]);
      setIsLoading(false);
    }
  }, [selectedDate, currentClinicId]);

  const refreshAssignments = () => {
    if (currentClinicId) {
      fetchAssignments();
    }
  };

  return {
    assignments,
    isLoading,
    error,
    refreshAssignments
  };
};
