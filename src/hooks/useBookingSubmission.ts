
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClinicContext } from '@/contexts/ClinicContext'
import { useClinicSettings } from '@/hooks/useClinicSettings'
import type { Database } from '@/integrations/supabase/types'
import { filterAllConditionalAnswers } from '@/utils/conditionalAnswersFilter'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']

interface BookingSubmissionResult {
  booking: any | null
  secondBooking?: any | null
  aiAnalysis: any | null
  error: string | null
}

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { currentClinic } = useClinicContext()
  const { settings } = useClinicSettings()

  // Fonction pour uploader les photos vers Supabase Storage
  const uploadPhotosToStorage = async (
    conditionalAnswers: any,
    clinicId: string,
    bookingId: string
  ): Promise<any> => {
    if (!conditionalAnswers) return conditionalAnswers;

    console.log('📤 uploadPhotosToStorage called with:', { 
      clinicId, 
      bookingId,
      keys: Object.keys(conditionalAnswers).filter(k => k.includes('photo'))
    });

    const updatedAnswers = { ...conditionalAnswers };
    
    for (const [key, value] of Object.entries(conditionalAnswers)) {
      // Détecter les clés de photos (wound_photo_X, lump_photo_X, other_symptom_photo_X)
      if (key.includes('photo')) {
        console.log(`📤 Processing photo key: ${key}`, {
          valueType: typeof value,
          isFile: value instanceof File,
          hasBase64: value && typeof value === 'object' && 'base64' in value,
          value: value instanceof File ? 'File object' : value
        });
        // Gérer les objets File (ancien format, rétrocompatibilité)
        if (value instanceof File) {
          const file = value as File;
          const extension = file.name.split('.').pop();
          const filePath = `${clinicId}/${bookingId}/${key}.${extension}`;
          
          console.log(`Uploading photo ${key} (File) to:`, filePath);
          
          const { error: uploadError } = await supabase.storage
            .from('consultation-photos')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error(`Error uploading photo ${key}:`, uploadError);
            throw new Error(`Erreur lors de l'upload de la photo: ${uploadError.message}`);
          }

          updatedAnswers[key] = filePath;
        }
        // Gérer les objets base64 (nouveau format)
        else if (value && typeof value === 'object' && 'base64' in value) {
          try {
            const photoData = value as { base64: string; filename: string; type: string };
            
            // Convertir base64 en Blob
            const response = await fetch(photoData.base64);
            const blob = await response.blob();
            
            // Extraire l'extension du filename
            const extension = photoData.filename.split('.').pop() || 'jpg';
            const filePath = `${clinicId}/${bookingId}/${key}.${extension}`;
            
            console.log(`Uploading photo ${key} (base64) to:`, filePath);
            
            // Upload vers Storage
            const { error: uploadError } = await supabase.storage
              .from('consultation-photos')
              .upload(filePath, blob, {
                cacheControl: '3600',
                upsert: false,
                contentType: photoData.type
              });
            
            if (uploadError) {
              console.error(`Error uploading photo ${key}:`, uploadError);
              throw new Error(`Erreur lors de l'upload de la photo: ${uploadError.message}`);
            }
            
            // Remplacer par le chemin
            updatedAnswers[key] = filePath;
          } catch (error) {
            console.error(`Error converting base64 for ${key}:`, error);
            throw new Error(`Erreur lors de la conversion de la photo: ${error}`);
          }
        }
      }
    }

    return updatedAnswers;
  };

  const submitBooking = async (bookingData: any): Promise<BookingSubmissionResult> => {
    setIsSubmitting(true)
    
    try {
      console.log('Submitting booking data:', bookingData)
      console.log('Current clinic:', currentClinic)
      console.log('Clinic settings for duration:', settings)

      if (!currentClinic) {
        throw new Error('Aucune clinique sélectionnée')
      }
      
      // S'assurer que le veterinarianId est correctement récupéré
      const selectedVeterinarianId = bookingData.veterinarianId || bookingData.veterinarian_id
      console.log('Selected veterinarian ID from booking data:', selectedVeterinarianId)
      
      // Vérifier s'il y a 2 animaux
      const hasTwoAnimals = bookingData.multipleAnimals?.includes('2-animaux')
      
      // Utiliser la durée par défaut des créneaux définie dans les paramètres de la clinique
      // Si 2 animaux : durée double (1h par défaut)
      const baseDurationMinutes = settings?.default_slot_duration_minutes || 30
      const totalDurationMinutes = hasTwoAnimals ? baseDurationMinutes * 2 : baseDurationMinutes
      console.log('Using duration:', totalDurationMinutes, 'minutes', hasTwoAnimals ? '(2 animals)' : '(1 animal)')

      // Mapper le motif de consultation correctement
      const mapConsultationReason = (reason: string) => {
        switch (reason) {
          case 'symptomes-anomalie':
            return 'Symptômes ou anomalie'
          case 'consultation-convenance':
            return 'Consultation de convenance'
          default:
            return reason
        }
      }

      // Mapper le statut client
      const mapClientStatus = (status: string) => {
        switch (status) {
          case 'existing-client':
            return 'Déjà client'
          case 'new-client':
            return 'Nouveau client'
          default:
            return status
        }
      }

      // Calculer l'heure de fin pour le premier rendez-vous
      const calculateEndTime = (startTime: string, durationMinutes: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number)
        const startDate = new Date()
        startDate.setHours(hours, minutes, 0, 0)
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000)
        return endDate.toTimeString().slice(0, 5)
      }

      // Filtrer les conditional_answers
      const filteredConditionalAnswers = filterAllConditionalAnswers(
        bookingData.conditionalAnswers,
        bookingData
      );
      
      // Générer un ID temporaire pour l'upload des photos
      const tempBookingId = crypto.randomUUID();
      
      // Uploader les photos et remplacer les Files par les chemins
      const conditionalAnswersWithPhotoPaths = await uploadPhotosToStorage(
        filteredConditionalAnswers,
        currentClinic.id,
        tempBookingId
      );

      // Préparer les données pour le premier animal
      const firstBookingInsert: BookingInsert = {
        clinic_id: currentClinic.id,
        animal_species: bookingData.animalSpecies || bookingData.animal_species,
        animal_name: bookingData.animalName || bookingData.animal_name || '',
        custom_species: bookingData.customSpecies || bookingData.custom_species,
        multiple_animals: bookingData.multipleAnimals || [],
        second_animal_species: null, // Premier RDV : pas de deuxième animal
        second_animal_name: null,
        second_custom_species: null,
        vaccination_type: bookingData.vaccinationType,
        consultation_reason: mapConsultationReason(bookingData.consultationReason || bookingData.consultation_reason),
        convenience_options: bookingData.convenienceOptions || [],
        custom_text: bookingData.customText,
        selected_symptoms: bookingData.selectedSymptoms || [],
        custom_symptom: bookingData.customSymptom,
        second_animal_different_reason: false,
        second_animal_consultation_reason: null,
        second_animal_convenience_options: [],
        second_animal_custom_text: null,
        second_animal_selected_symptoms: [],
        second_animal_custom_symptom: null,
        conditional_answers: conditionalAnswersWithPhotoPaths,
        symptom_duration: bookingData.symptomDuration,
        additional_points: bookingData.additionalPoints || [],
        animal_age: bookingData.animalAge || bookingData.firstAnimalAge,
        animal_breed: bookingData.animalBreed || bookingData.firstAnimalBreed,
        animal_weight: bookingData.animalWeight ? parseFloat(bookingData.animalWeight) : null,
        animal_sex: bookingData.animalSex,
        animal_sterilized: bookingData.animalSterilized,
        animal_vaccines_up_to_date: bookingData.animalVaccinesUpToDate,
        second_animal_age: null,
        second_animal_breed: null,
        second_animal_weight: null,
        second_animal_sex: null,
        second_animal_sterilized: null,
        second_animal_vaccines_up_to_date: null,
        client_comment: bookingData.clientComment,
        client_name: bookingData.clientName || `${bookingData.firstName} ${bookingData.lastName}`,
        client_email: bookingData.clientEmail || bookingData.email,
        client_phone: bookingData.clientPhone || bookingData.client_phone || (bookingData.phoneNumber ? `${bookingData.phonePrefix || '+33'}${bookingData.phoneNumber}` : ''),
        preferred_contact_method: bookingData.preferredContactMethod || 'phone',
        client_status: mapClientStatus(bookingData.clientStatus || ''),
        appointment_date: bookingData.appointmentDate || bookingData.appointment_date,
        appointment_time: bookingData.appointmentTime || bookingData.appointment_time,
        appointment_end_time: hasTwoAnimals 
          ? calculateEndTime(bookingData.appointmentTime, baseDurationMinutes)
          : calculateEndTime(bookingData.appointmentTime, baseDurationMinutes),
        veterinarian_id: selectedVeterinarianId || null,
        veterinarian_preference_selected: bookingData.veterinarianPreferenceSelected || false,
        duration_minutes: hasTwoAnimals ? baseDurationMinutes : baseDurationMinutes, // Chaque RDV garde la durée normale
        status: 'pending',
        booking_source: 'online'
      }

      console.log('First booking insert data:', firstBookingInsert)

      // Insérer le premier rendez-vous
      const { data: firstBooking, error: firstBookingError } = await supabase
        .from('bookings')
        .insert(firstBookingInsert)
        .select()
        .single()

      if (firstBookingError) {
        throw new Error(`Erreur lors de la création du premier rendez-vous: ${firstBookingError.message}`)
      }

      console.log('First booking created successfully:', firstBooking)

      let secondBooking = null

      // Si 2 animaux, créer le deuxième rendez-vous
      if (hasTwoAnimals && bookingData.secondAnimalSpecies) {
        const secondStartTime = calculateEndTime(bookingData.appointmentTime, baseDurationMinutes)
        
        const secondBookingInsert: BookingInsert = {
          clinic_id: currentClinic.id,
          animal_species: bookingData.secondAnimalSpecies,
          animal_name: bookingData.secondAnimalName || '',
          custom_species: bookingData.secondCustomSpecies,
          multiple_animals: [], // Deuxième RDV : pas de mention "2 animaux"
          second_animal_species: null,
          second_animal_name: null,
          second_custom_species: null,
          vaccination_type: null,
          consultation_reason: mapConsultationReason(
            bookingData.secondAnimalDifferentReason 
              ? bookingData.secondAnimalConsultationReason 
              : bookingData.consultationReason
          ),
          convenience_options: bookingData.secondAnimalDifferentReason 
            ? (bookingData.secondAnimalConvenienceOptions || [])
            : (bookingData.convenienceOptions || []),
          custom_text: bookingData.secondAnimalDifferentReason 
            ? bookingData.secondAnimalCustomText 
            : bookingData.customText,
          selected_symptoms: bookingData.secondAnimalDifferentReason 
            ? (bookingData.secondAnimalSelectedSymptoms || [])
            : (bookingData.selectedSymptoms || []),
          custom_symptom: bookingData.secondAnimalDifferentReason 
            ? bookingData.secondAnimalCustomSymptom 
            : bookingData.customSymptom,
          second_animal_different_reason: false,
          second_animal_consultation_reason: null,
          second_animal_convenience_options: [],
          second_animal_custom_text: null,
          second_animal_selected_symptoms: [],
          second_animal_custom_symptom: null,
          conditional_answers: filterAllConditionalAnswers(bookingData.conditionalAnswers, bookingData),
          symptom_duration: bookingData.symptomDuration,
          additional_points: bookingData.additionalPoints || [],
          animal_age: bookingData.secondAnimalAge,
          animal_breed: bookingData.secondAnimalBreed,
          animal_weight: bookingData.secondAnimalWeight ? parseFloat(bookingData.secondAnimalWeight) : null,
          animal_sex: bookingData.secondAnimalSex,
          animal_sterilized: bookingData.secondAnimalSterilized,
          animal_vaccines_up_to_date: bookingData.secondAnimalVaccinesUpToDate,
          second_animal_age: null,
          second_animal_breed: null,
          second_animal_weight: null,
          second_animal_sex: null,
          second_animal_sterilized: null,
          second_animal_vaccines_up_to_date: null,
          client_comment: bookingData.clientComment ? `[ANIMAL 2] ${bookingData.clientComment}` : null,
          client_name: bookingData.clientName || `${bookingData.firstName} ${bookingData.lastName}`,
          client_email: bookingData.clientEmail || bookingData.email,
          client_phone: bookingData.clientPhone || bookingData.client_phone || (bookingData.phoneNumber ? `${bookingData.phonePrefix || '+33'}${bookingData.phoneNumber}` : ''),
          preferred_contact_method: bookingData.preferredContactMethod || 'phone',
          client_status: mapClientStatus(bookingData.clientStatus || ''),
          appointment_date: bookingData.appointmentDate || bookingData.appointment_date,
          appointment_time: secondStartTime,
          appointment_end_time: calculateEndTime(secondStartTime, baseDurationMinutes),
          veterinarian_id: selectedVeterinarianId || null,
          veterinarian_preference_selected: bookingData.veterinarianPreferenceSelected || false,
          duration_minutes: baseDurationMinutes,
          status: 'pending',
          booking_source: 'online'
        }

        console.log('Second booking insert data:', secondBookingInsert)

        const { data: secondBookingResult, error: secondBookingError } = await supabase
          .from('bookings')
          .insert(secondBookingInsert)
          .select()
          .single()

        if (secondBookingError) {
          // Si le deuxième RDV échoue, supprimer le premier
          await supabase.from('bookings').delete().eq('id', firstBooking.id)
          throw new Error(`Erreur lors de la création du deuxième rendez-vous: ${secondBookingError.message}`)
        }

        secondBooking = secondBookingResult
        console.log('Second booking created successfully:', secondBooking)
      }

      // Analyse IA pour le premier booking
      let aiAnalysis = null
      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-booking', {
          body: { booking_data: firstBooking }
        })

        if (!analysisError && analysisData) {
          aiAnalysis = analysisData
          
          await supabase
            .from('bookings')
            .update({
              ai_analysis: analysisData,
              urgency_score: analysisData.urgency_score,
              recommended_actions: analysisData.recommended_actions
            })
            .eq('id', firstBooking.id)
        }
      } catch (aiError) {
        console.error('Erreur lors de l\'analyse IA (non bloquante):', aiError)
      }

      return {
        booking: firstBooking,
        secondBooking,
        aiAnalysis,
        error: null
      }

    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      
      toast({
        title: "Erreur lors de la réservation",
        description: errorMessage,
        variant: "destructive"
      })

      return {
        booking: null,
        aiAnalysis: null,
        error: errorMessage
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitBooking,
    isSubmitting
  }
}
