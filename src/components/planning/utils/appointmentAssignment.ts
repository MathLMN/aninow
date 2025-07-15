
// Utilitaires pour l'attribution automatique des rendez-vous

/**
 * Détermine quel vétérinaire doit être assigné à un créneau
 * en fonction des disponibilités
 */
export const assignVeterinarianToSlot = (
  timeSlot: string,
  date: Date,
  veterinarians: any[],
  bookings: any[],
  settings: any
) => {
  // Filtrer les vétérinaires actifs
  const activeVets = veterinarians.filter(vet => vet.is_active);
  
  if (activeVets.length === 0) {
    return null;
  }

  // Vérifier quels vétérinaires sont disponibles à ce créneau
  const availableVets = activeVets.filter(vet => {
    // Vérifier si le vétérinaire a déjà un RDV à ce créneau
    const hasBooking = bookings.some(booking => 
      booking.appointment_time === timeSlot &&
      booking.appointment_date === date.toISOString().split('T')[0] &&
      booking.veterinarian_id === vet.id
    );
    
    return !hasBooking;
  });

  if (availableVets.length === 0) {
    return null; // Aucun vétérinaire disponible
  }

  if (availableVets.length === 1) {
    // Un seul vétérinaire disponible : attribution automatique
    return availableVets[0].id;
  }

  // Plusieurs vétérinaires disponibles : attribution aléatoire
  const randomIndex = Math.floor(Math.random() * availableVets.length);
  return availableVets[randomIndex].id;
};

/**
 * Traite une réservation sans préférence de vétérinaire
 * et l'assigne automatiquement
 */
export const processBookingWithoutPreference = (
  booking: any,
  veterinarians: any[],
  allBookings: any[],
  settings: any
) => {
  // Si le booking a déjà un vétérinaire assigné, ne rien faire
  if (booking.veterinarian_id) {
    return booking;
  }

  const appointmentDate = new Date(booking.appointment_date);
  const assignedVetId = assignVeterinarianToSlot(
    booking.appointment_time,
    appointmentDate,
    veterinarians,
    allBookings,
    settings
  );

  return {
    ...booking,
    veterinarian_id: assignedVetId,
    auto_assigned: true // Marqueur pour indiquer l'attribution automatique
  };
};
