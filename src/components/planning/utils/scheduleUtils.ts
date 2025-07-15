import { isWithinInterval } from 'date-fns';
import { processBookingWithoutPreference } from './appointmentAssignment';

export const generateAllTimeSlots = () => {
  const timeSlots = [];
  for (let hour = 8; hour <= 19; hour++) {
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

export const generateColumns = (veterinarians: any[], settings: any) => {
  const columns = [];

  // Ne plus afficher la colonne ASV par défaut
  // Les créneaux sans préférence seront maintenant assignés automatiquement

  veterinarians.filter(vet => vet.is_active).forEach(vet => {
    columns.push({
      id: vet.id,
      title: vet.name,
      type: 'veterinarian'
    });
  });

  return columns;
};

export const isFullHour = (time: string) => {
  return time.endsWith('00');
};

export const getBookingsForSlot = (
  time: string, 
  columnId: string, 
  bookings: any[], 
  selectedDate: Date,
  veterinarians: any[] = [],
  settings: any = null
) => {
  const dateStr = selectedDate.toISOString().split('T')[0];
  
  // Traiter les bookings sans préférence de vétérinaire
  const processedBookings = bookings.map(booking => {
    if (!booking.veterinarian_id && booking.appointment_date === dateStr) {
      return processBookingWithoutPreference(booking, veterinarians, bookings, settings);
    }
    return booking;
  });

  return processedBookings.filter(booking => {
    // Vérifier la date
    if (booking.appointment_date !== dateStr) return false;
    
    // Vérifier l'heure
    if (booking.appointment_time !== time) return false;
    
    // Afficher les rendez-vous assignés à ce vétérinaire
    return booking.veterinarian_id === columnId;
  });
};
