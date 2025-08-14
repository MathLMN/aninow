
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";

interface BlockSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultVeterinarian?: string;
  veterinarians: any[];
}

const DURATION_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 heure' },
  { value: '90', label: '1h30' },
  { value: '120', label: '2 heures' },
  { value: '180', label: '3 heures' },
  { value: '240', label: '4 heures' },
  { value: 'custom', label: 'Durée personnalisée' }
];

const TIME_SLOTS = [
  '08:00', '08:15', '08:30', '08:45',
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45',
  '17:00', '17:15', '17:30', '17:45',
  '18:00', '18:15', '18:30', '18:45',
  '19:00'
];

export const BlockSlotModal = ({
  isOpen,
  onClose,
  defaultDate,
  defaultTime,
  defaultVeterinarian,
  veterinarians
}: BlockSlotModalProps) => {
  const [formData, setFormData] = useState({
    date: defaultDate || '',
    startTime: defaultTime || '',
    endTime: '',
    veterinarianId: defaultVeterinarian || '',
    reason: ''
  });
  const [selectedDuration, setSelectedDuration] = useState('30');
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { blockTimeSlot } = useAvailableSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.veterinarianId) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 Submitting block slot form:', formData);
      
      const success = await blockTimeSlot(
        formData.date,
        formData.startTime,
        formData.endTime,
        formData.veterinarianId
      );

      if (success) {
        console.log('✅ Slot blocked successfully, closing modal');
        onClose();
        // Réinitialiser le formulaire
        setFormData({
          date: '',
          startTime: '',
          endTime: '',
          veterinarianId: '',
          reason: ''
        });
        setSelectedDuration('30');
        setShowCustomTime(false);
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const handleStartTimeChange = (startTime: string) => {
    setFormData(prev => ({ 
      ...prev, 
      startTime,
      endTime: selectedDuration !== 'custom' ? calculateEndTime(startTime, parseInt(selectedDuration)) : prev.endTime
    }));
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
    setShowCustomTime(duration === 'custom');
    
    if (duration !== 'custom' && formData.startTime) {
      const endTime = calculateEndTime(formData.startTime, parseInt(duration));
      setFormData(prev => ({ ...prev, endTime }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">Bloquer un créneau</DialogTitle>
          <DialogDescription className="text-vet-brown">
            Bloquez manuellement un créneau horaire pour empêcher les réservations
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="veterinarian">Vétérinaire</Label>
            <Select 
              value={formData.veterinarianId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarianId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un vétérinaire" />
              </SelectTrigger>
              <SelectContent>
                {veterinarians.filter(vet => vet.is_active).map((vet) => (
                  <SelectItem key={vet.id} value={vet.id}>
                    {vet.name}
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

          <div className="space-y-2">
            <Label htmlFor="startTime">Heure de début</Label>
            <Select value={formData.startTime} onValueChange={handleStartTimeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez l'heure de début" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durée du blocage</Label>
            <Select value={selectedDuration} onValueChange={handleDurationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la durée" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showCustomTime && (
            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin personnalisée</Label>
              <Select value={formData.endTime} onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez l'heure de fin" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {TIME_SLOTS.filter(time => time > formData.startTime).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!showCustomTime && formData.endTime && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Créneau bloqué :</strong> de {formData.startTime} à {formData.endTime}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Raison (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Absence exceptionnelle, formation, urgence..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Blocage...' : 'Bloquer le créneau'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
