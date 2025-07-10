
import { useState, useEffect } from 'react'

export interface CompleteBookingData {
  // Données de base
  animalSpecies: string
  animalName: string
  customSpecies?: string
  multipleAnimals: string[]
  secondAnimalSpecies?: string
  secondAnimalName?: string
  secondCustomSpecies?: string
  vaccinationType?: string
  
  // Motifs de consultation
  consultationReason: string
  convenienceOptions: string[]
  customText?: string
  selectedSymptoms: string[]
  customSymptom?: string
  secondAnimalDifferentReason?: boolean
  secondAnimalConsultationReason?: string
  secondAnimalConvenienceOptions: string[]
  secondAnimalCustomText?: string
  secondAnimalSelectedSymptoms: string[]
  secondAnimalCustomSymptom?: string
  
  // Questions conditionnelles
  conditionalAnswers?: Record<string, any>
  symptomDuration?: string
  additionalPoints: string[]
  
  // Informations animaux
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
  
  // Commentaire et contact
  clientComment?: string
  clientName: string
  clientEmail: string
  clientPhone: string
  preferredContactMethod: string
  
  // Rendez-vous
  appointmentDate?: string
  appointmentTime?: string
}

export const useBookingFormData = () => {
  const [bookingData, setBookingData] = useState<Partial<CompleteBookingData>>({})

  // Charger les données depuis le localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('bookingFormData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setBookingData(parsedData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }
  }, [])

  // Sauvegarder les données dans le localStorage
  const updateBookingData = (newData: Partial<CompleteBookingData>) => {
    const updatedData = { ...bookingData, ...newData }
    setBookingData(updatedData)
    localStorage.setItem('bookingFormData', JSON.stringify(updatedData))
  }

  // Réinitialiser les données
  const resetBookingData = () => {
    setBookingData({})
    localStorage.removeItem('bookingFormData')
  }

  // Vérifier si les données sont complètes pour la soumission
  const isDataComplete = () => {
    return !!(
      bookingData.animalSpecies &&
      bookingData.animalName &&
      bookingData.consultationReason &&
      bookingData.clientName &&
      bookingData.clientEmail &&
      bookingData.clientPhone &&
      bookingData.preferredContactMethod
    )
  }

  return {
    bookingData,
    updateBookingData,
    resetBookingData,
    isDataComplete
  }
}
