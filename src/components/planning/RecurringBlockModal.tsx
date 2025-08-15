
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRecurringSlotBlocks } from "@/hooks/useRecurringSlotBlocks";

interface RecurringBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' }
];

export const RecurringBlockModal = ({
  isOpen,
  onClose,
  veterinarians
}: RecurringBlockModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    veterinarian_id: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    start_date: new Date().toISOString().split('T')[0], // Date d'aujourd'hui par défaut
    end_date: '' // Optionnel
  });

  const { createRecurringBlock, isCreating } = useRecurringSlotBlocks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.veterinarian_id || !formData.day_of_week || 
        !formData.start_time || !formData.end_time || !formData.start_date) {
      return;
    }

    try {
      await createRecurringBlock({
        title: formData.title,
        description: formData.description,
        veterinarian_id: formData.veterinarian_id,
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        is_active: true
      });

      // Réinitialiser le formulaire et fermer la modale
      setFormData({
        title: '',
        description: '',
        veterinarian_id: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating recurring block:', error);
    }
  };

  const getDurationText = () => {
    if (formData.start_time && formData.end_time) {
      const startDate = new Date(`2000-01-01T${formData.start_time}:00`);
      const endDate = new Date(`2000-01-01T${formData.end_time}:00`);
      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
      
      if (durationMinutes > 0) {
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        if (hours > 0 && minutes > 0) {
          return `${hours}h${minutes.toString().padStart(2, '0')}`;
        } else if (hours > 0) {
          return `${hours}h`;
        } else {
          return `${minutes} min`;
        }
      }
    }
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">Créer un blocage récurrent</DialogTitle>
          <DialogDescription className="text-vet-brown">
            Configurez un blocage automatique qui se répète chaque semaine pendant une période donnée
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du blocage *</Label>
            <Input
              id="title"
              placeholder="Ex: Chirurgie Dr. Dupont"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Détails sur ce blocage récurrent..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="veterinarian">Vétérinaire *</Label>
              <Select 
                value={formData.veterinarian_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarian_id: value }))}
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
              <Label htmlFor="day">Jour de la semaine *</Label>
              <Select 
                value={formData.day_of_week} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un jour" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début *</Label>
              <Select value={formData.start_time} onValueChange={(value) => setFormData(prev => ({ ...prev, start_time: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Heure de début" />
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
              <Label htmlFor="endTime">Heure de fin *</Label>
              <Select value={formData.end_time} onValueChange={(value) => setFormData(prev => ({ ...prev, end_time: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Heure de fin" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {TIME_SLOTS.filter(time => time > formData.start_time).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin (optionnel)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                min={formData.start_date}
              />
              <p className="text-xs text-vet-brown/70">
                Si vide, le blocage sera actif indéfiniment
              </p>
            </div>
          </div>

          {formData.start_time && formData.end_time && formData.day_of_week && formData.start_date && (
            <div className="p-4 bg-vet-beige/20 rounded-md border border-vet-blue/20">
              <p className="text-sm text-vet-navy font-medium">
                Récapitulatif du blocage :
              </p>
              <p className="text-sm text-vet-brown mt-1">
                <strong>{DAYS_OF_WEEK.find(d => d.value.toString() === formData.day_of_week)?.label}</strong> de{' '}
                <strong>{formData.start_time}</strong> à <strong>{formData.end_time}</strong>
                {getDurationText() && (
                  <span className="text-vet-sage"> ({getDurationText()})</span>
                )}
              </p>
              <p className="text-xs text-vet-brown mt-1">
                Du <strong>{new Date(formData.start_date).toLocaleDateString('fr-FR')}</strong>
                {formData.end_date && (
                  <span> au <strong>{new Date(formData.end_date).toLocaleDateString('fr-FR')}</strong></span>
                )}
                {!formData.end_date && <span> (sans limite)</span>}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white"
            >
              {isCreating ? 'Création...' : 'Créer le blocage récurrent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
