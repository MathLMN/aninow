import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { FileText, Clock, User } from "lucide-react";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: {
    id?: string;
    date: string;
    time: string;
    veterinarian?: string;
    title?: string;
    description?: string;
    noteType?: 'note' | 'reminder' | 'task';
  };
  veterinarians: any[];
}

export const CreateNoteModal = ({
  isOpen,
  onClose,
  defaultData,
  veterinarians
}: CreateNoteModalProps) => {
  const { toast } = useToast();
  const { currentClinicId } = useClinicAccess();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    noteType: 'note' as 'note' | 'reminder' | 'task',
    title: '',
    description: '',
    appointmentDate: '',
    appointmentTime: '',
    veterinarianId: ''
  });

  useEffect(() => {
    if (isOpen && defaultData) {
      setFormData({
        noteType: defaultData.noteType || 'note',
        title: defaultData.title || '',
        description: defaultData.description || '',
        appointmentDate: defaultData.date,
        appointmentTime: defaultData.time,
        veterinarianId: defaultData.veterinarian || ''
      });
    }
  }, [isOpen, defaultData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.appointmentDate || !formData.appointmentTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const noteTypeLabels = {
        note: 'Note',
        reminder: 'Rappel',
        task: 'Tâche'
      };

      const noteData = {
        clinic_id: currentClinicId,
        booking_source: 'note',
        consultation_reason: `${noteTypeLabels[formData.noteType]}: ${formData.title}`,
        client_name: noteTypeLabels[formData.noteType],
        client_email: 'note@clinic.internal',
        client_phone: '0000000000',
        preferred_contact_method: 'email',
        animal_name: formData.title,
        animal_species: 'Note',
        client_comment: formData.description,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        appointment_end_time: formData.appointmentTime,
        veterinarian_id: formData.veterinarianId || null,
        status: 'confirmed',
        duration_minutes: 15,
        is_blocked: false
      };

      let error;
      if (defaultData?.id) {
        // Mode édition
        const { error: updateError } = await supabase
          .from('bookings')
          .update(noteData)
          .eq('id', defaultData.id);
        error = updateError;
      } else {
        // Mode création
        const { error: insertError } = await supabase
          .from('bookings')
          .insert(noteData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Succès",
        description: defaultData?.id 
          ? `${noteTypeLabels[formData.noteType]} modifiée avec succès`
          : `${noteTypeLabels[formData.noteType]} créée avec succès`,
      });

      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la note",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-vet-navy flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {defaultData?.id ? 'Modifier la note / rappel' : 'Créer une note / rappel'}
          </DialogTitle>
          <DialogDescription>
            {defaultData?.id 
              ? 'Modifier une note, un rappel ou une tâche existante'
              : 'Ajouter une note, un rappel ou une tâche dans une période de fermeture'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de note */}
          <div className="space-y-2">
            <Label htmlFor="noteType">Type *</Label>
            <Select
              value={formData.noteType}
              onValueChange={(value: 'note' | 'reminder' | 'task') => 
                setFormData({ ...formData, noteType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">📝 Note</SelectItem>
                <SelectItem value="reminder">⏰ Rappel</SelectItem>
                <SelectItem value="task">✅ Tâche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Vétérinaire */}
          <div className="space-y-2">
            <Label htmlFor="veterinarian" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Vétérinaire (optionnel)
            </Label>
            <Select
              value={formData.veterinarianId}
              onValueChange={(value) => setFormData({ ...formData, veterinarianId: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucun vétérinaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun vétérinaire</SelectItem>
                {veterinarians
                  .filter(vet => vet.is_active)
                  .map(vet => (
                    <SelectItem key={vet.id} value={vet.id}>
                      {vet.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Appeler le fournisseur, Commande médicaments..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Détails supplémentaires..."
              rows={4}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-sage hover:bg-vet-sage/90"
            >
              {isSubmitting 
                ? (defaultData?.id ? 'Modification...' : 'Création...')
                : (defaultData?.id ? 'Modifier' : 'Créer')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
