
export const generateAllTimeSlots = () => {
  const slots = [];
  // Générer les créneaux de 8h à 19h par quarts d'heure comme dans l'image
  for (let hour = 8; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

export const getDaySchedule = (selectedDate: Date, settings: any) => {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayOfWeek = dayNames[selectedDate.getDay()];
  return settings.daily_schedules[dayOfWeek];
};

export const isTimeSlotOpen = (time: string, daySchedule: any) => {
  if (!daySchedule.isOpen) return false;

  const [hours, minutes] = time.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;

  // Vérifier le matin
  if (daySchedule.morning.start && daySchedule.morning.end) {
    const [morningStartH, morningStartM] = daySchedule.morning.start.split(':').map(Number);
    const [morningEndH, morningEndM] = daySchedule.morning.end.split(':').map(Number);
    const morningStart = morningStartH * 60 + morningStartM;
    const morningEnd = morningEndH * 60 + morningEndM;

    if (timeInMinutes >= morningStart && timeInMinutes < morningEnd) {
      return true;
    }
  }

  // Vérifier l'après-midi
  if (daySchedule.afternoon.start && daySchedule.afternoon.end) {
    const [afternoonStartH, afternoonStartM] = daySchedule.afternoon.start.split(':').map(Number);
    const [afternoonEndH, afternoonEndM] = daySchedule.afternoon.end.split(':').map(Number);
    const afternoonStart = afternoonStartH * 60 + afternoonStartM;
    const afternoonEnd = afternoonEndH * 60 + afternoonEndM;

    if (timeInMinutes >= afternoonStart && timeInMinutes < afternoonEnd) {
      return true;
    }
  }

  return false;
};

export const getScheduleInfo = (daySchedule: any) => {
  if (!daySchedule.isOpen) {
    return "Clinique fermée";
  }
  
  const parts = [];
  if (daySchedule.morning.start && daySchedule.morning.end) {
    parts.push(`${daySchedule.morning.start}-${daySchedule.morning.end}`);
  }
  if (daySchedule.afternoon.start && daySchedule.afternoon.end) {
    parts.push(`${daySchedule.afternoon.start}-${daySchedule.afternoon.end}`);
  }
  return parts.join(' • ');
};

export const getBookingsForSlot = (time: string, columnId: string, bookings: any[], selectedDate: Date) => {
  const dateStr = selectedDate.toISOString().split('T')[0];
  return bookings.filter(booking => {
    const matchesDate = booking.appointment_date === dateStr;
    const matchesTime = booking.appointment_time === time;
    
    if (columnId === 'asv') {
      return matchesDate && matchesTime && booking.requires_asv;
    } else {
      return matchesDate && matchesTime && booking.veterinarian_id === columnId;
    }
  });
};

export const generateColumns = (veterinarians: any[], settings: any) => {
  const columns = [];
  
  // Ajouter les colonnes vétérinaires basées sur les vétérinaires actifs
  if (veterinarians && veterinarians.length > 0) {
    veterinarians.forEach((vet) => {
      if (vet.is_active) {
        columns.push({
          id: vet.id,
          title: vet.name,
          type: 'veterinarian'
        });
      }
    });
  }
  
  // Ajouter la colonne ASV si activée
  if (settings.asv_enabled) {
    columns.push({
      id: 'asv',
      title: 'ASV',
      type: 'asv'
    });
  }

  return columns;
};

// Nouvelle fonction pour déterminer si c'est une heure pleine
export const isFullHour = (time: string) => {
  return time.endsWith(':00');
};
