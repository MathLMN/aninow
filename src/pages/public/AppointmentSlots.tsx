
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { DateSlotCard } from '@/components/slots/DateSlotCard'
import { VeterinarianPreference } from '@/components/slots/VeterinarianPreference'
import { useAvailableSlots } from '@/hooks/useAvailableSlots'
import { useBookingFormData } from '@/hooks/useBookingFormData'
import { useMultiTenantBookingNavigation } from '@/hooks/useMultiTenantBookingNavigation'
import { Progress } from '@/components/ui/progress'
import { useClinicContext } from '@/contexts/ClinicContext'
import { useClinicVeterinarians } from '@/hooks/useClinicVeterinarians'

const AppointmentSlots = () => {
  const { bookingData, updateBookingData } = useBookingFormData()
  const { navigateNext, getPreviousRoute } = useMultiTenantBookingNavigation()
  const location = useLocation()
  
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currentClinic } = useClinicContext()
  const { veterinarians } = useClinicVeterinarians()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedVeterinarianId, setSelectedVeterinarianId] = useState<string | null>(null)
  const [selectedVeterinarianName, setSelectedVeterinarianName] = useState<string | null>(null)
  const [noVeterinarianPreference, setNoVeterinarianPreference] = useState<boolean>(false)

  const clinicSlug = currentClinic?.slug || ''

  // Vérifier s'il y a 2 animaux
  const hasTwoAnimals = bookingData.multipleAnimals?.includes('2-animaux') || false
  console.log('🐕🐕 Has two animals:', hasTwoAnimals)

  const { slotsData, isLoading, error } = useAvailableSlots({
    clinicSlug: clinicSlug || '',
    selectedVeterinarianId: noVeterinarianPreference ? undefined : selectedVeterinarianId,
    noVeterinarianPreference,
    hasTwoAnimals // Passer le paramètre
  })

  useEffect(() => {
    const vetId = searchParams.get('veterinarianId')
    const vetName = searchParams.get('veterinarianName')
    const noVetPref = searchParams.get('noVeterinarianPreference') === 'true'

    setSelectedVeterinarianId(vetId)
    setSelectedVeterinarianName(vetName)
    setNoVeterinarianPreference(noVetPref)

    // Si l'URL contient un ID de vétérinaire, le sélectionner par défaut
    if (vetId && vetName) {
      console.log(`👨‍⚕️ Vétérinaire sélectionné par défaut: ${vetName} (ID: ${vetId})`)
    } else if (noVetPref) {
      console.log('✔️ Aucune préférence de vétérinaire sélectionnée')
    }
  }, [searchParams])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset selected time when date changes
  }

  const handleSlotSelect = (date: string, time: string, veterinarianId: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setSelectedVeterinarianId(veterinarianId)
    
    // Trouver le nom du vétérinaire correspondant à l'ID
    const veterinarian = veterinarians?.find(vet => vet.id === veterinarianId)
    setSelectedVeterinarianName(veterinarian ? veterinarian.name : null)
  }

  const handleSubmit = () => {
    if (selectedDate && selectedTime && selectedVeterinarianId) {
      console.log('📅 Date sélectionnée:', selectedDate)
      console.log('⏰ Heure sélectionnée:', selectedTime)
      console.log('👨‍⚕️ Vétérinaire sélectionné (ID):', selectedVeterinarianId)
      
      // Trouver le nom du vétérinaire correspondant à l'ID
      const veterinarian = veterinarians?.find(vet => vet.id === selectedVeterinarianId)
      console.log('👨‍⚕️ Vétérinaire sélectionné (nom):', veterinarian?.name)

      // Formater la date au format ISO
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0]

      // Préparer les données à sauvegarder
      const dataToSave = {
        appointmentDate: formattedDate,
        appointmentTime: selectedTime,
        veterinarianId: selectedVeterinarianId,
        veterinarianName: veterinarian?.name
      }

      // Mettre à jour les données de réservation
      updateBookingData(dataToSave)

      // Naviguer à l'étape suivante
      navigateNext(location.pathname)
    } else {
      alert('Veuillez sélectionner une date et une heure de rendez-vous.')
    }
  }

  const handleVeterinarianSelect = (veterinarianId: string | null) => {
    if (veterinarianId === null) {
      setNoVeterinarianPreference(true)
      setSelectedVeterinarianId(null)
      setSelectedVeterinarianName(null)
      navigate(`${location.pathname}?noVeterinarianPreference=true`)
    } else {
      setNoVeterinarianPreference(false)
      setSelectedVeterinarianId(veterinarianId)
      
      // Trouver le nom du vétérinaire correspondant à l'ID
      const veterinarian = veterinarians?.find(vet => vet.id === veterinarianId)
      setSelectedVeterinarianName(veterinarian ? veterinarian.name : null)

      // Mettre à jour l'URL
      if (veterinarian?.name) {
        navigate(`${location.pathname}?veterinarianId=${veterinarianId}&veterinarianName=${veterinarian.name}`)
      } else {
        navigate(location.pathname)
      }
    }
  }

  const handlePrevious = () => {
    const previousRoute = getPreviousRoute(location.pathname)
    navigate(previousRoute)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige/20 via-white to-vet-sage/10 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Barre de progression avec la bonne épaisseur */}
        <Progress value={66} className="w-full h-2" />
        
        {/* En-tête */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-vet-navy">
            Choisissez votre créneau de rendez-vous
          </h1>
          {hasTwoAnimals && (
            <div className="bg-vet-blue/10 p-3 rounded-lg border border-vet-blue/20">
              <p className="text-sm text-vet-navy">
                ℹ️ Rendez-vous pour 2 animaux : les créneaux affichés correspondent à 1h de consultation
              </p>
            </div>
          )}
          <p className="text-vet-brown text-base sm:text-lg">
            Sélectionnez la date et l'heure qui vous conviennent
          </p>
        </div>

        {/* Sélection du vétérinaire avec le composant original */}
        <VeterinarianPreference
          veterinarians={veterinarians || []}
          selectedVeterinarian={selectedVeterinarianId}
          onVeterinarianSelect={handleVeterinarianSelect}
        />

        {/* Liste des créneaux disponibles par date */}
        <div className="space-y-4 sm:space-y-5">
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-vet-brown">Chargement des créneaux disponibles...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Erreur lors du chargement des créneaux: {error.message}</p>
            </div>
          )}
          
          {slotsData && Array.from(slotsData.entries()).length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-vet-brown">Aucun créneau disponible pour les critères sélectionnés.</p>
            </div>
          )}

          {slotsData && Array.from(slotsData.entries()).sort().map(([date, slots]) => (
            <DateSlotCard
              key={date}
              date={date}
              slots={slots}
              veterinarians={veterinarians || []}
              selectedSlot={{date: selectedDate || '', time: selectedTime || '', veterinarianId: selectedVeterinarianId || ''}}
              onSlotSelect={handleSlotSelect}
              noVeterinarianPreference={noVeterinarianPreference}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white"
          >
            Précédent
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedDate || !selectedTime}
            className="bg-vet-sage text-white hover:bg-vet-sage/90 disabled:opacity-50"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentSlots
