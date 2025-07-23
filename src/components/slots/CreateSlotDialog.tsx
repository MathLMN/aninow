
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Database } from '@/integrations/supabase/types'

type VeterinarianRow = Database['public']['Tables']['clinic_veterinarians']['Row']
type ConsultationTypeRow = Database['public']['Tables']['consultation_types']['Row']

interface CreateSlotDialogProps {
  veterinarians: VeterinarianRow[]
  consultationTypes: ConsultationTypeRow[]
  onCreateSlot: (slotData: {
    veterinarian_id: string
    consultation_type_id: string
    date: string
    start_time: string
    end_time: string
  }) => Promise<boolean>
}

export const CreateSlotDialog = ({ veterinarians, consultationTypes, onCreateSlot }: CreateSlotDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    veterinarian_id: '',
    consultation_type_id: '',
    date: '',
    start_time: '',
    end_time: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await onCreateSlot(formData)
    
    if (success) {
      setFormData({
        veterinarian_id: '',
        consultation_type_id: '',
        date: '',
        start_time: '',
        end_time: ''
      })
      setOpen(false)
    }
    
    setIsLoading(false)
  }

  const handleConsultationTypeChange = (consultationTypeId: string) => {
    setFormData(prev => ({ ...prev, consultation_type_id: consultationTypeId }))
    
    // Auto-calculer l'heure de fin basée sur la durée
    const consultationType = consultationTypes.find(ct => ct.id === consultationTypeId)
    if (consultationType && formData.start_time) {
      const startTime = new Date(`2000-01-01T${formData.start_time}:00`)
      const endTime = new Date(startTime.getTime() + consultationType.duration_minutes * 60000)
      const endTimeString = endTime.toTimeString().slice(0, 5)
      setFormData(prev => ({ ...prev, end_time: endTimeString }))
    }
  }

  const handleStartTimeChange = (startTime: string) => {
    setFormData(prev => ({ ...prev, start_time: startTime }))
    
    // Auto-calculer l'heure de fin basée sur la durée
    const consultationType = consultationTypes.find(ct => ct.id === formData.consultation_type_id)
    if (consultationType && startTime) {
      const startDateTime = new Date(`2000-01-01T${startTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + consultationType.duration_minutes * 60000)
      const endTimeString = endDateTime.toTimeString().slice(0, 5)
      setFormData(prev => ({ ...prev, end_time: endTimeString }))
    }
  }

  // Enhanced filtering to ensure no empty values reach SelectItem
  const validVeterinarians = veterinarians.filter(vet => {
    const hasValidId = vet.id && typeof vet.id === 'string' && vet.id.trim() !== ''
    const hasValidName = vet.name && typeof vet.name === 'string' && vet.name.trim() !== ''
    console.log('Veterinarian validation:', { id: vet.id, name: vet.name, hasValidId, hasValidName })
    return hasValidId && hasValidName
  })
  
  // Enhanced filtering to ensure no empty values reach SelectItem
  const validConsultationTypes = consultationTypes.filter(type => {
    const hasValidId = type.id && typeof type.id === 'string' && type.id.trim() !== ''
    const hasValidName = type.name && typeof type.name === 'string' && type.name.trim() !== ''
    console.log('ConsultationType validation:', { id: type.id, name: type.name, hasValidId, hasValidName })
    return hasValidId && hasValidName
  })

  console.log('Valid veterinarians:', validVeterinarians.length)
  console.log('Valid consultation types:', validConsultationTypes.length)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau créneau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">Créer un nouveau créneau</DialogTitle>
          <DialogDescription className="text-vet-brown">
            Définissez un nouveau créneau disponible pour les consultations
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="veterinarian">Vétérinaire</Label>
            {validVeterinarians.length > 0 ? (
              <Select value={formData.veterinarian_id} onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarian_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un vétérinaire" />
                </SelectTrigger>
                <SelectContent>
                  {validVeterinarians.map((vet) => {
                    // Double-check the ID is valid before rendering
                    const vetId = vet.id?.toString() || ''
                    if (!vetId || vetId.trim() === '') {
                      console.warn('Skipping veterinarian with invalid ID:', vet)
                      return null
                    }
                    return (
                      <SelectItem key={vetId} value={vetId}>
                        {vet.name} {vet.specialty ? `- ${vet.specialty}` : ''}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-vet-brown p-2 bg-vet-beige/20 rounded">
                Aucun vétérinaire disponible
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultation_type">Type de consultation</Label>
            {validConsultationTypes.length > 0 ? (
              <Select value={formData.consultation_type_id} onValueChange={handleConsultationTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {validConsultationTypes.map((type) => {
                    // Double-check the ID is valid before rendering
                    const typeId = type.id?.toString() || ''
                    if (!typeId || typeId.trim() === '') {
                      console.warn('Skipping consultation type with invalid ID:', type)
                      return null
                    }
                    return (
                      <SelectItem key={typeId} value={typeId}>
                        {type.name} {type.duration_minutes ? `(${type.duration_minutes} min)` : ''}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-vet-brown p-2 bg-vet-beige/20 rounded">
                Aucun type de consultation disponible
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Heure de début</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Heure de fin</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-vet-sage hover:bg-vet-sage/90 text-white">
              {isLoading ? 'Création...' : 'Créer le créneau'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
