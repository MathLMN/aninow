import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateSlotCard } from '@/components/slots/DateSlotCard'
import { useAvailableSlots } from '@/hooks/useAvailableSlots'
import { useBookingFormData } from '@/hooks/useBookingFormData'
import { useMultiTenantBookingNavigation } from '@/hooks/useMultiTenantBookingNavigation'
import { ProgressBar } from '@/components/ui/progress'
import { useClinicContext } from '@/contexts/ClinicContext'

const AppointmentSlots = () => {
  const { bookingData, updateBookingData } = useBookingFormData()
  const { navigateNext, navigatePrevious } = useMultiTenantBookingNavigation()
  const location = useLocation()
  
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currentClinic } = useClinicContext()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedVeterinarianId, setSelectedVeterinarianId] = useState<string | null>(null)
  const [selectedVeterinarianName, setSelectedVeterinarianName] = useState<string | null>(null)
  const [noVeterinarianPreference, setNoVeterinarianPreference] = useState<boolean>(false)
  const [slotsForSelectedDate, setSlotsForSelectedDate] = useState<any[] | null>(null)

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

  useEffect(() => {
    if (slotsData && selectedDate) {
      setSlotsForSelectedDate(slotsData.get(selectedDate) || [])
    } else {
      setSlotsForSelectedDate(null)
    }
  }, [slotsData, selectedDate])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset selected time when date changes
  }

  const handleSlotSelect = (date: string, time: string, veterinarianId: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setSelectedVeterinarianId(veterinarianId)
    
    // Trouver le nom du vétérinaire correspondant à l'ID
    const veterinarian = currentClinic?.veterinarians?.find(vet => vet.id === veterinarianId)
    setSelectedVeterinarianName(veterinarian ? veterinarian.name : null)
  }

  const handleSubmit = () => {
    if (selectedDate && selectedTime && selectedVeterinarianId) {
      console.log('📅 Date sélectionnée:', selectedDate)
      console.log('⏰ Heure sélectionnée:', selectedTime)
      console.log('👨‍⚕️ Vétérinaire sélectionné (ID):', selectedVeterinarianId)
      
      // Trouver le nom du vétérinaire correspondant à l'ID
      const veterinarian = currentClinic?.veterinarians?.find(vet => vet.id === selectedVeterinarianId)
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

  const handleVeterinarianChange = (veterinarianId: string) => {
    setSelectedVeterinarianId(veterinarianId)
    
    // Trouver le nom du vétérinaire correspondant à l'ID
    const veterinarian = currentClinic?.veterinarians?.find(vet => vet.id === veterinarianId)
    setSelectedVeterinarianName(veterinarian ? veterinarian.name : null)

    // Mettre à jour l'URL
    if (veterinarianId && veterinarian?.name) {
      navigate(`${location.pathname}?veterinarianId=${veterinarianId}&veterinarianName=${veterinarian?.name}`)
    } else {
      navigate(location.pathname)
    }
  }

  const handleNoVeterinarianPreference = () => {
    setNoVeterinarianPreference(true)
    setSelectedVeterinarianId(null)
    setSelectedVeterinarianName(null)

    // Mettre à jour l'URL
    navigate(`${location.pathname}?noVeterinarianPreference=true`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige/20 via-white to-vet-sage/10 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <ProgressBar currentStep={4} totalSteps={6} />
        
        {/* En-tête avec information sur la durée pour 2 animaux */}
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
            {selectedVeterinarianName 
              ? `Créneaux disponibles avec ${selectedVeterinarianName}` 
              : 'Créneaux disponibles'}
          </p>
        </div>

        {/* Sélection du vétérinaire */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-vet-navy">
              Choisissez votre vétérinaire
            </h2>
            <Button variant="link" onClick={handleNoVeterinarianPreference}>
              Peu importe le vétérinaire
            </Button>
          </div>
          
          {/* Liste des vétérinaires disponibles */}
          {!noVeterinarianPreference && currentClinic?.veterinarians && (
            <Select value={selectedVeterinarianId || ''} onValueChange={handleVeterinarianChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un vétérinaire" />
              </SelectTrigger>
              <SelectContent>
                {currentClinic.veterinarians.map(veterinarian => (
                  <SelectItem key={veterinarian.id} value={veterinarian.id}>
                    {veterinarian.name} {veterinarian.specialty ? `(${veterinarian.specialty})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Liste des créneaux disponibles par date */}
        <div className="space-y-4 sm:space-y-5">
          {isLoading && <p className="text-center text-vet-brown">Chargement des créneaux...</p>}
          {error && <p className="text-center text-red-500">Erreur: {error.message}</p>}
          {slotsData && Array.from(slotsData.entries()).sort().map(([date, slots]) => (
            <DateSlotCard
              key={date}
              date={date}
              slots={slots}
              veterinarians={currentClinic?.veterinarians || []}
              selectedSlot={{date: selectedDate || '', time: selectedTime || '', veterinarianId: selectedVeterinarianId || ''}}
              onSlotSelect={handleSlotSelect}
              noVeterinarianPreference={noVeterinarianPreference}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 sm:pt-5">
          <Button variant="secondary" onClick={() => navigatePrevious(location.pathname)}>
            Précédent
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedDate || !selectedTime}>
            Continuer
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentSlots
