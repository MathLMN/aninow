
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Interface temporaire pour les données de booking jusqu'à ce que nous ayons la vraie table
interface BookingData {
  animalSpecies: string
  animalName?: string
  customSpecies?: string
  multipleAnimals?: string[]
  secondAnimalSpecies?: string
  secondAnimalName?: string
  secondCustomSpecies?: string
  vaccinationType?: string
  consultationReason: string
  convenienceOptions?: string[]
  customText?: string
  selectedSymptoms?: string[]
  customSymptom?: string
  secondAnimalDifferentReason?: boolean
  secondAnimalConsultationReason?: string
  secondAnimalConvenienceOptions?: string[]
  secondAnimalCustomText?: string
  secondAnimalSelectedSymptoms?: string[]
  secondAnimalCustomSymptom?: string
  conditionalAnswers?: Record<string, any>
  symptomDuration?: string
  additionalPoints?: string[]
  animalAge?: string
  animalBreed?: string
  animalWeight?: number
  animalSex?: string
  animalSterilized?: boolean
  animalVaccinesUpToDate?: boolean
  secondAnimalAge?: string
  secondAnimalBreed?: string
  secondAnimalWeight?: number
  secondAnimalSex?: string
  secondAnimalSterilized?: boolean
  secondAnimalVaccinesUpToDate?: boolean
  clientComment?: string
  clientName: string
  clientEmail: string
  clientPhone: string
  preferredContactMethod: string
  appointmentDate?: string
  appointmentTime?: string
}

interface BookingSubmissionResult {
  booking: any | null
  aiAnalysis: any | null
  error: string | null
}

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const submitBooking = async (bookingData: BookingData): Promise<BookingSubmissionResult> => {
    setIsSubmitting(true)
    
    try {
      // Pour l'instant, simuler la soumission car nous n'avons pas encore de table bookings
      console.log('Booking data submitted:', bookingData)
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Réservation créée avec succès",
        description: "Votre demande de rendez-vous a été enregistrée.",
      })

      return {
        booking: { id: 'temp-' + Date.now(), ...bookingData },
        aiAnalysis: null,
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
