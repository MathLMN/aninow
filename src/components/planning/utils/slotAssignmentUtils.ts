
import { supabase } from '@/integrations/supabase/client';

export interface SlotAssignment {
  id: string;
  date: string;
  time_slot: string;
  veterinarian_id: string;
  assignment_type: 'auto' | 'manual';
  created_at: string;
  updated_at: string;
}

export const getSlotAssignments = async (date: string): Promise<SlotAssignment[]> => {
  try {
    const { data, error } = await supabase
      .from('slot_assignments')
      .select('*')
      .eq('date', date);

    if (error) throw error;
    return (data || []) as SlotAssignment[];
  } catch (error) {
    console.error('Erreur lors de la récupération des attributions:', error);
    return [];
  }
};

export const createSlotAssignment = async (
  date: string,
  timeSlot: string,
  veterinarianId: string,
  type: 'auto' | 'manual' = 'auto'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('slot_assignments')
      .upsert({
        date,
        time_slot: timeSlot,
        veterinarian_id: veterinarianId,
        assignment_type: type
      }, {
        onConflict: 'date,time_slot'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de l\'attribution:', error);
    return false;
  }
};

export const deleteSlotAssignment = async (date: string, timeSlot: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('slot_assignments')
      .delete()
      .eq('date', date)
      .eq('time_slot', timeSlot);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'attribution:', error);
    return false;
  }
};

export const getAssignedVeterinarian = async (date: string, timeSlot: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('slot_assignments')
      .select('veterinarian_id')
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) throw error;
    return (data && data.length > 0) ? data[0].veterinarian_id : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'attribution:', error);
    return null;
  }
};

export const reassignSlot = async (
  date: string,
  timeSlot: string,
  newVeterinarianId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('slot_assignments')
      .upsert({
        date,
        time_slot: timeSlot,
        veterinarian_id: newVeterinarianId,
        assignment_type: 'manual'
      }, {
        onConflict: 'date,time_slot'
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la réassignation:', error);
    return false;
  }
};
