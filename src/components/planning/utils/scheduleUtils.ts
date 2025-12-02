import { isWithinInterval } from 'date-fns';
import { processBookingWithoutPreference } from './appointmentAssignment';
import { getAssignedVeterinarian } from './slotAssignmentUtils';
import { isVeterinarianAbsent, isVeterinarianNotWorking } from './veterinarianAbsenceUtils';

// Calcul de la date de Pâques (algorithme de Butcher)
const getEasterDate = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
};

export const isFrenchPublicHoliday = (date: Date): boolean => {
  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  // Jours fériés fixes
  const fixedHolidays = [
    { day: 1, month: 0 },   // 1er janvier
    { day: 1, month: 4 },   // 1er mai
    { day: 8, month: 4 },   // 8 mai
    { day: 14, month: 6 },  // 14 juillet
    { day: 15, month: 7 },  // 15 août
    { day: 1, month: 10 },  // 1er novembre
    { day: 11, month: 10 }, // 11 novembre
    { day: 25, month: 11 }, // 25 décembre
  ];

  if (fixedHolidays.some(h => h.day === day && h.month === month)) {
    return true;
  }

  // Jours fériés mobiles basés sur Pâques
  const easter = getEasterDate(year);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  
  const whitMonday = new Date(easter);
  whitMonday.setDate(easter.getDate() + 50);

  const mobileHolidays = [easterMonday, ascension, whitMonday];
  
  return mobileHolidays.some(h => 
    h.getDate() === day && 
    h.getMonth() === month && 
    h.getFullYear() === year
  );
};

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

    // Utiliser une logique plus stricte : le créneau doit être strictement avant l'heure de fin
    // Par exemple, si c'est ouvert de 8h à 12h, le créneau de 12h00 doit être fermé
    return slotTime >= startTime && slotTime < endTime;
  };

  // Vérifier si le créneau est dans les heures du matin ou de l'après-midi
  const inMorningSchedule = daySchedule.morning && isWithinSchedule(daySchedule.morning);
  const inAfternoonSchedule = daySchedule.afternoon && isWithinSchedule(daySchedule.afternoon);
  
  return inMorningSchedule || inAfternoonSchedule;
};

export const getDaySchedule = (selectedDate: Date, settings: any) => {
  if (!settings || !settings.daily_schedules) {
    // Retourner un horaire par défaut si pas de paramètres
    return {
      isOpen: true,
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "19:00" }
    };
  }

  // Si c'est un jour férié, utiliser les horaires du dimanche (fermé)
  if (isFrenchPublicHoliday(selectedDate)) {
    return settings.daily_schedules['sunday'];
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
  absences: any[] = [],
  schedules: any[] = []
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

  // Filtrer les vétérinaires actifs
  const activeVets = veterinarians.filter(vet => vet.is_active);
  
  // Trier selon l'ordre personnalisé si disponible
  let orderedVets = activeVets;
  if (settings?.veterinarian_columns_order && settings.veterinarian_columns_order.length > 0) {
    // Créer une map pour accès rapide
    const vetMap = new Map(activeVets.map(v => [v.id, v]));
    
    // Trier selon l'ordre enregistré
    const ordered = settings.veterinarian_columns_order
      .map((id: string) => vetMap.get(id))
      .filter(Boolean);
    
    // Ajouter les nouveaux vétérinaires (non présents dans l'ordre enregistré) à la fin
    const orderedIds = new Set(settings.veterinarian_columns_order);
    const newVets = activeVets.filter(v => !orderedIds.has(v.id));
    
    orderedVets = [...ordered, ...newVets];
  } else {
    // Si pas d'ordre personnalisé, trier alphabétiquement
    orderedVets = [...activeVets].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Ajouter les colonnes des vétérinaires dans l'ordre
  orderedVets.forEach(vet => {
    const isAbsent = selectedDate ? isVeterinarianAbsent(vet.id, selectedDate, absences) : false;
    const isNotWorking = selectedDate ? isVeterinarianNotWorking(vet.id, selectedDate, schedules) : false;
    
    columns.push({
      id: vet.id,
      title: vet.name,
      type: 'veterinarian',
      isDisabled: isAbsent || isNotWorking,
      absenceInfo: isAbsent ? 'Absent' : (isNotWorking ? 'Repos' : null)
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
  absences: any[] = [],
  schedules: any[] = []
): boolean => {
  // Vérifier si la clinique est fermée
  if (!isTimeSlotOpen(time, daySchedule)) {
    return true;
  }

  // Pour les colonnes vétérinaires, vérifier les absences et les jours de repos
  if (columnId !== 'asv') {
    if (isVeterinarianAbsent(columnId, selectedDate, absences)) {
      return true;
    }
    if (isVeterinarianNotWorking(columnId, selectedDate, schedules)) {
      return true;
    }
  }

  return false;
};
