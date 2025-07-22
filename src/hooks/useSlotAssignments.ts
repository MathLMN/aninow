
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSlotAssignments = (selectedDate: Date) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Fetching slot assignments for date:', selectedDate.toISOString().split('T')[0]);
      
      const { data, error: fetchError } = await supabase
        .from('slot_assignments')
        .select('*')
        .eq('date', selectedDate.toISOString().split('T')[0]);

      if (fetchError) {
        console.error('❌ Error fetching slot assignments:', fetchError);
        setError(fetchError.message);
        throw fetchError;
      }

      console.log('✅ Slot assignments loaded:', data);
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
    if (selectedDate) {
      fetchAssignments();
    }
  }, [selectedDate]);

  const refreshAssignments = () => {
    fetchAssignments();
  };

  return {
    assignments,
    isLoading,
    error,
    refreshAssignments
  };
};
