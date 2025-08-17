
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlockSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultVeterinarian?: string;
  veterinarians: any[];
}

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
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    date: defaultDate || '',
    startTime: defaultTime || '',
    endTime: '',
    veterinarianId: defaultVeterinarian || '',
    reason: ''
  });
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
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile 
          ? 'w-[95vw] max-h-[95vh] m-2 p-0 rounded-lg' 
          : 'sm:max-w-[500px] max-h-[90vh] p-0'
        } 
        overflow-hidden flex flex-col
      `}>
        <DialogHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex-shrink-0">
          <DialogTitle className="text-base sm:text-lg text-vet-navy">Bloquer un créneau</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-vet-brown">
            Bloquez manuellement un créneau horaire pour empêcher les réservations
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="veterinarian" className="text-xs sm:text-sm font-medium">Vétérinaire</Label>
            <Select 
              value={formData.veterinarianId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarianId: value }))}
            >
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue placeholder="Sélectionnez un vétérinaire" />
              </SelectTrigger>
              <SelectContent>
                {veterinarians.filter(vet => vet.is_active).map((vet) => (
                  <SelectItem key={vet.id} value={vet.id} className="text-xs sm:text-sm">
                    {vet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs sm:text-sm font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-xs sm:text-sm font-medium">Heure de début</Label>
              <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Début" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time} className="text-xs sm:text-sm">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime" className="text-xs sm:text-sm font-medium">Heure de fin</Label>
            <Select value={formData.endTime} onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}>
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue placeholder="Fin" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {TIME_SLOTS.filter(time => time > formData.startTime).map((time) => (
                  <SelectItem key={time} value={time} className="text-xs sm:text-sm">
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.startTime && formData.endTime && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>Créneau bloqué :</strong> de {formData.startTime} à {formData.endTime}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-xs sm:text-sm font-medium">Raison (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Absence exceptionnelle, formation, urgence..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="text-xs sm:text-sm resize-none"
            />
          </div>

          <div className={`
            flex gap-2 sm:gap-3 pt-4
            ${isMobile ? 'flex-col' : 'flex-row justify-end'}
          `}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              {isSubmitting ? 'Blocage...' : 'Bloquer le créneau'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
