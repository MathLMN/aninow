
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
    
    // Informations client
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
      if (!currentClinic) {
        throw new Error('Aucune clinique sélectionnée');
      }

      const appointmentEndTime = calculateEndTime(formData.appointment_time, formData.duration_minutes);
      
      const bookingData = {
        clinic_id: currentClinic.id,
        animal_name: formData.animal_name,
        animal_species: formData.animal_species,
        animal_breed: formData.animal_breed,
        animal_age: formData.animal_age,
        animal_weight: formData.animal_weight ? parseFloat(formData.animal_weight) : null,
        animal_sex: formData.animal_sex,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        preferred_contact_method: formData.preferred_contact_method,
        consultation_reason: formData.consultation_reason,
        client_comment: formData.client_comment,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        appointment_end_time: appointmentEndTime,
        veterinarian_id: formData.veterinarian_id,
        consultation_type_id: formData.consultation_type_id,
        duration_minutes: formData.duration_minutes,
        status: 'confirmed',
        selected_symptoms: [],
        convenience_options: [],
        multiple_animals: []
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

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
      console.error('Erreur lors de la création du RDV:', err);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous",
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
