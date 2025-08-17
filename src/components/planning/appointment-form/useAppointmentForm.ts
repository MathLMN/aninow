import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useConsultationTypes } from '@/hooks/useConsultationTypes';

export const useAppointmentForm = (defaultData?: any, onSuccess?: () => void) => {
  const { toast } = useToast();
  const { consultationTypes } = useConsultationTypes();
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientComment: '',
    animalName: '',
    animalSpecies: '',
    consultationReason: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentEndTime: '',
    duration: 30,
    veterinarianId: '',
    consultationTypeId: '',
    booking_source: 'phone',
    arrival_time: '',
    ...defaultData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldUpdate = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsultationTypeChange = (consultationTypeId: string) => {
    setFormData(prev => ({ ...prev, consultationTypeId }));
    
    // Auto-update duration based on consultation type
    const consultationType = consultationTypes.find(ct => ct.id === consultationTypeId);
    if (consultationType) {
      const newDuration = consultationType.duration_minutes;
      setFormData(prev => ({
        ...prev,
        duration: newDuration,
        appointmentEndTime: calculateEndTime(prev.appointmentTime, newDuration)
      }));
    }
  };

  const handleTimeChange = (time: string) => {
    const endTime = calculateEndTime(time, formData.duration);
    setFormData(prev => ({
      ...prev,
      appointmentTime: time,
      appointmentEndTime: endTime
    }));
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        client_comment: formData.clientComment || null,
        animal_name: formData.animalName,
        animal_species: formData.animalSpecies,
        consultation_reason: formData.consultationReason,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        appointment_end_time: formData.appointmentEndTime,
        duration_minutes: formData.duration,
        veterinarian_id: formData.veterinarianId || null,
        consultation_type_id: formData.consultationTypeId || null,
        booking_source: formData.booking_source,
        arrival_time: formData.arrival_time || null,
        status: 'confirmed',
        preferred_contact_method: 'phone'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été créé avec succès",
      });

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientComment: '',
        animalName: '',
        animalSpecies: '',
        consultationReason: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentEndTime: '',
        duration: 30,
        veterinarianId: '',
        consultationTypeId: '',
        booking_source: 'phone',
        arrival_time: ''
      });

    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleFieldUpdate,
    handleConsultationTypeChange,
    handleTimeChange,
    calculateEndTime,
    handleSubmit
  };
};
