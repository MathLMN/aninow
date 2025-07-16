
import { useNavigate } from 'react-router-dom'
import { useBookingFormData } from './useBookingFormData'

export const useBookingNavigation = () => {
  const navigate = useNavigate()
  const { bookingData, hasBasicData, hasConsultationReason, hasAnimalInfo, hasContactInfo } = useBookingFormData()

  const getNextRoute = (currentRoute: string) => {
    console.log('getNextRoute called with:', currentRoute)
    console.log('Current booking data:', bookingData)
    
    const isLitter = bookingData.multipleAnimals?.includes('une-portee')
    const hasSymptoms = bookingData.consultationReason === 'symptomes-anomalie' || 
                      bookingData.secondAnimalConsultationReason === 'symptomes-anomalie'

    switch (currentRoute) {
      case '/booking':
        // Après la page de base, aller vers motif de consultation
        // SAUF pour une portée qui va directement aux infos animal
        if (isLitter && bookingData.vaccinationType) {
          return '/booking/animal-info'
        }
        return '/booking/consultation-reason'

      case '/booking/consultation-reason':
        // Après motif de consultation, vérifier s'il y a des symptômes
        if (hasSymptoms) {
          return '/booking/conditional-questions'
        }
        return '/booking/animal-info'

      case '/booking/conditional-questions':
        // Après questions conditionnelles, aller vers durée des symptômes
        return '/booking/symptom-duration'

      case '/booking/symptom-duration':
        // Après durée des symptômes, aller vers points supplémentaires
        return '/booking/additional-points'

      case '/booking/additional-points':
        // Après points supplémentaires, aller vers infos animal
        return '/booking/animal-info'

      case '/booking/animal-info':
        // Après infos animal, aller vers commentaire client
        return '/booking/client-comment'

      case '/booking/client-comment':
        // Après commentaire, aller vers coordonnées
        return '/booking/contact-info'

      case '/booking/contact-info':
        // Après coordonnées, aller vers créneaux
        return '/booking/appointment-slots'

      case '/booking/appointment-slots':
        // Après créneaux, aller vers confirmation
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
        // Pour une portée, retour vers /booking
        if (isLitter) {
          return '/booking'
        }
        // Si on a des symptômes et qu'on est passé par les points supplémentaires
        if (hasSymptoms && bookingData.additionalPoints !== undefined) {
          return '/booking/additional-points'
        }
        // Sinon retour vers motif de consultation
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

  const shouldRedirect = (currentRoute: string) => {
    console.log('shouldRedirect called with:', currentRoute)
    console.log('Data validation:', {
      hasBasicData: hasBasicData(),
      hasConsultationReason: hasConsultationReason(),
      hasAnimalInfo: hasAnimalInfo(),
      hasContactInfo: hasContactInfo(),
      bookingData
    })

    // Pour la page /booking, on ne fait jamais de redirection automatique
    // L'utilisateur doit pouvoir remplir le formulaire librement
    if (currentRoute === '/booking') {
      return null
    }

    // Si on n'a pas les données de base, rediriger vers /booking
    if (!hasBasicData()) {
      return '/booking'
    }

    // Si on n'a pas le motif de consultation mais qu'on a les données de base
    if (hasBasicData() && !hasConsultationReason() && 
        currentRoute !== '/booking/consultation-reason') {
      const isLitter = bookingData.multipleAnimals?.includes('une-portee')
      // Pour une portée, on peut aller directement aux infos animal
      if (isLitter && currentRoute === '/booking/animal-info') {
        return null // Pas de redirection
      }
      return '/booking/consultation-reason'
    }

    // Si on a des symptômes mais pas de réponses conditionnelles
    const hasSymptoms = bookingData.consultationReason === 'symptomes-anomalie' || 
                       bookingData.secondAnimalConsultationReason === 'symptomes-anomalie'
    
    if (hasSymptoms && !bookingData.conditionalAnswers && 
        currentRoute !== '/booking' && 
        currentRoute !== '/booking/consultation-reason' && 
        currentRoute !== '/booking/conditional-questions') {
      return '/booking/conditional-questions'
    }

    return null // Pas de redirection nécessaire
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
    shouldRedirect,
    navigateNext,
    navigateBack
  }
}
