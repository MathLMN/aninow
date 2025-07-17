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
        if (isLitter && bookingData.vaccinationType) {
          return '/booking/animal-info'
        }
        return '/booking/consultation-reason'

      case '/booking/consultation-reason':
        if (hasSymptoms) {
          return '/booking/conditional-questions'
        }
        return '/booking/animal-info'

      case '/booking/conditional-questions':
        return '/booking/additional-points'

      case '/booking/additional-points':
        return '/booking/symptom-duration'

      case '/booking/symptom-duration':
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

      case '/booking/additional-points':
        return '/booking/conditional-questions'

      case '/booking/symptom-duration':
        return '/booking/additional-points'

      case '/booking/animal-info':
        if (isLitter) {
          return '/booking'
        }
        if (hasSymptoms) {
          return '/booking/symptom-duration'
        }
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

  // Fonction simplifiée qui ne redirige JAMAIS automatiquement
  const checkDataConsistency = (currentRoute: string) => {
    console.log('checkDataConsistency called with:', currentRoute)
    console.log('Current booking data:', bookingData)
    
    // Retourner seulement les informations de validation sans redirection
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
    checkDataConsistency, // Remplace shouldRedirect
    navigateNext,
    navigateBack
  }
}
