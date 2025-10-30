
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
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  
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
        console.log('📱 Setting booking source:', defaultData.booking_source);
        cleanData.booking_source = defaultData.booking_source;
      } else if (defaultData.status === 'pending' || defaultData.status === 'confirmed') {
        // Si c'est un booking en ligne (pending ou confirmed sans source explicite)
        console.log('📱 Detected online booking from status');
        cleanData.booking_source = 'online';
      } else {
        // Par défaut pour les créations manuelles
        cleanData.booking_source = 'phone';
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
        const fullPhone = (defaultData.clientPhone || defaultData.client_phone).toString().trim();
        console.log('📞 Parsing client phone:', fullPhone);
        
        // Parser le numéro complet pour séparer le code pays du numéro
        const phoneMatch = fullPhone.match(/^(\+\d{2,3})(.+)$/);
        if (phoneMatch) {
          const [, countryCode, phoneNumber] = phoneMatch;
          // Nettoyer le numéro en enlevant les espaces
          let cleanNumber = phoneNumber.replace(/\s/g, '');
          
          // Ignorer "undefined" ou les valeurs invalides
          if (cleanNumber === 'undefined' || cleanNumber === 'null' || cleanNumber === '') {
            console.log('⚠️ Invalid phone number detected, skipping');
            cleanNumber = '';
          } else {
            // Pour les numéros français (+33), ajouter le 0 initial si manquant
            if (countryCode === '+33' && cleanNumber && !cleanNumber.startsWith('0')) {
              cleanNumber = '0' + cleanNumber;
              console.log('🇫🇷 Added leading 0 for French number:', cleanNumber);
            }
          }
          
          console.log('📞 Extracted country code:', countryCode, 'number:', cleanNumber);
          cleanData.clientPhoneCountryCode = countryCode;
          cleanData.clientPhone = cleanNumber;
        } else {
          // Si le format n'est pas reconnu (pas de code pays), utiliser le numéro tel quel
          console.log('📞 No country code found, using default +33');
          let cleanNumber = fullPhone.replace(/\s/g, '');
          // Pour les numéros français sans indicatif, ajouter le 0 si manquant
          if (cleanNumber && !cleanNumber.startsWith('0') && !cleanNumber.startsWith('+')) {
            cleanNumber = '0' + cleanNumber;
          }
          cleanData.clientPhone = cleanNumber;
          // Garder le code pays par défaut (+33)
        }
      }
      
      // Permettre l'écrasement du code pays si explicitement fourni
      if (defaultData.clientPhoneCountryCode || defaultData.client_phone_country_code) {
        const countryCode = defaultData.clientPhoneCountryCode || defaultData.client_phone_country_code;
        console.log('🌍 Overriding client phone country code:', countryCode);
        cleanData.clientPhoneCountryCode = countryCode;
      }
      
      if (defaultData.clientStatus || defaultData.client_status) {
        let status = defaultData.clientStatus || defaultData.client_status;
        console.log('👥 Raw client status:', status);
        
        // Mapper les valeurs textuelles vers les valeurs du formulaire
        if (status === 'Déjà client') {
          status = 'existing';
        } else if (status === 'Nouveau client') {
          status = 'new';
        }
        
        console.log('👥 Mapped client status:', status);
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
      
      // Consultation - Utiliser UNIQUEMENT le résumé généré par l'IA
      if (defaultData.ai_analysis?.analysis_summary) {
        // Pour les RDV en ligne, utiliser le résumé généré par l'IA
        const aiSummary = defaultData.ai_analysis.analysis_summary;
        console.log('🤖 Setting AI analysis summary as consultation reason:', aiSummary);
        cleanData.consultationReason = aiSummary;
      } else if (defaultData.consultationReason || defaultData.consultation_reason) {
        // Pour les RDV créés manuellement, utiliser la raison saisie
        const reason = defaultData.consultationReason || defaultData.consultation_reason;
        // Mais ignorer les codes bruts comme "symptomes-anomalie" ou "consultation-convenance"
        if (!reason.includes('-')) {
          console.log('🩺 Setting consultation reason:', reason);
          cleanData.consultationReason = reason;
        } else {
          console.log('⚠️ Skipping code-based consultation reason:', reason);
        }
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
    
    // Validation des champs obligatoires
    const errors: Record<string, boolean> = {};
    
    if (!formData.veterinarianId) {
      errors.veterinarianId = true;
    }
    
    if (!formData.consultationTypeId) {
      errors.consultationTypeId = true;
    }
    
    if (!formData.duration || formData.duration < 5) {
      errors.duration = true;
    }
    
    // Si des erreurs, afficher les bordures rouges et ne pas soumettre
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
        duration: 10000
      });
      return;
    }
    
    // Réinitialiser les erreurs si tout est valide
    setValidationErrors({});
    
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
        animal_breed: formData.animalBreed || null,
        animal_age: formData.animalAge || null,
        animal_weight: formData.animalWeight || null,
        animal_sex: formData.animalSex || null,
        animal_sterilized: formData.animalSterilized || null,
        animal_vaccines_up_to_date: formData.animalVaccinesUpToDate || null,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhoneCountryCode + formData.clientPhone,
        preferred_contact_method: 'phone',
        client_status: formData.clientStatus,
        consultation_reason: formData.consultationReason,
        client_comment: formData.clientComment || null,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        appointment_end_time: formData.appointmentEndTime,
        veterinarian_id: formData.veterinarianId || null,
        consultation_type_id: formData.consultationTypeId || null,
        duration_minutes: formData.duration,
        arrival_time: formData.arrival_time || null,
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
    validationErrors,
    updateField,
    handleConsultationTypeChange,
    handleSubmit,
    calculateEndTime,
    initializeFormData,
    handleTimeChange
  };
};
