
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { useToast } from '@/hooks/use-toast'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingRow = Database['public']['Tables']['bookings']['Row']

interface BookingSubmissionResult {
  booking: BookingRow | null
  aiAnalysis: any | null
  error: string | null
}

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const submitBooking = async (bookingData: any): Promise<BookingSubmissionResult> => {
    setIsSubmitting(true)
    
    try {
      // Préparer les données pour l'insertion
      const insertData: BookingInsert = {
        animal_species: bookingData.animalSpecies,
        animal_name: bookingData.animalName || '',
        custom_species: bookingData.customSpecies,
        multiple_animals: bookingData.multipleAnimals || [],
        second_animal_species: bookingData.secondAnimalSpecies,
        second_animal_name: bookingData.secondAnimalName,
        second_custom_species: bookingData.secondCustomSpecies,
        vaccination_type: bookingData.vaccinationType,
        consultation_reason: bookingData.consultationReason,
        convenience_options: bookingData.convenienceOptions || [],
        custom_text: bookingData.customText,
        selected_symptoms: bookingData.selectedSymptoms || [],
        custom_symptom: bookingData.customSymptom,
        second_animal_different_reason: bookingData.secondAnimalDifferentReason,
        second_animal_consultation_reason: bookingData.secondAnimalConsultationReason,
        second_animal_convenience_options: bookingData.secondAnimalConvenienceOptions || [],
        second_animal_custom_text: bookingData.secondAnimalCustomText,
        second_animal_selected_symptoms: bookingData.secondAnimalSelectedSymptoms || [],
        second_animal_custom_symptom: bookingData.secondAnimalCustomSymptom,
        conditional_answers: bookingData.conditionalAnswers,
        symptom_duration: bookingData.symptomDuration,
        additional_points: bookingData.additionalPoints || [],
        animal_age: bookingData.animalAge,
        animal_breed: bookingData.animalBreed,
        animal_weight: bookingData.animalWeight,
        animal_sex: bookingData.animalSex,
        animal_sterilized: bookingData.animalSterilized,
        animal_vaccines_up_to_date: bookingData.animalVaccinesUpToDate,
        second_animal_age: bookingData.secondAnimalAge,
        second_animal_breed: bookingData.secondAnimalBreed,
        second_animal_weight: bookingData.secondAnimalWeight,
        second_animal_sex: bookingData.secondAnimalSex,
        second_animal_sterilized: bookingData.secondAnimalSterilized,
        second_animal_vaccines_up_to_date: bookingData.secondAnimalVaccinesUpToDate,
        client_comment: bookingData.clientComment,
        client_name: bookingData.clientName,
        client_email: bookingData.clientEmail,
        client_phone: bookingData.clientPhone,
        preferred_contact_method: bookingData.preferredContactMethod,
        appointment_date: bookingData.appointmentDate,
        appointment_time: bookingData.appointmentTime,
        status: 'pending'
      }

      // Insérer la réservation
      const { data: booking, error: insertError } = await supabase
        .from('bookings')
        .insert(insertData)
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // Analyser avec l'IA
      let aiAnalysis = null
      try {
        const { data: analysisData, error: analysisError } = await supabase
          .rpc('analyze_booking_with_ai', {
            booking_data: booking
          })

        if (!analysisError && analysisData) {
          aiAnalysis = analysisData

          // Mettre à jour la réservation avec l'analyse IA
          await supabase
            .from('bookings')
            .update({
              ai_analysis: aiAnalysis,
              urgency_score: aiAnalysis.urgency_score,
              recommended_actions: aiAnalysis.recommended_actions
            })
            .eq('id', booking.id)
        }
      } catch (analysisError) {
        console.warn('Erreur lors de l\'analyse IA:', analysisError)
        // L'analyse IA n'est pas critique, on continue
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
