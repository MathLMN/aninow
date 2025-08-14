
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User } from "lucide-react";

interface MoveAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  veterinarians: any[];
  onMoveAppointment: (appointmentId: string, newDate: string, newTime: string, newVetId?: string) => Promise<boolean>;
}

export const MoveAppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  veterinarians,
  onMoveAppointment
}: MoveAppointmentModalProps) => {
  const [newDate, setNewDate] = useState(appointment?.appointment_date || '');
  const [newTime, setNewTime] = useState(appointment?.appointment_time || '');
  const [newVetId, setNewVetId] = useState(appointment?.veterinarian_id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    setIsSubmitting(true);
    try {
      const success = await onMoveAppointment(appointment.id, newDate, newTime, newVetId);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-vet-navy">
            <Calendar className="h-5 w-5" />
            Déplacer le rendez-vous
          </DialogTitle>
          <DialogDescription className="text-vet-brown">
            Déplacer le rendez-vous de <strong>{appointment.client_name}</strong> avec <strong>{appointment.animal_name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentDate" className="text-sm font-medium">Date actuelle</Label>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
                {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentTime" className="text-sm font-medium">Heure actuelle</Label>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">
                {appointment.appointment_time}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newDate" className="text-sm font-medium">Nouvelle date</Label>
              <Input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="border-vet-blue/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newTime" className="text-sm font-medium">Nouvelle heure</Label>
              <Input
                id="newTime"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                className="border-vet-blue/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian" className="text-sm font-medium">Vétérinaire</Label>
            <Select value={newVetId} onValueChange={setNewVetId}>
              <SelectTrigger className="border-vet-blue/30">
                <SelectValue placeholder="Choisir un vétérinaire" />
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white"
            >
              {isSubmitting ? 'Déplacement...' : 'Déplacer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
