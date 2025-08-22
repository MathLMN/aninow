
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClinicContext } from '@/contexts/ClinicContext'
import type { Database } from '@/integrations/supabase/types'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']

interface BookingSubmissionResult {
  booking: any | null
  aiAnalysis: any | null
  error: string | null
}

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { currentClinic } = useClinicContext()

  const submitBooking = async (bookingData: any): Promise<BookingSubmissionResult> => {
    setIsSubmitting(true)
    
    try {
      console.log('Submitting booking data:', bookingData)
      console.log('Current clinic:', currentClinic)

      if (!currentClinic) {
        throw new Error('Aucune clinique sélectionnée')
      }
      
      // S'assurer que le veterinarianId est correctement récupéré
      const selectedVeterinarianId = bookingData.veterinarianId || bookingData.veterinarian_id
      console.log('Selected veterinarian ID from booking data:', selectedVeterinarianId)
      
      // Préparer les données avec le bon mapping des colonnes et l'ID de la clinique
      const bookingInsert: BookingInsert = {
        clinic_id: currentClinic.id,
        animal_species: bookingData.animalSpecies || bookingData.animal_species,
        animal_name: bookingData.animalName || bookingData.animal_name || '',
        custom_species: bookingData.customSpecies || bookingData.custom_species,
        multiple_animals: bookingData.multipleAnimals || [],
        second_animal_species: bookingData.secondAnimalSpecies,
        second_animal_name: bookingData.secondAnimalName,
        second_custom_species: bookingData.secondCustomSpecies,
        vaccination_type: bookingData.vaccinationType,
        consultation_reason: bookingData.consultationReason || bookingData.consultation_reason,
        convenience_options: bookingData.convenienceOptions || [],
        custom_text: bookingData.customText,
        selected_symptoms: bookingData.selectedSymptoms || [],
        custom_symptom: bookingData.customSymptom,
        second_animal_different_reason: bookingData.secondAnimalDifferentReason || false,
        second_animal_consultation_reason: bookingData.secondAnimalConsultationReason,
        second_animal_convenience_options: bookingData.secondAnimalConvenienceOptions || [],
        second_animal_custom_text: bookingData.secondAnimalCustomText,
        second_animal_selected_symptoms: bookingData.secondAnimalSelectedSymptoms || [],
        second_animal_custom_symptom: bookingData.secondAnimalCustomSymptom,
        conditional_answers: bookingData.conditionalAnswers,
        symptom_duration: bookingData.symptomDuration,
        additional_points: bookingData.additionalPoints || [],
        animal_age: bookingData.animalAge || bookingData.firstAnimalAge,
        animal_breed: bookingData.animalBreed || bookingData.firstAnimalBreed,
        animal_weight: bookingData.animalWeight ? parseFloat(bookingData.animalWeight) : null,
        animal_sex: bookingData.animalSex,
        animal_sterilized: bookingData.animalSterilized,
        animal_vaccines_up_to_date: bookingData.animalVaccinesUpToDate,
        second_animal_age: bookingData.secondAnimalAge,
        second_animal_breed: bookingData.secondAnimalBreed,
        second_animal_weight: bookingData.secondAnimalWeight ? parseFloat(bookingData.secondAnimalWeight) : null,
        second_animal_sex: bookingData.secondAnimalSex,
        second_animal_sterilized: bookingData.secondAnimalSterilized,
        second_animal_vaccines_up_to_date: bookingData.secondAnimalVaccinesUpToDate,
        client_comment: bookingData.clientComment,
        client_name: bookingData.clientName || `${bookingData.firstName} ${bookingData.lastName}`,
        client_email: bookingData.clientEmail || bookingData.email,
        client_phone: `${bookingData.phonePrefix || '+33'}${bookingData.phoneNumber || bookingData.client_phone}`,
        preferred_contact_method: bookingData.preferredContactMethod || 'phone',
        appointment_date: bookingData.appointmentDate || bookingData.appointment_date,
        appointment_time: bookingData.appointmentTime || bookingData.appointment_time,
        // CORRECTION : Assigner correctement le vétérinaire sélectionné
        veterinarian_id: selectedVeterinarianId || null,
        duration_minutes: 20, // Durée par défaut
        status: 'pending',
        booking_source: 'online' // Marquer explicitement comme réservation en ligne
      }

      console.log('Final booking insert data:', bookingInsert)
      console.log('Veterinarian ID being saved:', bookingInsert.veterinarian_id)

      // Insérer la réservation dans la base de données
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingInsert)
        .select()
        .single()

      if (bookingError) {
        throw new Error(`Erreur lors de la création de la réservation: ${bookingError.message}`)
      }

      console.log('Booking created successfully:', booking)
      console.log('Saved veterinarian ID:', booking.veterinarian_id)

      // Appeler l'Edge Function pour l'analyse IA (optionnel)
      let aiAnalysis = null
      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-booking', {
          body: { booking_data: booking }
        })

        if (!analysisError && analysisData) {
          aiAnalysis = analysisData
          
          // Mettre à jour la réservation avec les résultats de l'analyse IA
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              ai_analysis: analysisData,
              urgency_score: analysisData.urgency_score,
              recommended_actions: analysisData.recommended_actions
            })
            .eq('id', booking.id)

          if (updateError) {
            console.error('Erreur lors de la mise à jour avec l\'analyse IA:', updateError)
          }
        }
      } catch (aiError) {
        console.error('Erreur lors de l\'analyse IA (non bloquante):', aiError)
      }

      toast({
        title: "Réservation créée avec succès",
        description: "Votre demande de rendez-vous a été enregistrée.",
      })

      return {
        booking,
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
