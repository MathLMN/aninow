
import { isWithinInterval, parseISO } from 'date-fns';

interface VeterinarianAbsence {
  id: string;
  veterinarian_id: string;
  start_date: string;
  end_date: string;
  absence_type: string;
  is_recurring: boolean;
}

export const isVeterinarianAbsent = (
  veterinarianId: string,
  date: Date,
  absences: VeterinarianAbsence[]
): boolean => {
  return absences.some(absence => {
    if (absence.veterinarian_id !== veterinarianId) {
      return false;
    }

    const startDate = parseISO(absence.start_date);
    const endDate = parseISO(absence.end_date);
    
    // Ajuster les heures pour inclure toute la journée
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return isWithinInterval(date, { start: startDate, end: endDate });
  });
};

export const getAbsentVeterinarians = (
  date: Date,
  absences: VeterinarianAbsence[]
): string[] => {
  return absences
    .filter(absence => {
      const startDate = parseISO(absence.start_date);
      const endDate = parseISO(absence.end_date);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return isWithinInterval(date, { start: startDate, end: endDate });
    })
    .map(absence => absence.veterinarian_id);
};

export const shouldDisableVeterinarianColumn = (
  veterinarianId: string,
  date: Date,
  absences: VeterinarianAbsence[]
): boolean => {
  return isVeterinarianAbsent(veterinarianId, date, absences);
};
