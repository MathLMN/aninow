
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
  
  // Points supplémentaires de consultation
  hasAdditionalConsultationPoints?: string
  customAdditionalPoint?: string
  
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
  
  // Nouveaux champs pour les coordonnées détaillées
  clientStatus?: string
  firstName?: string
  lastName?: string
  phonePrefix?: string
  dataConsent?: boolean
  
  // Rendez-vous
  appointmentDate?: string
  appointmentTime?: string
  veterinarianId?: string
  veterinarianName?: string
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

  // Vérifier si les données de base sont présentes
  const hasBasicData = () => {
    // Vérifier si c'est une portée
    const isLitter = bookingData.multipleAnimals?.includes('une-portee')
    
    // Pour une portée, seule l'espèce et le type de vaccination sont obligatoires
    if (isLitter) {
      return !!(bookingData.animalSpecies && bookingData.vaccinationType)
    }
    
    // Pour un animal normal, espèce ET nom sont obligatoires
    return !!(bookingData.animalSpecies && bookingData.animalName)
  }

  // Vérifier si le motif de consultation est complété
  const hasConsultationReason = () => {
    return !!(bookingData.consultationReason)
  }

  // Vérifier si les informations animaux sont complètes
  const hasAnimalInfo = () => {
    const isLitter = bookingData.multipleAnimals?.includes('une-portee')
    
    // Pour une portée, seule la race est requise (pas l'âge)
    if (isLitter) {
      return !!(bookingData.animalBreed)
    }
    
    // Pour un animal normal, toutes les infos sont requises
    return !!(bookingData.animalAge && bookingData.animalBreed && bookingData.animalWeight && bookingData.animalSex)
  }

  // Vérifier si les coordonnées sont complètes
  const hasContactInfo = () => {
    console.log('Vérification des coordonnées:', {
      clientStatus: bookingData.clientStatus,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      dataConsent: bookingData.dataConsent
    })
    
    return !!(
      bookingData.clientStatus &&
      bookingData.firstName?.trim() &&
      bookingData.lastName?.trim() &&
      bookingData.clientEmail?.trim() &&
      bookingData.clientPhone?.trim() &&
      bookingData.dataConsent === true
    )
  }

  // Vérifier si les données sont complètes pour la soumission
  const isDataComplete = () => {
    return hasBasicData() && hasConsultationReason() && hasAnimalInfo() && hasContactInfo()
  }

  return {
    bookingData,
    updateBookingData,
    resetBookingData,
    isDataComplete,
    hasBasicData,
    hasConsultationReason,
    hasAnimalInfo,
    hasContactInfo
  }
}
