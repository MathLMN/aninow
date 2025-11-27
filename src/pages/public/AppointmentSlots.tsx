
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VeterinarianPreference } from '@/components/slots/VeterinarianPreference'
import { usePublicBookingSlots } from '@/hooks/usePublicBookingSlots'
import { useBookingFormData } from '@/hooks/useBookingFormData'
import { useMultiTenantBookingNavigation } from '@/hooks/useMultiTenantBookingNavigation'
import { Progress } from '@/components/ui/progress'
import { useClinicContext } from '@/contexts/ClinicContext'
import { Calendar, Clock, Sun, Moon, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const AppointmentSlots = () => {
  const { bookingData, updateBookingData } = useBookingFormData()
  const { navigateNext, getPreviousRoute } = useMultiTenantBookingNavigation()
  const location = useLocation()
  const { toast } = useToast()
  
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { currentClinic } = useClinicContext()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedVeterinarianId, setSelectedVeterinarianId] = useState<string | null>(null)
  const [selectedVeterinarianName, setSelectedVeterinarianName] = useState<string | null>(null)
  const [noVeterinarianPreference, setNoVeterinarianPreference] = useState<boolean>(false)
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

  const clinicSlug = currentClinic?.slug || ''

  const { availableSlots, veterinarians, isLoading } = usePublicBookingSlots()
  
  // useRef pour éviter les stale closures
  const selectedVetIdRef = useRef(selectedVeterinarianId)
  useEffect(() => {
    selectedVetIdRef.current = selectedVeterinarianId
  }, [selectedVeterinarianId])
  
  // Filtrer les créneaux strictement selon le vétérinaire sélectionné
  const filteredSlots = useMemo(() => {
    console.log("🔍 Filtrage des créneaux:", {
      noVeterinarianPreference,
      selectedVeterinarianId,
      selectedVeterinarianName,
      totalSlots: availableSlots.length
    })

    // Si "Pas de préférence" ou aucun vétérinaire sélectionné, montrer tous les créneaux
    if (noVeterinarianPreference || !selectedVeterinarianId) {
      console.log("✅ Affichage de tous les créneaux (pas de préférence)")
      return availableSlots
    }

    // Sinon, filtrer strictement pour le vétérinaire choisi
    const filtered = availableSlots.map(daySlot => ({
      ...daySlot,
      slots: daySlot.slots.filter(slot => 
        slot.availableVeterinarians?.includes(selectedVeterinarianId)
      )
    })).filter(daySlot => daySlot.slots.length > 0)

    console.log(`✅ Créneaux filtrés pour ${selectedVeterinarianName}:`, {
      joursDisponibles: filtered.length,
      totalCreneaux: filtered.reduce((sum, day) => sum + day.slots.length, 0)
    })

    return filtered
  }, [availableSlots, selectedVeterinarianId, selectedVeterinarianName, noVeterinarianPreference])

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

  const handleSlotSelect = (date: string, time: string, veterinarianId: string | string[], availableVets?: string[]) => {
    console.log("🔍 handleSlotSelect appelé:", { 
      date, 
      time, 
      veterinarianId,
      availableVets,
      currentSelectedVetId: selectedVeterinarianId,
      currentSelectedVetName: selectedVeterinarianName,
      noVeterinarianPreference 
    })

    setSelectedDate(date)
    setSelectedTime(time)

    // Si l'utilisateur a choisi un vétérinaire spécifique, NE JAMAIS CHANGER SON CHOIX
    if (selectedVeterinarianId && !noVeterinarianPreference) {
      const vetsArray = availableVets || []
      
      // VALIDATION : vérifier que le vétérinaire choisi est disponible sur ce créneau
      if (!vetsArray.includes(selectedVeterinarianId)) {
        console.error(`❌ ERREUR: Le vétérinaire sélectionné ${selectedVeterinarianName} (${selectedVeterinarianId}) n'est PAS disponible sur ce créneau!`)
        console.error(`Vétérinaires disponibles sur ce créneau:`, vetsArray)
        toast({
          title: "Ce vétérinaire n'est pas disponible sur ce créneau",
          description: `${selectedVeterinarianName} n'est pas disponible à cette heure. Veuillez sélectionner un autre créneau.`,
          variant: "destructive"
        })
        return
      }

      // ✅ Le vétérinaire choisi est disponible - garder le choix de l'utilisateur
      console.log(`✅ VALIDATION OK: Le vétérinaire choisi ${selectedVeterinarianName} est bien disponible sur ce créneau`)
      console.log(`✅ Créneau sélectionné pour ${selectedVeterinarianName} sans modification du choix utilisateur`)
      return // Sortir ici sans changer le vétérinaire sélectionné
    }

    // Si "Pas de préférence" : attribution automatique aléatoire
    if (noVeterinarianPreference && availableVets && availableVets.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableVets.length)
      const assignedVetId = availableVets[randomIndex]
      const assignedVet = veterinarians?.find((v: any) => v.id === assignedVetId)
      
      setSelectedVeterinarianId(assignedVetId)
      setSelectedVeterinarianName(assignedVet?.name || '')
      
      console.log(`🎲 Attribution automatique (pas de préférence): ${assignedVet?.name}`)
    }
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
        veterinarianName: veterinarian?.name,
        veterinarianPreferenceSelected: !noVeterinarianPreference
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

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates)
    if (newExpanded.has(date)) {
      newExpanded.delete(date)
    } else {
      newExpanded.add(date)
    }
    setExpandedDates(newExpanded)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const renderSlots = (slots: any[], type: 'morning' | 'afternoon') => {
    const filteredSlots = slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0])
      return type === 'morning' ? hour < 12 : hour >= 12
    })

    if (filteredSlots.length === 0) return null

    return (
      <div className="mb-4 last:mb-0">
        <div className="flex items-center mb-3">
          {type === 'morning' ? (
            <Sun className="h-4 w-4 mr-2 text-vet-brown" />
          ) : (
            <Moon className="h-4 w-4 mr-2 text-vet-brown" />
          )}
          <h4 className="text-sm font-medium text-vet-brown">
            {type === 'morning' ? 'Matin' : 'Après-midi'}
          </h4>
          <span className="ml-2 text-xs text-vet-brown/70">
            ({filteredSlots.length} créneau{filteredSlots.length > 1 ? 'x' : ''})
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {filteredSlots.map((slot) => {
            const isSelected = selectedDate === slot.date && 
                             selectedTime === slot.time
            
            return (
              <Button
                key={`${slot.date}-${slot.time}-${slot.veterinarian_id}`}
                variant="outline"
                className={cn(
                  "h-auto p-3 flex items-center justify-center text-center transition-all duration-200 border-2",
                  isSelected
                    ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage shadow-md" 
                    : "bg-vet-blue/10 border-vet-blue/30 text-vet-navy hover:bg-vet-sage/20 hover:border-vet-sage/50"
                )}
                onClick={() => handleSlotSelect(
                  slot.date, 
                  slot.time, 
                  slot.veterinarian_id, 
                  slot.availableVeterinarians
                )}
              >
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-2" />
                  <span className="font-semibold text-sm">{slot.time}</span>
                </div>
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige/20 via-white to-vet-sage/10 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            className="mr-4 text-vet-navy hover:text-vet-sage hover:bg-vet-sage/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>
        </div>

        {/* En-tête principal */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-vet-navy">
            Choisissez votre créneau
          </h1>
          <p className="text-vet-brown text-base sm:text-lg">
            Sélectionnez votre préférence de vétérinaire et le créneau qui vous convient
          </p>
          {currentClinic && (
            <p className="text-vet-brown/70 text-sm">
              {currentClinic.name}
            </p>
          )}
        </div>

        {/* Sélection du vétérinaire */}
        <VeterinarianPreference
          veterinarians={veterinarians || []}
          selectedVeterinarian={selectedVeterinarianId}
          onVeterinarianSelect={handleVeterinarianSelect}
        />

        {/* Liste des créneaux disponibles par date */}
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-vet-brown">Chargement des créneaux disponibles...</p>
            </div>
          )}
          
          {!isLoading && filteredSlots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-vet-brown">Aucun créneau disponible pour les critères sélectionnés.</p>
            </div>
          )}

          {filteredSlots.map((daySlot) => {
            const isExpanded = expandedDates.has(daySlot.date)
            const dayAvailableSlots = daySlot.slots
            
            return (
              <Card key={daySlot.date} className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-sm">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 sm:p-6 h-auto text-left hover:bg-vet-beige/30"
                    onClick={() => toggleDateExpansion(daySlot.date)}
                  >
                    <div className="flex flex-col items-start">
                      <h3 className="text-base sm:text-lg font-semibold text-vet-navy">
                        {formatDate(daySlot.date)}
                      </h3>
                      <p className="text-xs sm:text-sm text-vet-brown mt-1">
                        {dayAvailableSlots.length} créneau{dayAvailableSlots.length > 1 ? 'x' : ''} disponible{dayAvailableSlots.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-vet-blue flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-vet-blue flex-shrink-0" />
                    )}
                  </Button>

                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      {renderSlots(dayAvailableSlots, 'morning')}
                      {renderSlots(dayAvailableSlots, 'afternoon')}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* Bouton "Voir plus de dates" si nécessaire */}
          {filteredSlots.length > 0 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                className="bg-vet-blue/10 border-vet-blue/30 text-vet-blue hover:bg-vet-blue hover:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                VOIR PLUS DE DATES
              </Button>
            </div>
          )}
        </div>

        {/* Bouton de soumission flottant */}
        {selectedDate && selectedTime && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Button 
              onClick={handleSubmit}
              className="bg-vet-sage text-white hover:bg-vet-sage/90 px-8 py-3 text-lg font-semibold shadow-xl"
            >
              Sélectionnez un créneau →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentSlots
