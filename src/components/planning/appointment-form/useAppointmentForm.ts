
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

export const useAppointmentForm = (onClose: () => void) => {
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsultationTypeChange = (consultationTypeId: string, consultationTypes: any[]) => {
    const selectedType = consultationTypes.find(type => type.id === consultationTypeId);
    if (selectedType) {
      const duration = selectedType.duration_minutes;
      updateField('consultationTypeId', consultationTypeId);
      updateField('duration', duration);
      
      // Recalculer l'heure de fin
      if (formData.appointmentTime) {
        const endTime = calculateEndTime(formData.appointmentTime, duration);
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
    
    if (defaultData.date && defaultData.time) {
      updateField('appointmentDate', defaultData.date);
      updateField('appointmentTime', defaultData.time);
      
      // Si on a un vétérinaire pré-sélectionné
      if (defaultData.veterinarian && defaultData.veterinarian !== 'asv') {
        updateField('veterinarianId', defaultData.veterinarian);
      }
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
      console.log('📝 Creating appointment with clinic ID:', currentClinicId);
      console.log('📋 Form data:', formData);
      
      const appointmentData = {
        clinic_id: currentClinicId, // Utiliser l'ID de la clinique courante
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
        arrival_time: null,
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

      const { data, error } = await supabase
        .from('bookings')
        .insert([appointmentData])
        .select();

      if (error) {
        console.error('❌ Error creating appointment:', error);
        throw error;
      }

      console.log('✅ Appointment created successfully:', data);

      toast({
        title: "Rendez-vous créé",
        description: `Le rendez-vous pour ${formData.animalName} a été créé avec succès`,
      });

      onClose();
      
    } catch (error: any) {
      console.error('❌ Error in handleSubmit:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le rendez-vous",
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
    initializeFormData
  };
};
