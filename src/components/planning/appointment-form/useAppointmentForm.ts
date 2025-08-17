
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicAccess } from '@/hooks/useClinicAccess';

interface FormData {
  // Rendez-vous
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string;
  veterinarianId: string;
  consultationTypeId: string;
  duration: number;
  arrival_time: string | null;
  
  // Client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredContactMethod: string;
  clientStatus: string;
  
  // Animal
  animalName: string;
  animalSpecies: string;
  animalBreed: string | null;
  animalAge: string | null;
  animalWeight: number | null;
  animalSex: string | null;
  animalSterilized: boolean | null;
  animalVaccinesUpToDate: boolean | null;
  
  // Consultation
  consultationReason: string;
  clientComment: string | null;
}

export const useAppointmentForm = (onClose: () => void, appointmentId?: string) => {
  const { toast } = useToast();
  const { currentClinicId } = useClinicAccess();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    appointmentDate: '',
    appointmentTime: '',
    appointmentEndTime: '',
    veterinarianId: '',
    consultationTypeId: '',
    duration: 30,
    arrival_time: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    preferredContactMethod: 'phone',
    clientStatus: 'existing',
    animalName: '',
    animalSpecies: 'chien',
    animalBreed: null,
    animalAge: null,
    animalWeight: null,
    animalSex: null,
    animalSterilized: null,
    animalVaccinesUpToDate: null,
    consultationReason: '',
    clientComment: null,
  });

  const updateField = (field: keyof FormData, value: any) => {
    console.log(`🔄 Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsultationTypeChange = (consultationTypeId: string, consultationTypes: any[]) => {
    console.log('🔄 Consultation type changed:', consultationTypeId);
    const selectedType = consultationTypes.find(type => type.id === consultationTypeId);
    if (selectedType) {
      const duration = selectedType.duration_minutes;
      console.log('📊 Selected consultation type:', selectedType.name, 'Duration:', duration);
      
      updateField('consultationTypeId', consultationTypeId);
      updateField('duration', duration);
      
      // Recalculer l'heure de fin si on a une heure de début
      if (formData.appointmentTime) {
        const endTime = calculateEndTime(formData.appointmentTime, duration);
        console.log('⏰ Calculated end time:', endTime);
        updateField('appointmentEndTime', endTime);
      }
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    return endDate.toTimeString().slice(0, 5);
  };

  const initializeFormData = (defaultData: any) => {
    console.log('🔄 Initializing form with data:', defaultData);
    
    // Mise à jour des champs un par un pour déclencher les recalculs
    if (defaultData.appointmentDate || defaultData.date) {
      const date = defaultData.appointmentDate || defaultData.date;
      console.log('📅 Setting appointment date:', date);
      updateField('appointmentDate', date);
    }
    
    if (defaultData.appointmentTime || defaultData.time) {
      const time = defaultData.appointmentTime || defaultData.time;
      console.log('⏰ Setting appointment time:', time);
      updateField('appointmentTime', time);
    }
    
    if (defaultData.appointmentEndTime) {
      updateField('appointmentEndTime', defaultData.appointmentEndTime);
    }
    
    if (defaultData.veterinarianId || (defaultData.veterinarian && defaultData.veterinarian !== 'asv')) {
      const vetId = defaultData.veterinarianId || defaultData.veterinarian;
      console.log('👨‍⚕️ Setting veterinarian:', vetId);
      updateField('veterinarianId', vetId);
    }
    
    if (defaultData.consultationTypeId) {
      updateField('consultationTypeId', defaultData.consultationTypeId);
    }
    
    if (defaultData.duration) {
      updateField('duration', defaultData.duration);
    }
    
    if (defaultData.arrival_time) {
      updateField('arrival_time', defaultData.arrival_time);
    }
    
    // Données client
    if (defaultData.clientName) updateField('clientName', defaultData.clientName);
    if (defaultData.clientEmail) updateField('clientEmail', defaultData.clientEmail);
    if (defaultData.clientPhone) updateField('clientPhone', defaultData.clientPhone);
    if (defaultData.preferredContactMethod) updateField('preferredContactMethod', defaultData.preferredContactMethod);
    if (defaultData.clientStatus) updateField('clientStatus', defaultData.clientStatus);
    
    // Données animal
    if (defaultData.animalName) updateField('animalName', defaultData.animalName);
    if (defaultData.animalSpecies) updateField('animalSpecies', defaultData.animalSpecies);
    if (defaultData.animalBreed) updateField('animalBreed', defaultData.animalBreed);
    if (defaultData.animalAge) updateField('animalAge', defaultData.animalAge);
    if (defaultData.animalWeight) updateField('animalWeight', defaultData.animalWeight);
    if (defaultData.animalSex) updateField('animalSex', defaultData.animalSex);
    if (defaultData.animalSterilized !== undefined) updateField('animalSterilized', defaultData.animalSterilized);
    if (defaultData.animalVaccinesUpToDate !== undefined) updateField('animalVaccinesUpToDate', defaultData.animalVaccinesUpToDate);
    
    // Consultation
    if (defaultData.consultationReason) updateField('consultationReason', defaultData.consultationReason);
    if (defaultData.clientComment) updateField('clientComment', defaultData.clientComment);
    
    // Recalculer l'heure de fin si on a time et duration
    const time = defaultData.appointmentTime || defaultData.time;
    const duration = defaultData.duration || formData.duration;
    if (time && duration && !defaultData.appointmentEndTime) {
      const endTime = calculateEndTime(time, duration);
      console.log('⏰ Initial end time calculation:', endTime);
      updateField('appointmentEndTime', endTime);
    }
  };

  const handleTimeChange = (time: string) => {
    console.log('⏰ Time changed to:', time);
    updateField('appointmentTime', time);
    
    // Recalculer l'heure de fin avec la durée actuelle
    if (time && formData.duration) {
      const endTime = calculateEndTime(time, formData.duration);
      console.log('⏰ Recalculated end time:', endTime);
      updateField('appointmentEndTime', endTime);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentClinicId) {
      toast({
        title: "Erreur",
        description: "Aucune clinique sélectionnée",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        clinic_id: currentClinicId,
        animal_name: formData.animalName,
        animal_species: formData.animalSpecies,
        animal_breed: formData.animalBreed,
        animal_age: formData.animalAge,
        animal_weight: formData.animalWeight,
        animal_sex: formData.animalSex,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        preferred_contact_method: formData.preferredContactMethod,
        client_status: formData.clientStatus,
        consultation_reason: formData.consultationReason,
        client_comment: formData.clientComment,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        appointment_end_time: formData.appointmentEndTime,
        veterinarian_id: formData.veterinarianId || null,
        consultation_type_id: formData.consultationTypeId,
        duration_minutes: formData.duration,
        arrival_time: formData.arrival_time,
        status: 'confirmed',
        selected_symptoms: [],
        convenience_options: [],
        multiple_animals: [],
        custom_species: null,
        second_animal_species: null,
        second_animal_name: null,
        second_custom_species: null,
        vaccination_type: null,
        custom_text: null,
        custom_symptom: null,
        second_animal_different_reason: false,
        second_animal_consultation_reason: null,
        second_animal_convenience_options: [],
        second_animal_custom_text: null,
        second_animal_selected_symptoms: [],
        second_animal_custom_symptom: null,
        conditional_answers: null,
        symptom_duration: null,
        additional_points: [],
        second_animal_age: null,
        second_animal_breed: null,
        second_animal_weight: null,
        second_animal_sex: null,
        second_animal_sterilized: null,
        second_animal_vaccines_up_to_date: null,
        animal_sterilized: formData.animalSterilized,
        animal_vaccines_up_to_date: formData.animalVaccinesUpToDate,
        ai_analysis: null,
        urgency_score: null,
        recommended_actions: [],
        is_blocked: false
      };

      console.log('📤 Sending appointment data:', appointmentData);

      let result;
      if (appointmentId) {
        // Mode édition
        console.log('✏️ Updating appointment:', appointmentId);
        result = await supabase
          .from('bookings')
          .update(appointmentData)
          .eq('id', appointmentId)
          .select();
      } else {
        // Mode création
        console.log('➕ Creating new appointment');
        result = await supabase
          .from('bookings')
          .insert([appointmentData])
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('❌ Error saving appointment:', error);
        throw error;
      }

      console.log('✅ Appointment saved successfully:', data);

      toast({
        title: appointmentId ? "Rendez-vous modifié" : "Rendez-vous créé",
        description: `Le rendez-vous pour ${formData.animalName} a été ${appointmentId ? 'modifié' : 'créé'} avec succès`,
      });

      onClose();
      
    } catch (error: any) {
      console.error('❌ Error in handleSubmit:', error);
      toast({
        title: "Erreur",
        description: error.message || `Impossible de ${appointmentId ? 'modifier' : 'créer'} le rendez-vous`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    updateField,
    handleConsultationTypeChange,
    handleSubmit,
    calculateEndTime,
    initializeFormData,
    handleTimeChange
  };
};
