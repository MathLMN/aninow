
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";

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
  const handleSetArrivalTime = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5); // Format HH:MM
    onFieldUpdate('arrival_time', timeString);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center mb-3">
        <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
        <h3 className="font-semibold text-blue-900 text-lg">Rendez-vous</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="appointment_date" className="text-xs font-medium text-gray-700">Date *</Label>
          <Input
            type="date"
            id="appointment_date"
            value={formData.appointment_date}
            onChange={(e) => onFieldUpdate('appointment_date', e.target.value)}
            required
            className="h-9 text-sm"
          />
        </div>
        
        <div>
          <Label htmlFor="appointment_time" className="text-xs font-medium text-gray-700">Heure de début *</Label>
          <Input
            type="time"
            id="appointment_time"
            value={formData.appointment_time}
            onChange={(e) => onFieldUpdate('appointment_time', e.target.value)}
            required
            className="h-9 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="veterinarian_id" className="text-xs font-medium text-gray-700">Vétérinaire *</Label>
          <Select value={formData.veterinarian_id} onValueChange={(value) => onFieldUpdate('veterinarian_id', value)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Sélectionner un vétérinaire" />
            </SelectTrigger>
            <SelectContent>
              {veterinarians.map((vet) => (
                <SelectItem key={vet.id} value={vet.id}>
                  {vet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="consultation_type_id" className="text-xs font-medium text-gray-700">Type de consultation *</Label>
          <Select value={formData.consultation_type_id} onValueChange={onConsultationTypeChange}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {consultationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.duration_minutes}min)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="appointment_reason" className="text-xs font-medium text-gray-700">Motif du rendez-vous</Label>
          <Input
            id="appointment_reason"
            value={formData.appointment_reason || ''}
            onChange={(e) => onFieldUpdate('appointment_reason', e.target.value)}
            placeholder="ex: Vaccination, Consultation de routine..."
            className="h-9 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="arrival_time" className="text-xs font-medium text-gray-700">Heure d'arrivée</Label>
          <div className="flex gap-2">
            <Input
              type="time"
              id="arrival_time"
              value={formData.arrival_time || ''}
              onChange={(e) => onFieldUpdate('arrival_time', e.target.value)}
              className="h-9 text-sm flex-1"
            />
            <Button
              type="button"
              onClick={handleSetArrivalTime}
              size="sm"
              variant="outline"
              className="h-9 px-3 whitespace-nowrap"
            >
              <Clock className="h-4 w-4 mr-1" />
              Maintenant
            </Button>
          </div>
        </div>
      </div>

      {formData.appointment_time && formData.duration_minutes && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Heure de fin calculée:</strong> {calculateEndTime(formData.appointment_time, formData.duration_minutes)}
        </div>
      )}
    </div>
  );
};
