
import { supabase } from '@/integrations/supabase/client';

export interface SlotAssignment {
  id: string;
  date: string;
  time_slot: string;
  veterinarian_id: string;
  assignment_type: 'auto' | 'manual';
  clinic_id: string; // Make required to match RLS policies
  created_at: string;
  updated_at: string;
}

export const getSlotAssignments = async (date: string, clinicId: string): Promise<SlotAssignment[]> => {
  try {
    if (!clinicId) {
      console.warn('⚠️ No clinic ID provided for slot assignments');
      return [];
    }

    console.log('🔄 Fetching slot assignments for date:', date, 'clinic:', clinicId);
    
    const { data, error } = await supabase
      .from('slot_assignments')
      .select('*')
      .eq('date', date)
      .eq('clinic_id', clinicId); // Only fetch for specific clinic

    if (error) {
      console.error('❌ Error fetching slot assignments:', error);
      // Don't throw to prevent infinite loops
      return [];
    }

    console.log('✅ Slot assignments loaded:', data?.length || 0);
    return (data || []) as SlotAssignment[];
  } catch (error) {
    console.error('❌ Failed to fetch slot assignments:', error);
    return [];
  }
};

export const createSlotAssignment = async (
  date: string,
  timeSlot: string,
  veterinarianId: string,
  clinicId: string,
  type: 'auto' | 'manual' = 'auto'
): Promise<boolean> => {
  try {
    if (!clinicId) {
      console.error('❌ Cannot create slot assignment without clinic ID');
      return false;
    }

    console.log('🔄 Creating slot assignment:', { date, timeSlot, veterinarianId, clinicId, type });
    
    const { error } = await supabase
      .from('slot_assignments')
      .upsert({
        date,
        time_slot: timeSlot,
        veterinarian_id: veterinarianId,
        clinic_id: clinicId,
        assignment_type: type
      }, {
        onConflict: 'date,time_slot,clinic_id'
      });

    if (error) {
      console.error('❌ Error creating slot assignment:', error);
      return false; // Don't throw to prevent UI breaks
    }

    console.log('✅ Slot assignment created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create slot assignment:', error);
    return false;
  }
};

export const deleteSlotAssignment = async (date: string, timeSlot: string, clinicId: string): Promise<boolean> => {
  try {
    if (!clinicId) {
      console.error('❌ Cannot delete slot assignment without clinic ID');
      return false;
    }

    console.log('🔄 Deleting slot assignment:', { date, timeSlot, clinicId });
    
    const { error } = await supabase
      .from('slot_assignments')
      .delete()
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .eq('clinic_id', clinicId);

    if (error) {
      console.error('❌ Error deleting slot assignment:', error);
      return false; // Don't throw to prevent UI breaks
    }

    console.log('✅ Slot assignment deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete slot assignment:', error);
    return false;
  }
};

export const getAssignedVeterinarian = async (date: string, timeSlot: string, clinicId: string): Promise<string | null> => {
  try {
    if (!clinicId) {
      console.warn('⚠️ No clinic ID provided for getting assigned veterinarian');
      return null;
    }

    const { data, error } = await supabase
      .from('slot_assignments')
      .select('veterinarian_id')
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) {
      console.error('❌ Error getting assigned veterinarian:', error);
      return null; // Don't throw to prevent UI breaks
    }

    return (data && data.length > 0) ? data[0].veterinarian_id : null;
  } catch (error) {
    console.error('❌ Failed to get assigned veterinarian:', error);
    return null;
  }
};

export const reassignSlot = async (
  date: string,
  timeSlot: string,
  newVeterinarianId: string,
  clinicId: string
): Promise<boolean> => {
  try {
    if (!clinicId) {
      console.error('❌ Cannot reassign slot without clinic ID');
      return false;
    }

    console.log('🔄 Reassigning slot:', { date, timeSlot, newVeterinarianId, clinicId });
    
    const { error } = await supabase
      .from('slot_assignments')
      .upsert({
        date,
        time_slot: timeSlot,
        veterinarian_id: newVeterinarianId,
        clinic_id: clinicId,
        assignment_type: 'manual'
      }, {
        onConflict: 'date,time_slot,clinic_id'
      });

    if (error) {
      console.error('❌ Error reassigning slot:', error);
      return false; // Don't throw to prevent UI breaks
    }

    console.log('✅ Slot reassigned successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to reassign slot:', error);
    return false;
  }
};
