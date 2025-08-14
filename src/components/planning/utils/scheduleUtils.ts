import { isWithinInterval } from 'date-fns';
import { processBookingWithoutPreference } from './appointmentAssignment';
import { getAssignedVeterinarian } from './slotAssignmentUtils';
import { isVeterinarianAbsent } from './veterinarianAbsenceUtils';

export const generateAllTimeSlots = () => {
  const timeSlots = [];
  for (let hour = 7; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }
  return timeSlots;
};

export const isTimeSlotOpen = (time: string, daySchedule: any) => {
  if (!daySchedule || !daySchedule.isOpen) {
    return false;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);

  const isWithinSchedule = (schedule: any) => {
    if (!schedule || !schedule.start || !schedule.end) {
      return false;
    }

    const start = schedule.start.split(':').map(Number);
    const end = schedule.end.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(start[0], start[1], 0, 0);

    const endTime = new Date();
    endTime.setHours(end[0], end[1], 0, 0);

    return isWithinInterval(slotTime, { start: startTime, end: endTime });
  };

  return isWithinSchedule(daySchedule.morning) || isWithinSchedule(daySchedule.afternoon);
};

export const getDaySchedule = (selectedDate: Date, settings: any) => {
  if (!settings || !settings.daily_schedules) {
    return null;
  }

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayOfWeek = dayNames[selectedDate.getDay()];
  return settings.daily_schedules[dayOfWeek];
};

export const getScheduleInfo = (daySchedule: any) => {
  if (!daySchedule) {
    return { isOpen: false, message: "Fermé" };
  }

  if (!daySchedule.isOpen) {
    return { isOpen: false, message: "Fermé" };
  }

  let message = "Ouvert";
  if (daySchedule.morning?.start && daySchedule.morning?.end) {
    message += ` ${daySchedule.morning.start} - ${daySchedule.morning.end}`;
  }
  if (daySchedule.afternoon?.start && daySchedule.afternoon?.end) {
    message += ` / ${daySchedule.afternoon.start} - ${daySchedule.afternoon.end}`;
  }

  return { isOpen: true, message };
};

export const generateColumns = (
  veterinarians: any[], 
  settings: any, 
  selectedDate?: Date, 
  absences: any[] = []
) => {
  const columns = [];

  // Ajouter la colonne ASV en premier si elle est activée
  if (settings && settings.asv_enabled) {
    columns.push({
      id: 'asv',
      title: 'ASV',
      type: 'asv',
      isDisabled: false
    });
  }

  // Ajouter les colonnes des vétérinaires actifs
  veterinarians.filter(vet => vet.is_active).forEach(vet => {
    const isAbsent = selectedDate ? isVeterinarianAbsent(vet.id, selectedDate, absences) : false;
    
    columns.push({
      id: vet.id,
      title: vet.name,
      type: 'veterinarian',
      isDisabled: isAbsent,
      absenceInfo: isAbsent ? 'Absent' : null
    });
  });

  return columns;
};

export const isFullHour = (time: string) => {
  return time.endsWith('00');
};

export const getBookingsForSlot = async (
  time: string, 
  columnId: string, 
  bookings: any[], 
  selectedDate: Date,
  veterinarians: any[] = [],
  settings: any = null,
  absences: any[] = [],
  clinicId?: string
) => {
  const dateStr = selectedDate.toISOString().split('T')[0];
  
  // Pour la colonne ASV : ne jamais afficher les rendez-vous clients
  if (columnId === 'asv') {
    return [];
  }

  // Si le vétérinaire est absent, ne pas afficher les rendez-vous
  if (isVeterinarianAbsent(columnId, selectedDate, absences)) {
    return [];
  }

  // Vérifier s'il y a une attribution spécifique pour ce créneau
  const assignedVetId = clinicId ? await getAssignedVeterinarian(dateStr, time, clinicId) : null;
  
  // Traiter les bookings sans préférence de vétérinaire
  const processedBookings = bookings.map(booking => {
    if (!booking.veterinarian_id && booking.appointment_date === dateStr) {
      // Si il y a une attribution spécifique, l'utiliser
      if (assignedVetId) {
        return { ...booking, veterinarian_id: assignedVetId };
      }
      // Sinon, utiliser l'ancien système de fallback
      return processBookingWithoutPreference(booking, veterinarians, bookings, settings);
    }
    return booking;
  });

  return processedBookings.filter(booking => {
    // Vérifier la date
    if (booking.appointment_date !== dateStr) return false;
    
    // Vérifier l'heure
    if (booking.appointment_time !== time) return false;
    
    // Pour les colonnes vétérinaires : afficher les rendez-vous assignés à ce vétérinaire
    return booking.veterinarian_id === columnId;
  });
};

export const isSlotDisabled = (
  time: string,
  columnId: string,
  selectedDate: Date,
  daySchedule: any,
  absences: any[] = []
): boolean => {
  // Vérifier si la clinique est fermée
  if (!isTimeSlotOpen(time, daySchedule)) {
    return true;
  }

  // Pour les colonnes vétérinaires, vérifier les absences
  if (columnId !== 'asv' && isVeterinarianAbsent(columnId, selectedDate, absences)) {
    return true;
  }

  return false;
};
