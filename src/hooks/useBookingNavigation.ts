
import { useNavigate } from 'react-router-dom'
import { useBookingFormData } from './useBookingFormData'

export const useBookingNavigation = () => {
  const navigate = useNavigate()
  const { bookingData, hasBasicData, hasConsultationReason, hasAnimalInfo, hasContactInfo } = useBookingFormData()

  const getNextRoute = (currentRoute: string) => {
    console.log('getNextRoute called with:', currentRoute)
    
    const isLitter = bookingData.multipleAnimals?.includes('une-portee')
    const hasSymptoms = bookingData.consultationReason === 'symptomes-anomalie' || 
                      bookingData.secondAnimalConsultationReason === 'symptomes-anomalie'

    switch (currentRoute) {
      case '/booking':
        // Si c'est une portée avec type de vaccination, aller directement aux infos animal
        if (isLitter && bookingData.vaccinationType) {
          return '/booking/animal-info'
        }
        return '/booking/consultation-reason'

      case '/booking/consultation-reason':
        // Si symptômes détectés, aller aux questions conditionnelles
        if (hasSymptoms) {
          return '/booking/conditional-questions'
        }
        return '/booking/animal-info'

      case '/booking/conditional-questions':
        return '/booking/symptom-duration'

      case '/booking/symptom-duration':
        return '/booking/additional-points'

      case '/booking/additional-points':
        return '/booking/animal-info'

      case '/booking/animal-info':
        return '/booking/client-comment'

      case '/booking/client-comment':
        return '/booking/contact-info'

      case '/booking/contact-info':
        return '/booking/appointment-slots'

      case '/booking/appointment-slots':
        return '/booking/confirmation'

      default:
        return '/booking'
    }
  }

  const getPreviousRoute = (currentRoute: string) => {
    console.log('getPreviousRoute called with:', currentRoute)
    
    const isLitter = bookingData.multipleAnimals?.includes('une-portee')
    const hasSymptoms = bookingData.consultationReason === 'symptomes-anomalie' || 
                      bookingData.secondAnimalConsultationReason === 'symptomes-anomalie'

    switch (currentRoute) {
      case '/booking/consultation-reason':
        return '/booking'

      case '/booking/conditional-questions':
        return '/booking/consultation-reason'

      case '/booking/symptom-duration':
        return '/booking/conditional-questions'

      case '/booking/additional-points':
        return '/booking/symptom-duration'

      case '/booking/animal-info':
        // Si c'est une portée, retourner au début
        if (isLitter) {
          return '/booking'
        }
        // Si on a des symptômes, on vient des points supplémentaires
        if (hasSymptoms) {
          return '/booking/additional-points'
        }
        // Sinon, on vient directement du motif de consultation
        return '/booking/consultation-reason'

      case '/booking/client-comment':
        return '/booking/animal-info'

      case '/booking/contact-info':
        return '/booking/client-comment'

      case '/booking/appointment-slots':
        return '/booking/contact-info'

      case '/booking/confirmation':
        return '/booking/appointment-slots'

      default:
        return '/booking'
    }
  }

  // Fonction de validation sans redirection automatique
  const checkDataConsistency = (currentRoute: string) => {
    console.log('checkDataConsistency called with:', currentRoute)
    console.log('Current booking data:', bookingData)
    
    // Validation basique sans redirection automatique
    return {
      hasBasicData: hasBasicData(),
      hasConsultationReason: hasConsultationReason(),
      hasAnimalInfo: hasAnimalInfo(),
      hasContactInfo: hasContactInfo(),
      isValid: true // Toujours valide pour éviter les redirections automatiques
    }
  }

  const navigateNext = (currentRoute: string) => {
    const nextRoute = getNextRoute(currentRoute)
    console.log('Navigating from', currentRoute, 'to', nextRoute)
    navigate(nextRoute)
  }

  const navigateBack = (currentRoute: string) => {
    const previousRoute = getPreviousRoute(currentRoute)
    console.log('Navigating back from', currentRoute, 'to', previousRoute)
    navigate(previousRoute)
  }

  return {
    getNextRoute,
    getPreviousRoute,
    checkDataConsistency,
    navigateNext,
    navigateBack
  }
}
