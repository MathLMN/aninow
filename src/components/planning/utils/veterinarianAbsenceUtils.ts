
import { isWithinInterval, parseISO } from 'date-fns';

interface VeterinarianAbsence {
  id: string;
  veterinarian_id: string;
  start_date: string;
  end_date: string;
  absence_type: string;
  is_recurring: boolean;
}

interface VeterinarianSchedule {
  veterinarian_id: string;
  day_of_week: number;
  is_working: boolean;
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

export const isVeterinarianNotWorking = (
  veterinarianId: string,
  date: Date,
  schedules: VeterinarianSchedule[]
): boolean => {
  const dayOfWeek = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
  
  const schedule = schedules.find(
    s => s.veterinarian_id === veterinarianId && s.day_of_week === dayOfWeek
  );
  
  // Si pas de schedule trouvé, on considère qu'il travaille (par défaut)
  if (!schedule) return false;
  
  // Retourne true si is_working est false
  return !schedule.is_working;
};
