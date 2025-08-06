
import { useNavigate } from 'react-router-dom'
import { useBookingFormData } from './useBookingFormData'
import { useClinicContext } from '@/contexts/ClinicContext'

export const useMultiTenantBookingNavigation = () => {
  const navigate = useNavigate()
  const { bookingData, hasBasicData, hasConsultationReason, hasAnimalInfo, hasContactInfo } = useBookingFormData()
  const { currentClinic } = useClinicContext()

  const getClinicPrefix = () => {
    return currentClinic?.slug ? `/${currentClinic.slug}` : ''
  }

  const getNextRoute = (currentRoute: string) => {
    console.log('getNextRoute called with:', currentRoute)
    
    const clinicPrefix = getClinicPrefix()
    const isLitter = bookingData.multipleAnimals?.includes('une-portee')
    const hasSymptoms = bookingData.consultationReason === 'symptomes-anomalie' || 
                      bookingData.secondAnimalConsultationReason === 'symptomes-anomalie'

    // Remove clinic prefix from current route for comparison
    const baseRoute = currentRoute.replace(clinicPrefix, '') || '/booking'

    switch (baseRoute) {
      case '/booking':
        // Si c'est une portée avec type de vaccination, aller directement aux infos animal
        if (isLitter && bookingData.vaccinationType) {
          return `${clinicPrefix}/booking/animal-info`
        }
        return `${clinicPrefix}/booking/consultation-reason`

      case '/booking/consultation-reason':
        // Si symptômes détectés, aller aux questions conditionnelles
        if (hasSymptoms) {
          return `${clinicPrefix}/booking/conditional-questions`
        }
        return `${clinicPrefix}/booking/animal-info`

      case '/booking/conditional-questions':
        return `${clinicPrefix}/booking/symptom-duration`

      case '/booking/symptom-duration':
        return `${clinicPrefix}/booking/additional-points`

      case '/booking/additional-points':
        return `${clinicPrefix}/booking/animal-info`

      case '/booking/animal-info':
        return `${clinicPrefix}/booking/client-comment`

      case '/booking/client-comment':
        return `${clinicPrefix}/booking/contact-info`

      case '/booking/contact-info':
        return `${clinicPrefix}/booking/appointment-slots`

      case '/booking/appointment-slots':
        return `${clinicPrefix}/booking/confirmation`

      default:
        return `${clinicPrefix}/booking`
    }
  }

  const getPreviousRoute = (currentRoute: string) => {
    console.log('getPreviousRoute called with:', currentRoute)
    
    const clinicPrefix = getClinicPrefix()
    const isLitter = bookingData.multipleAnimals?.includes('une-portee')
    const hasSymptoms = bookingData.consultationReason === 'symptomes-anomalie' || 
                      bookingData.secondAnimalConsultationReason === 'symptomes-anomalie'

    // Remove clinic prefix from current route for comparison
    const baseRoute = currentRoute.replace(clinicPrefix, '') || '/booking'

    switch (baseRoute) {
      case '/booking/consultation-reason':
        return `${clinicPrefix}/booking`

      case '/booking/conditional-questions':
        return `${clinicPrefix}/booking/consultation-reason`

      case '/booking/symptom-duration':
        return `${clinicPrefix}/booking/conditional-questions`

      case '/booking/additional-points':
        return `${clinicPrefix}/booking/symptom-duration`

      case '/booking/animal-info':
        // Si c'est une portée, retourner au début
        if (isLitter) {
          return `${clinicPrefix}/booking`
        }
        // Si on a des symptômes, on vient des points supplémentaires
        if (hasSymptoms) {
          return `${clinicPrefix}/booking/additional-points`
        }
        // Sinon, on vient directement du motif de consultation
        return `${clinicPrefix}/booking/consultation-reason`

      case '/booking/client-comment':
        return `${clinicPrefix}/booking/animal-info`

      case '/booking/contact-info':
        return `${clinicPrefix}/booking/client-comment`

      case '/booking/appointment-slots':
        return `${clinicPrefix}/booking/contact-info`

      case '/booking/confirmation':
        return `${clinicPrefix}/booking/appointment-slots`

      default:
        return `${clinicPrefix}/booking`
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
    navigateBack,
    getClinicPrefix
  }
}
