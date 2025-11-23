
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClinicContext } from "@/contexts/ClinicContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

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
  const [formData, setFormData] = useState({
    date: defaultDate || '',
    startTime: defaultTime || '',
    endTime: '',
    veterinarianId: defaultVeterinarian || '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentClinic } = useClinicContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const blockTimeSlotMutation = useMutation({
    mutationFn: async ({
      date,
      startTime,
      endTime,
      veterinarianId,
      clinicId
    }: {
      date: string;
      startTime: string;
      endTime: string;
      veterinarianId: string;
      clinicId: string;
    }) => {
      console.log('🔄 Blocking time slot:', { date, startTime, endTime, veterinarianId, clinicId });
      
      const blockedInsert: Database['public']['Tables']['bookings']['Insert'] = {
        clinic_id: clinicId,
        veterinarian_id: veterinarianId,
        appointment_date: date,
        appointment_time: startTime,
        appointment_end_time: endTime,
        is_blocked: true,
        animal_species: 'blocked',
        animal_name: 'Créneau bloqué',
        consultation_reason: 'consultation-convenance',
        client_name: 'Système',
        client_email: 'system@clinique.local',
        client_phone: '0000000000',
        preferred_contact_method: 'phone',
        status: 'confirmed',
        booking_source: 'manual',
      }

      console.log('📝 Inserting blocked booking:', blockedInsert);

      const { data, error } = await supabase
        .from('bookings')
        .insert(blockedInsert)
        .select()
        .single();

      if (error) {
        console.error('❌ Error inserting blocked booking:', error);
        throw new Error(`Erreur d'insertion: ${error.message}`);
      }

      console.log('✅ Blocked booking created:', data);
      return data;
    },
    onSuccess: () => {
      console.log('✅ Block slot mutation succeeded');
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      queryClient.invalidateQueries({ queryKey: ['vet-bookings'] });
      toast({
        title: "Créneau bloqué",
        description: "Le créneau a été bloqué avec succès",
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to block slot:', error);
      const errorMessage = error?.message || 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

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

    if (!currentClinic?.id) {
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
      
      await blockTimeSlotMutation.mutateAsync({
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        veterinarianId: formData.veterinarianId,
        clinicId: currentClinic.id
      });

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
