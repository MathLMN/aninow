
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
  
  // Filtrer les rendez-vous qui commencent à cette heure exacte
  const appointmentsAtThisTime = bookings.filter(booking => {
    const matchesDate = booking.appointment_date === dateStr;
    const matchesTime = booking.appointment_time === time;
    
    if (columnId === 'asv') {
      return matchesDate && matchesTime && booking.requires_asv;
    } else {
      return matchesDate && matchesTime && booking.veterinarian_id === columnId;
    }
  });

  // Vérifier aussi les rendez-vous qui se chevauchent avec ce créneau
  const overlappingAppointments = bookings.filter(booking => {
    if (!booking.appointment_time || !booking.duration_minutes || booking.appointment_time === time) {
      return false; // Déjà traité au-dessus ou pas de données de durée
    }

    const matchesDate = booking.appointment_date === dateStr;
    if (!matchesDate) return false;

    const matchesColumn = columnId === 'asv' 
      ? booking.requires_asv 
      : booking.veterinarian_id === columnId;
    if (!matchesColumn) return false;

    // Calculer si ce créneau chevauche avec le rendez-vous
    const [startHour, startMin] = booking.appointment_time.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMin;
    const endTimeInMinutes = startTimeInMinutes + booking.duration_minutes;

    const [currentHour, currentMin] = time.split(':').map(Number);
    const currentTimeInMinutes = currentHour * 60 + currentMin;
    const currentEndTimeInMinutes = currentTimeInMinutes + 15; // Chaque slot fait 15 min

    // Vérifier le chevauchement
    return (currentTimeInMinutes < endTimeInMinutes && currentEndTimeInMinutes > startTimeInMinutes);
  });

  // Combiner les deux listes et supprimer les doublons
  const allRelevantAppointments = [...appointmentsAtThisTime, ...overlappingAppointments];
  const uniqueAppointments = allRelevantAppointments.filter((appointment, index, array) => 
    array.findIndex(a => a.id === appointment.id) === index
  );

  return uniqueAppointments;
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
