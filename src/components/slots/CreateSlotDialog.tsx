
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useConsultationTypes } from "@/hooks/useConsultationTypes"

interface VeterinarianForSlot {
  id: string;
  name: string;
  specialty?: string;
  is_active: boolean;
}

interface ConsultationType {
  id: string;
  name: string;
  duration_minutes: number;
  color?: string;
}

interface CreateSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (slotData: {
    veterinarian_id: string
    consultation_type_id: string
    date: string
    start_time: string
    end_time: string
  }) => Promise<void>;
  veterinarians: VeterinarianForSlot[];
  consultationTypes: ConsultationType[];
  isCreating: boolean;
}

export const CreateSlotDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  veterinarians, 
  consultationTypes, 
  isCreating 
}: CreateSlotDialogProps) => {
  const [formData, setFormData] = useState({
    veterinarian_id: '',
    consultation_type_id: '',
    date: '',
    start_time: '',
    end_time: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Select value={formData.veterinarian_id} onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarian_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un vétérinaire" />
              </SelectTrigger>
              <SelectContent>
                {veterinarians.map((vet) => (
                  <SelectItem key={vet.id} value={vet.id}>
                    {vet.name} {vet.specialty && `- ${vet.specialty}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultation_type">Type de consultation</Label>
            <Select value={formData.consultation_type_id} onValueChange={handleConsultationTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {consultationTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      {type.color && (
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                      )}
                      {type.name} ({type.duration_minutes} min)
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isCreating} className="bg-vet-sage hover:bg-vet-sage/90 text-white">
              {isCreating ? 'Création...' : 'Créer le créneau'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
