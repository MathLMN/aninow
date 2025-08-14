
import { useState, useEffect, useRef } from 'react';
import { getSlotAssignments, SlotAssignment } from '@/components/planning/utils/slotAssignmentUtils';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from './useClinicAccess';

export const useSlotAssignments = (selectedDate: Date) => {
  const [assignments, setAssignments] = useState<SlotAssignment[]>([]);
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
    
    // Prevent repetitive calls
    if (fetchingRef.current || lastFetchRef.current === cacheKey) {
      return;
    }

    try {
      fetchingRef.current = true;
      lastFetchRef.current = cacheKey;
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching slot assignments for date:', dateStr, 'clinic:', currentClinicId);
      
      // Use the updated utility function that requires clinicId
      const data = await getSlotAssignments(dateStr, currentClinicId);

      console.log('✅ Slot assignments loaded:', data.length, 'items');
      setAssignments(data);
    } catch (err: any) {
      console.error('❌ Failed to fetch slot assignments:', err);
      setError(err.message || 'Erreur lors du chargement des attributions');
      setAssignments([]);
      // Don't show toast for RLS errors to prevent spam
      if (!err.message?.includes('row-level security')) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les attributions",
          variant: "destructive"
        });
      }
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
    // Reset cache to force new fetch
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
