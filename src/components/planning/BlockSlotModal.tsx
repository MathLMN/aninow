
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { useBlockSlots } from "@/hooks/useBlockSlots";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlockSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultVeterinarian?: string;
  defaultData?: {
    bookingId?: string;
    date?: string;
    time?: string;
    endTime?: string;
    veterinarianId?: string;
    reason?: string;
  };
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
  defaultData,
  veterinarians
}: BlockSlotModalProps) => {
  const isEditMode = !!defaultData?.bookingId;
  
  const [formData, setFormData] = useState({
    date: defaultData?.date || defaultDate || '',
    startTime: defaultData?.time || defaultTime || '',
    endTime: defaultData?.endTime || '',
    veterinarianId: defaultData?.veterinarianId || defaultVeterinarian || '',
    reason: defaultData?.reason || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentClinicId } = useClinicAccess();
  const { toast } = useToast();
  const { blockSlots, isBlocking } = useBlockSlots();

  // Mettre à jour le formulaire quand defaultData change
  useEffect(() => {
    if (defaultData) {
      setFormData({
        date: defaultData.date || '',
        startTime: defaultData.time || '',
        endTime: defaultData.endTime || '',
        veterinarianId: defaultData.veterinarianId || '',
        reason: defaultData.reason || ''
      });
    } else if (defaultDate || defaultTime || defaultVeterinarian) {
      setFormData({
        date: defaultDate || '',
        startTime: defaultTime || '',
        endTime: '',
        veterinarianId: defaultVeterinarian || '',
        reason: ''
      });
    }
  }, [defaultData, defaultDate, defaultTime, defaultVeterinarian]);

  const handleUnblock = async () => {
    if (!defaultData?.bookingId) return;

    setIsSubmitting(true);
    try {
      // Supprimer tous les bookings bloqués qui ont les mêmes date/heure/vétérinaire
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('is_blocked', true)
        .eq('appointment_date', formData.date)
        .eq('veterinarian_id', formData.veterinarianId)
        .gte('appointment_time', formData.startTime)
        .lt('appointment_time', formData.endTime);

      if (error) throw error;

      toast({
        title: "Créneau débloqué",
        description: "Le créneau est à nouveau disponible",
      });
      
      onClose();
    } catch (error: any) {
      console.error('❌ Error unblocking slot:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.veterinarianId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    if (!currentClinicId) {
      toast({
        title: "Erreur",
        description: "Clinique non identifiée",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 Submitting block slot form:', formData);
      
      // Si en mode édition, d'abord supprimer les anciens blocages
      if (isEditMode && defaultData) {
        await supabase
          .from('bookings')
          .delete()
          .eq('is_blocked', true)
          .eq('appointment_date', defaultData.date)
          .eq('veterinarian_id', defaultData.veterinarianId)
          .gte('appointment_time', defaultData.time)
          .lt('appointment_time', defaultData.endTime);
      }

      // Créer les nouveaux blocages
      await blockSlots({
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        veterinarianId: formData.veterinarianId,
        clinicId: currentClinicId,
        reason: formData.reason
      });

      console.log('✅ Slots blocked successfully, closing modal');
      onClose();
      // Réinitialiser le formulaire
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        veterinarianId: '',
        reason: ''
      });
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">
            {isEditMode ? 'Modifier le créneau bloqué' : 'Bloquer un créneau'}
          </DialogTitle>
          <DialogDescription className="text-vet-brown">
            {isEditMode 
              ? 'Modifiez les paramètres du créneau bloqué ou débloquez-le'
              : 'Bloquez manuellement un créneau horaire pour empêcher les réservations'
            }
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
            <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
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
            <Label htmlFor="endTime">Heure de fin</Label>
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

          {formData.startTime && formData.endTime && (
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

          <div className="flex justify-between">
            <div>
              {isEditMode && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleUnblock}
                  disabled={isSubmitting}
                >
                  Débloquer le créneau
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isBlocking}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting || isBlocking 
                  ? (isEditMode ? 'Modification...' : 'Blocage...') 
                  : (isEditMode ? 'Modifier le blocage' : 'Bloquer le créneau')
                }
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
