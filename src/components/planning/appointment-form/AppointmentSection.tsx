
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface AppointmentSectionProps {
  formData: any;
  veterinarians: any[];
  consultationTypes: any[];
  onFieldUpdate: (field: string, value: string | number) => void;
  onConsultationTypeChange: (consultationTypeId: string) => void;
  calculateEndTime: (startTime: string, duration: number) => string;
}

export const AppointmentSection = ({
  formData,
  veterinarians,
  consultationTypes,
  onFieldUpdate,
  onConsultationTypeChange,
  calculateEndTime
}: AppointmentSectionProps) => {
  return (
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
            onChange={(e) => onFieldUpdate('appointment_date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="appointment_time">Heure</Label>
          <Input
            id="appointment_time"
            type="time"
            value={formData.appointment_time}
            onChange={(e) => onFieldUpdate('appointment_time', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="veterinarian_id">Vétérinaire</Label>
          <Select value={formData.veterinarian_id} onValueChange={(value) => onFieldUpdate('veterinarian_id', value)}>
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
          <Select value={formData.consultation_type_id} onValueChange={onConsultationTypeChange}>
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
            onChange={(e) => onFieldUpdate('duration_minutes', parseInt(e.target.value) || 15)}
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
          <Select value={formData.booking_source} onValueChange={(value) => onFieldUpdate('booking_source', value)}>
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
  );
};
