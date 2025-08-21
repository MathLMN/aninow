
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, UserCheck } from "lucide-react";

interface AppointmentSectionProps {
  formData: any;
  veterinarians: any[];
  consultationTypes: any[];
  onFieldUpdate: (field: string, value: string | number) => void;
  onConsultationTypeChange: (consultationTypeId: string) => void;
  onTimeChange: (time: string) => void;
  calculateEndTime: (startTime: string, duration: number) => string;
}

export const AppointmentSection = ({
  formData,
  veterinarians,
  consultationTypes,
  onFieldUpdate,
  onConsultationTypeChange,
  onTimeChange,
  calculateEndTime
}: AppointmentSectionProps) => {
  const handleMarkArrival = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5); // Format HH:MM
    onFieldUpdate('arrival_time', timeString);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <Calendar className="h-4 w-4 mr-1 text-blue-600" />
        <h3 className="font-semibold text-blue-900 text-sm">Rendez-vous</h3>
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="appointmentDate" className="text-xs font-medium text-gray-700">Date *</Label>
            <Input
              id="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => onFieldUpdate('appointmentDate', e.target.value)}
              required
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="appointmentTime" className="text-xs font-medium text-gray-700">Heure *</Label>
            <Input
              id="appointmentTime"
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => onTimeChange(e.target.value)}
              required
              className="h-7 text-xs"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="veterinarianId" className="text-xs font-medium text-gray-700">Vétérinaire</Label>
          <Select value={formData.veterinarianId} onValueChange={(value) => onFieldUpdate('veterinarianId', value)}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              {veterinarians.map((vet) => (
                <SelectItem key={vet.id} value={vet.id} className="text-xs">
                  {vet.name} - {vet.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="consultationTypeId" className="text-xs font-medium text-gray-700">Type de consultation</Label>
          <Select value={formData.consultationTypeId} onValueChange={onConsultationTypeChange}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              {consultationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id} className="text-xs">
                  {type.name} ({type.duration_minutes} min)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="duration" className="text-xs font-medium text-gray-700">Durée (min)</Label>
            <Input
              id="duration"
              type="number"
              min="5"
              step="5"
              value={formData.duration}
              onChange={(e) => onFieldUpdate('duration', parseInt(e.target.value) || 15)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Heure de fin</Label>
            <div className="flex items-center text-xs text-blue-700 bg-blue-50 p-1 rounded border h-7">
              <Clock className="h-3 w-3 mr-1" />
              {formData.appointmentEndTime || '--:--'}
            </div>
          </div>
        </div>

        {/* Section Arrivée du client - plus compacte */}
        <div className="bg-green-50/50 border border-green-200 rounded p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserCheck className="h-3 w-3 mr-1 text-green-600" />
              <Label className="text-xs font-medium text-gray-700">Arrivée client</Label>
            </div>
            {!formData.arrival_time ? (
              <Button
                type="button"
                size="sm"
                onClick={handleMarkArrival}
                className="bg-green-600 hover:bg-green-700 text-white h-6 px-2 text-xs"
              >
                Arrivé
              </Button>
            ) : (
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-green-700 font-medium">{formData.arrival_time}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="booking_source" className="text-xs font-medium text-gray-700">Source</Label>
          <Select value={formData.booking_source || 'phone'} onValueChange={(value) => onFieldUpdate('booking_source', value)}>
            <SelectTrigger className="h-7 text-xs">
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
