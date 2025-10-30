
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
  booking_source: string;
  
  // Client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientPhoneCountryCode: string;
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

const getInitialFormData = (): FormData => ({
  appointmentDate: '',
  appointmentTime: '',
  appointmentEndTime: '',
  veterinarianId: '',
  consultationTypeId: '',
  duration: 30,
  arrival_time: null,
  booking_source: 'phone',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientPhoneCountryCode: '+33',
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

export const useAppointmentForm = (onClose: () => void, appointmentId?: string) => {
  const { toast } = useToast();
  const { currentClinicId } = useClinicAccess();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toujours commencer avec des données vierges
  const [formData, setFormData] = useState<FormData>(getInitialFormData());

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
    
    // Réinitialiser complètement le formulaire
    const cleanData = getInitialFormData();
    
    if (defaultData) {
      // Données de rendez-vous uniquement
      if (defaultData.appointmentDate || defaultData.date) {
        const date = defaultData.appointmentDate || defaultData.date;
        console.log('📅 Setting appointment date:', date);
        cleanData.appointmentDate = date;
      }
      
      if (defaultData.appointmentTime || defaultData.time) {
        const time = defaultData.appointmentTime || defaultData.time;
        console.log('⏰ Setting appointment time:', time);
        cleanData.appointmentTime = time;
      }
      
      if (defaultData.appointmentEndTime) {
        cleanData.appointmentEndTime = defaultData.appointmentEndTime;
      }
      
      if (defaultData.veterinarianId || (defaultData.veterinarian && defaultData.veterinarian !== 'asv')) {
        const vetId = defaultData.veterinarianId || defaultData.veterinarian;
        console.log('👨‍⚕️ Setting veterinarian:', vetId);
        cleanData.veterinarianId = vetId;
      }
      
      if (defaultData.consultationTypeId) {
        cleanData.consultationTypeId = defaultData.consultationTypeId;
      }
      
      if (defaultData.duration) {
        cleanData.duration = defaultData.duration;
      }
      
      if (defaultData.arrival_time) {
        cleanData.arrival_time = defaultData.arrival_time;
      }

      // Source de réservation
      if (defaultData.booking_source) {
        cleanData.booking_source = defaultData.booking_source;
      } else if (defaultData.status === 'pending' || defaultData.status === 'confirmed') {
        cleanData.booking_source = 'online';
      }
      
      // Données client - seulement si elles existent dans defaultData
      if (defaultData.clientName || defaultData.client_name) {
        const name = defaultData.clientName || defaultData.client_name;
        console.log('👤 Setting client name:', name);
        cleanData.clientName = name;
      }
      
      if (defaultData.clientEmail || defaultData.client_email) {
        const email = defaultData.clientEmail || defaultData.client_email;
        console.log('📧 Setting client email:', email);
        cleanData.clientEmail = email;
      }
      
      if (defaultData.clientPhone || defaultData.client_phone) {
        const fullPhone = defaultData.clientPhone || defaultData.client_phone;
        console.log('📞 Parsing client phone:', fullPhone);
        
        // Parser le numéro complet pour séparer le code pays du numéro
        const phoneMatch = fullPhone.match(/^(\+\d{2,3})(.+)$/);
        if (phoneMatch) {
          const [, countryCode, phoneNumber] = phoneMatch;
          console.log('📞 Extracted country code:', countryCode, 'number:', phoneNumber);
          cleanData.clientPhoneCountryCode = countryCode;
          cleanData.clientPhone = phoneNumber;
        } else {
          // Si le format n'est pas reconnu, utiliser tel quel
          cleanData.clientPhone = fullPhone;
        }
      }
      
      if (defaultData.clientPhoneCountryCode || defaultData.client_phone_country_code) {
        const countryCode = defaultData.clientPhoneCountryCode || defaultData.client_phone_country_code;
        console.log('🌍 Setting client phone country code:', countryCode);
        cleanData.clientPhoneCountryCode = countryCode;
      }
      
      if (defaultData.clientStatus || defaultData.client_status) {
        const status = defaultData.clientStatus || defaultData.client_status;
        console.log('👥 Setting client status:', status);
        cleanData.clientStatus = status;
      }
      
      // Données animal - seulement si elles existent dans defaultData
      if (defaultData.animalName || defaultData.animal_name) {
        const name = defaultData.animalName || defaultData.animal_name;
        console.log('🐕 Setting animal name:', name);
        cleanData.animalName = name;
      }
      
      if (defaultData.animalSpecies || defaultData.animal_species) {
        const species = defaultData.animalSpecies || defaultData.animal_species;
        console.log('🐾 Setting animal species:', species);
        cleanData.animalSpecies = species;
      }
      
      if (defaultData.animalBreed || defaultData.animal_breed) {
        const breed = defaultData.animalBreed || defaultData.animal_breed;
        console.log('🏷️ Setting animal breed:', breed);
        cleanData.animalBreed = breed;
      }
      
      if (defaultData.animalAge || defaultData.animal_age) {
        const age = defaultData.animalAge || defaultData.animal_age;
        console.log('📅 Setting animal age:', age);
        cleanData.animalAge = age;
      }
      
      if (defaultData.animalWeight || defaultData.animal_weight) {
        const weight = defaultData.animalWeight || defaultData.animal_weight;
        console.log('⚖️ Setting animal weight:', weight);
        cleanData.animalWeight = weight;
      }
      
      if (defaultData.animalSex || defaultData.animal_sex) {
        const sex = defaultData.animalSex || defaultData.animal_sex;
        console.log('♂️♀️ Setting animal sex:', sex);
        cleanData.animalSex = sex;
      }
      
      if (defaultData.animalSterilized !== undefined || defaultData.animal_sterilized !== undefined) {
        const sterilized = defaultData.animalSterilized !== undefined ? defaultData.animalSterilized : defaultData.animal_sterilized;
        console.log('✂️ Setting animal sterilized:', sterilized);
        cleanData.animalSterilized = sterilized;
      }
      
      if (defaultData.animalVaccinesUpToDate !== undefined || defaultData.animal_vaccines_up_to_date !== undefined) {
        const vaccines = defaultData.animalVaccinesUpToDate !== undefined ? defaultData.animalVaccinesUpToDate : defaultData.animal_vaccines_up_to_date;
        console.log('💉 Setting animal vaccines up to date:', vaccines);
        cleanData.animalVaccinesUpToDate = vaccines;
      }
      
      // Consultation - Utiliser le résumé de l'IA si disponible (RDV en ligne), sinon utiliser consultation_reason
      if (defaultData.ai_analysis?.analysis_summary) {
        // Pour les RDV en ligne, utiliser le résumé généré par l'IA
        const aiSummary = defaultData.ai_analysis.analysis_summary;
        console.log('🤖 Setting AI analysis summary as consultation reason:', aiSummary);
        cleanData.consultationReason = aiSummary;
      } else if (defaultData.consultationReason || defaultData.consultation_reason) {
        // Pour les RDV créés manuellement, utiliser la raison saisie
        const reason = defaultData.consultationReason || defaultData.consultation_reason;
        console.log('🩺 Setting consultation reason:', reason);
        cleanData.consultationReason = reason;
      }
      
      if (defaultData.clientComment || defaultData.client_comment) {
        const comment = defaultData.clientComment || defaultData.client_comment;
        console.log('💬 Setting client comment:', comment);
        // Éviter de propager le commentaire [DUPLIQUÉ]
        if (!comment.includes('[DUPLIQUÉ]')) {
          cleanData.clientComment = comment;
        }
      }
      
      // Recalculer l'heure de fin si on a time et duration
      const time = cleanData.appointmentTime;
      const duration = cleanData.duration;
      if (time && duration && !cleanData.appointmentEndTime) {
        const endTime = calculateEndTime(time, duration);
        console.log('⏰ Initial end time calculation:', endTime);
        cleanData.appointmentEndTime = endTime;
      }
    }
    
    console.log('✅ Final clean form data:', cleanData);
    setFormData(cleanData);
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
        animal_sterilized: formData.animalSterilized,
        animal_vaccines_up_to_date: formData.animalVaccinesUpToDate,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhoneCountryCode + formData.clientPhone,
        preferred_contact_method: 'phone',
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
        booking_source: formData.booking_source,
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
