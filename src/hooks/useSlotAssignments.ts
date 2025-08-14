
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export const useSlotAssignments = (selectedDate: Date) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentClinicId } = useClinicAccess();
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef<string>('');

  const fetchAssignments = async () => {
    if (!currentClinicId || !selectedDate) {
      console.log('❌ Missing requirements for slot assignments:', { currentClinicId, selectedDate });
      setAssignments([]);
      setIsLoading(false);
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    const cacheKey = `${dateStr}-${currentClinicId}`;
    
    // Éviter les appels répétitifs
    if (fetchingRef.current || lastFetchRef.current === cacheKey) {
      return;
    }

    try {
      fetchingRef.current = true;
      lastFetchRef.current = cacheKey;
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching slot assignments for date:', dateStr, 'clinic:', currentClinicId);
      
      const { data, error: fetchError } = await supabase
        .from('slot_assignments')
        .select('*')
        .eq('date', dateStr)
        .or(`clinic_id.eq.${currentClinicId},clinic_id.is.null`);

      if (fetchError) {
        console.error('❌ Error fetching slot assignments:', fetchError);
        setError(fetchError.message);
        // Ne pas lancer d'erreur pour éviter la boucle infinie
        setAssignments([]);
        return;
      }

      console.log('✅ Slot assignments loaded:', data?.length || 0, 'items');
      setAssignments(data || []);
    } catch (err: any) {
      console.error('❌ Failed to fetch slot assignments:', err);
      setError(err.message || 'Erreur lors du chargement des attributions');
      setAssignments([]);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
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
    // Reset le cache pour forcer un nouveau fetch
    lastFetchRef.current = '';
    if (currentClinicId && selectedDate) {
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
