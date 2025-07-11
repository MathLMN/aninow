
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, PawPrint } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: any;
  veterinarians: any[];
  consultationTypes: any[];
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  defaultData,
  veterinarians,
  consultationTypes
}: CreateAppointmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Informations RDV
    appointment_date: defaultData?.date || '',
    appointment_time: defaultData?.time || '',
    veterinarian_id: defaultData?.veterinarian || '',
    consultation_type_id: '',
    duration_minutes: 15, // Durée par défaut
    
    // Informations client
    client_name: '',
    client_phone: '',
    client_email: '',
    preferred_contact_method: 'phone',
    
    // Informations animal
    animal_name: '',
    animal_species: '',
    animal_breed: '',
    animal_age: '',
    animal_weight: '',
    animal_sex: '',
    
    // Consultation
    consultation_reason: '',
    client_comment: '',
    
    // Source du RDV
    booking_source: 'phone' // 'phone', 'walk-in', 'online'
  });

  // Calculer l'heure de fin automatiquement
  const calculateEndTime = (startTime: string, duration: number) => {
    if (!startTime || !duration) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startInMinutes = hours * 60 + minutes;
    const endInMinutes = startInMinutes + duration;
    
    const endHours = Math.floor(endInMinutes / 60);
    const endMins = endInMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const appointmentEndTime = calculateEndTime(formData.appointment_time, formData.duration_minutes);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          ...formData,
          animal_weight: formData.animal_weight ? parseFloat(formData.animal_weight) : null,
          appointment_end_time: appointmentEndTime,
          status: 'confirmed', // RDV créés manuellement sont confirmés par défaut
          selected_symptoms: [],
          convenience_options: [],
          multiple_animals: []
        }]);

      if (error) throw error;

      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été ajouté au planning avec succès",
      });

      onClose();
      // Réinitialiser le formulaire
      setFormData({
        appointment_date: '',
        appointment_time: '',
        veterinarian_id: '',
        consultation_type_id: '',
        duration_minutes: 15,
        client_name: '',
        client_phone: '',
        client_email: '',
        preferred_contact_method: 'phone',
        animal_name: '',
        animal_species: '',
        animal_breed: '',
        animal_age: '',
        animal_weight: '',
        animal_sex: '',
        consultation_reason: '',
        client_comment: '',
        booking_source: 'phone'
      });

    } catch (err) {
      console.error('Erreur lors de la création du RDV:', err);
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mettre à jour la durée quand un type de consultation est sélectionné
  const handleConsultationTypeChange = (consultationTypeId: string) => {
    const selectedType = consultationTypes.find(type => type.id === consultationTypeId);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        consultation_type_id: consultationTypeId,
        duration_minutes: selectedType.duration_minutes
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">Créer un nouveau rendez-vous</DialogTitle>
          <DialogDescription>
            Saisir les informations pour un rendez-vous pris par téléphone ou sur place
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations RDV */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vet-navy flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Informations du rendez-vous
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment_date">Date</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => updateField('appointment_date', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="appointment_time">Heure</Label>
                <Input
                  id="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => updateField('appointment_time', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="veterinarian_id">Vétérinaire</Label>
                <Select value={formData.veterinarian_id} onValueChange={(value) => updateField('veterinarian_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un vétérinaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarians.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>
                        {vet.name} - {vet.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consultation_type_id">Type de consultation</Label>
                <Select value={formData.consultation_type_id} onValueChange={handleConsultationTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} ({type.duration_minutes} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration_minutes">Durée (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration_minutes}
                  onChange={(e) => updateField('duration_minutes', parseInt(e.target.value) || 15)}
                />
              </div>
              <div>
                <Label>Heure de fin</Label>
                <div className="flex items-center text-sm text-vet-brown bg-gray-50 p-2 rounded">
                  <Clock className="h-4 w-4 mr-1" />
                  {calculateEndTime(formData.appointment_time, formData.duration_minutes) || '--:--'}
                </div>
              </div>
              <div>
                <Label htmlFor="booking_source">Source du RDV</Label>
                <Select value={formData.booking_source} onValueChange={(value) => updateField('booking_source', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Téléphone</SelectItem>
                    <SelectItem value="walk-in">Sur place</SelectItem>
                    <SelectItem value="online">En ligne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informations client */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vet-navy flex items-center">
              <User className="h-4 w-4 mr-2" />
              Informations client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name">Nom complet *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => updateField('client_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="client_phone">Téléphone *</Label>
                <Input
                  id="client_phone"
                  type="tel"
                  value={formData.client_phone}
                  onChange={(e) => updateField('client_phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="client_email">Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => updateField('client_email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="preferred_contact_method">Contact préféré</Label>
                <Select value={formData.preferred_contact_method} onValueChange={(value) => updateField('preferred_contact_method', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Téléphone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informations animal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vet-navy flex items-center">
              <PawPrint className="h-4 w-4 mr-2" />
              Informations animal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="animal_name">Nom de l'animal *</Label>
                <Input
                  id="animal_name"
                  value={formData.animal_name}
                  onChange={(e) => updateField('animal_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="animal_species">Espèce *</Label>
                <Select value={formData.animal_species} onValueChange={(value) => updateField('animal_species', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez l'espèce" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chien">Chien</SelectItem>
                    <SelectItem value="Chat">Chat</SelectItem>
                    <SelectItem value="Lapin">Lapin</SelectItem>
                    <SelectItem value="Oiseau">Oiseau</SelectItem>
                    <SelectItem value="Hamster">Hamster</SelectItem>
                    <SelectItem value="Reptile">Reptile</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="animal_breed">Race</Label>
                <Input
                  id="animal_breed"
                  value={formData.animal_breed}
                  onChange={(e) => updateField('animal_breed', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="animal_age">Âge</Label>
                <Input
                  id="animal_age"
                  value={formData.animal_age}
                  onChange={(e) => updateField('animal_age', e.target.value)}
                  placeholder="ex: 3 ans"
                />
              </div>
              <div>
                <Label htmlFor="animal_weight">Poids (kg)</Label>
                <Input
                  id="animal_weight"
                  type="number"
                  step="0.1"
                  value={formData.animal_weight}
                  onChange={(e) => updateField('animal_weight', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="animal_sex">Sexe</Label>
                <Select value={formData.animal_sex} onValueChange={(value) => updateField('animal_sex', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mâle">Mâle</SelectItem>
                    <SelectItem value="Femelle">Femelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Motif de consultation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-vet-navy">Motif de consultation</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="consultation_reason">Raison de la consultation *</Label>
                <Input
                  id="consultation_reason"
                  value={formData.consultation_reason}
                  onChange={(e) => updateField('consultation_reason', e.target.value)}
                  placeholder="ex: Consultation de routine, Problème de peau..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="client_comment">Commentaire / Notes</Label>
                <Textarea
                  id="client_comment"
                  value={formData.client_comment}
                  onChange={(e) => updateField('client_comment', e.target.value)}
                  placeholder="Informations supplémentaires..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white"
            >
              {isSubmitting ? 'Création...' : 'Créer le rendez-vous'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
