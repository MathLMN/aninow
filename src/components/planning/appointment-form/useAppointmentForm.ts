import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useClinicContext } from "@/contexts/ClinicContext";

export const useAppointmentForm = (onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentClinic } = useClinicContext();

  const [formData, setFormData] = useState({
    // Informations RDV
    appointment_date: '',
    appointment_time: '',
    veterinarian_id: '',
    consultation_type_id: '',
    duration_minutes: 15,
    arrival_time: '',
    
    // Informations client
    client_status: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    preferred_contact_method: 'phone',
    
    // Informations animal
    animal_name: '',
    animal_species: '',
    animal_breed: '',
    animal_age: '',
    animal_weight: '',
    animal_sex: '',
    
    // Consultation
    consultation_reason: '',
    client_comment: '',
    
    // Source du RDV
    booking_source: 'phone'
  });

  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime || !duration) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startInMinutes = hours * 60 + minutes;
    const endInMinutes = startInMinutes + duration;
    
    const endHours = Math.floor(endInMinutes / 60);
    const endMins = endInMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsultationTypeChange = (consultationTypeId: string, consultationTypes: any[]) => {
    const selectedType = consultationTypes.find(type => type.id === consultationTypeId);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        consultation_type_id: consultationTypeId,
        duration_minutes: selectedType.duration_minutes
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔄 Starting appointment creation...');
      console.log('Current clinic:', currentClinic);
      console.log('Form data:', formData);
      
      // Validation des champs obligatoires
      if (!formData.appointment_date) {
        throw new Error('La date du rendez-vous est obligatoire');
      }
      
      if (!formData.appointment_time) {
        throw new Error('L\'heure du rendez-vous est obligatoire');
      }
      
      if (!formData.client_name) {
        throw new Error('Le nom du client est obligatoire');
      }
      
      if (!formData.animal_name) {
        throw new Error('Le nom de l\'animal est obligatoire');
      }
      
      if (!formData.animal_species) {
        throw new Error('L\'espèce de l\'animal est obligatoire');
      }

      // Vérification plus robuste de la clinique
      let clinicId = currentClinic?.id;
      
      if (!clinicId) {
        console.warn('⚠️ No clinic from context, trying to get default clinic...');
        // Essayer de récupérer une clinique par défaut
        const { data: clinics, error: clinicError } = await supabase
          .from('clinics')
          .select('id')
          .limit(1);
          
        if (clinicError) {
          console.error('Error fetching clinics:', clinicError);
          throw new Error('Erreur lors de la récupération des cliniques');
        }
        
        if (!clinics || clinics.length === 0) {
          throw new Error('Aucune clinique disponible dans le système');
        }
        
        clinicId = clinics[0].id;
        console.log('✅ Using default clinic:', clinicId);
      }

      const appointmentEndTime = calculateEndTime(formData.appointment_time, formData.duration_minutes);
      
      const bookingData = {
        clinic_id: clinicId,
        // Informations animal (obligatoires)
        animal_name: formData.animal_name || 'Non spécifié',
        animal_species: formData.animal_species || 'Non spécifié',
        animal_breed: formData.animal_breed || null,
        animal_age: formData.animal_age || null,
        animal_weight: formData.animal_weight ? parseFloat(formData.animal_weight) : null,
        animal_sex: formData.animal_sex || null,
        // Informations client (obligatoires)
        client_name: formData.client_name,
        client_email: formData.client_email || 'non-renseigne@example.com',
        client_phone: formData.client_phone || '0000000000',
        preferred_contact_method: formData.preferred_contact_method,
        client_status: formData.client_status || null,
        // Consultation (obligatoire)
        consultation_reason: formData.consultation_reason || 'Consultation générale',
        client_comment: formData.client_comment || null,
        // Informations RDV
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        appointment_end_time: appointmentEndTime,
        veterinarian_id: formData.veterinarian_id || null,
        consultation_type_id: formData.consultation_type_id || null,
        duration_minutes: formData.duration_minutes,
        arrival_time: formData.arrival_time || null,
        status: 'confirmed',
        // Champs par défaut pour éviter les erreurs
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
        animal_sterilized: null,
        animal_vaccines_up_to_date: null,
        ai_analysis: null,
        urgency_score: null,
        recommended_actions: [],
        is_blocked: false
      };

      console.log('📤 Submitting booking data (no select on insert):', bookingData);

      // IMPORTANT: on retire .select() pour éviter un échec RLS en lecture après insert
      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) {
        // Logs plus détaillés pour débogage RLS/schéma
        const anyErr = error as unknown as { code?: string; details?: string; hint?: string; message: string };
        console.error('❌ Database error on insert:', anyErr);
        console.error('Error code:', anyErr.code);
        console.error('Error details:', anyErr.details);
        console.error('Error hint:', anyErr.hint);
        throw new Error(`Erreur base de données: ${error.message}`);
      }

      console.log('✅ Booking inserted successfully (no select).');

      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été ajouté au planning avec succès",
      });

      onClose();
      // Réinitialiser le formulaire
      setFormData({
        appointment_date: '',
        appointment_time: '',
        veterinarian_id: '',
        consultation_type_id: '',
        duration_minutes: 15,
        arrival_time: '',
        client_status: '',
        client_name: '',
        client_phone: '',
        client_email: '',
        preferred_contact_method: 'phone',
        animal_name: '',
        animal_species: '',
        animal_breed: '',
        animal_age: '',
        animal_weight: '',
        animal_sex: '',
        consultation_reason: '',
        client_comment: '',
        booking_source: 'phone'
      });

    } catch (err) {
      console.error('❌ Erreur lors de la création du RDV:', err);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Impossible de créer le rendez-vous",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initializeFormData = (defaultData: any) => {
    if (defaultData) {
      setFormData(prev => ({
        ...prev,
        appointment_date: defaultData.date || '',
        appointment_time: defaultData.time || '',
        veterinarian_id: defaultData.veterinarian || ''
      }));
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
