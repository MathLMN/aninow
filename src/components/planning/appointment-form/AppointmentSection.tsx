
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
    <div className="space-y-3">
      <div className="flex items-center mb-3">
        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
        <h3 className="font-semibold text-blue-900 text-lg">Rendez-vous</h3>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="appointment_date" className="text-xs font-medium text-gray-700">Date *</Label>
            <Input
              id="appointment_date"
              type="date"
              value={formData.appointment_date}
              onChange={(e) => onFieldUpdate('appointment_date', e.target.value)}
              required
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="appointment_time" className="text-xs font-medium text-gray-700">Heure *</Label>
            <Input
              id="appointment_time"
              type="time"
              value={formData.appointment_time}
              onChange={(e) => onFieldUpdate('appointment_time', e.target.value)}
              required
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="veterinarian_id" className="text-xs font-medium text-gray-700">Vétérinaire</Label>
          <Select value={formData.veterinarian_id} onValueChange={(value) => onFieldUpdate('veterinarian_id', value)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              {veterinarians.map((vet) => (
                <SelectItem key={vet.id} value={vet.id} className="text-sm">
                  {vet.name} - {vet.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="consultation_type_id" className="text-xs font-medium text-gray-700">Type de consultation</Label>
          <Select value={formData.consultation_type_id} onValueChange={onConsultationTypeChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              {consultationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id} className="text-sm">
                  {type.name} ({type.duration_minutes} min)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="duration_minutes" className="text-xs font-medium text-gray-700">Durée (min)</Label>
            <Input
              id="duration_minutes"
              type="number"
              min="5"
              step="5"
              value={formData.duration_minutes}
              onChange={(e) => onFieldUpdate('duration_minutes', parseInt(e.target.value) || 15)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Heure de fin</Label>
            <div className="flex items-center text-xs text-blue-700 bg-blue-50 p-2 rounded border h-8">
              <Clock className="h-3 w-3 mr-1" />
              {calculateEndTime(formData.appointment_time, formData.duration_minutes) || '--:--'}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="booking_source" className="text-xs font-medium text-gray-700">Source</Label>
          <Select value={formData.booking_source} onValueChange={(value) => onFieldUpdate('booking_source', value)}>
            <SelectTrigger className="h-8 text-sm">
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
