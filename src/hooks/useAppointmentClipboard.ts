
import { useState } from 'react';

interface ClipboardAppointment {
  data: any;
  action: 'copy' | 'cut';
}

export const useAppointmentClipboard = () => {
  const [clipboard, setClipboard] = useState<ClipboardAppointment | null>(null);

  const copyAppointment = (appointment: any) => {
    console.log('📋 Copying appointment to clipboard:', appointment);
    setClipboard({
      data: { ...appointment },
      action: 'copy'
    });
  };

  const cutAppointment = (appointment: any) => {
    console.log('✂️ Cutting appointment to clipboard:', appointment);
    setClipboard({
      data: { ...appointment },
      action: 'cut'
    });
  };

  const pasteAppointment = (targetTimeSlot: { date: string; time: string; veterinarian?: string }) => {
    if (!clipboard) return null;

    console.log('📌 Pasting appointment from clipboard to:', targetTimeSlot);
    
    const result = {
      appointmentId: clipboard.data.id,
      newDate: targetTimeSlot.date,
      newTime: targetTimeSlot.time,
      newVetId: targetTimeSlot.veterinarian,
      action: clipboard.action,
      // Données complètes pour copy (création)
      copyData: clipboard.action === 'copy' ? {
        appointmentDate: targetTimeSlot.date,
        appointmentTime: targetTimeSlot.time,
        veterinarianId: targetTimeSlot.veterinarian,
        
        clientName: clipboard.data.client_name,
        clientEmail: clipboard.data.client_email,
        clientPhone: clipboard.data.client_phone,
        preferredContactMethod: clipboard.data.preferred_contact_method,
        clientStatus: clipboard.data.client_status,
        
        animalName: clipboard.data.animal_name,
        animalSpecies: clipboard.data.animal_species,
        animalBreed: clipboard.data.animal_breed,
        animalAge: clipboard.data.animal_age,
        animalWeight: clipboard.data.animal_weight,
        animalSex: clipboard.data.animal_sex,
        animalSterilized: clipboard.data.animal_sterilized,
        animalVaccinesUpToDate: clipboard.data.animal_vaccines_up_to_date,
        
        consultationReason: clipboard.data.consultation_reason,
        clientComment: clipboard.data.client_comment,
        consultationTypeId: clipboard.data.consultation_type_id,
        duration: clipboard.data.duration_minutes,
      } : null
    };

    // Si c'était un "couper", vider le clipboard après utilisation
    if (clipboard.action === 'cut') {
      setClipboard(null);
    }

    return result;
  };

  const clearClipboard = () => {
    console.log('🗑️ Clearing clipboard');
    setClipboard(null);
  };

  const hasClipboard = () => {
    return clipboard !== null;
  };

  const getClipboardAction = () => {
    return clipboard?.action || null;
  };

  const getClipboardAppointment = () => {
    return clipboard?.data || null;
  };

  return {
    copyAppointment,
    cutAppointment,
    pasteAppointment,
    clearClipboard,
    hasClipboard,
    getClipboardAction,
    getClipboardAppointment
  };
};
