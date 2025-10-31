
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, UserCheck, Package } from "lucide-react";

interface AppointmentSectionProps {
  formData: any;
  veterinarians: any[];
  consultationTypes: any[];
  validationErrors?: Record<string, boolean>;
  onFieldUpdate: (field: string, value: string | number | string[]) => void;
  onConsultationTypeChange: (consultationTypeIds: string[]) => void;
  onTimeChange: (time: string) => void;
  calculateEndTime: (startTime: string, duration: number) => string;
}

export const AppointmentSection = ({
  formData,
  veterinarians,
  consultationTypes,
  validationErrors = {},
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
          <Label htmlFor="veterinarianId" className="text-xs font-medium text-gray-700">
            Vétérinaire *
          </Label>
          <Select value={formData.veterinarianId} onValueChange={(value) => onFieldUpdate('veterinarianId', value)}>
            <SelectTrigger className={`h-7 text-xs ${validationErrors.veterinarianId ? 'border-red-500 border-2' : ''}`}>
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
          <div className="flex items-center gap-1.5 mb-1.5">
            <Package className="h-3.5 w-3.5 text-blue-600" />
            <Label className="text-xs font-medium text-gray-700">
              Types de consultation * (plusieurs choix possibles)
            </Label>
          </div>
          <div className={`border rounded-md p-2 space-y-1.5 bg-white ${validationErrors.consultationTypeIds ? 'border-red-500 border-2' : 'border-gray-200'}`}>
            {consultationTypes.map((type) => {
              const isSelected = formData.consultationTypeIds?.includes(type.id) || false;
              return (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`consultation-${type.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const currentIds = formData.consultationTypeIds || [];
                      const newIds = checked
                        ? [...currentIds, type.id]
                        : currentIds.filter((id: string) => id !== type.id);
                      onFieldUpdate('consultationTypeIds', newIds);
                      
                      // Recalculer la durée totale
                      const totalDuration = consultationTypes
                        .filter(ct => newIds.includes(ct.id))
                        .reduce((sum, ct) => sum + ct.duration_minutes, 0);
                      onFieldUpdate('duration', totalDuration || 15);
                      
                      // Recalculer l'heure de fin
                      if (formData.appointmentTime) {
                        const endTime = calculateEndTime(formData.appointmentTime, totalDuration || 15);
                        onFieldUpdate('appointmentEndTime', endTime);
                      }
                    }}
                  />
                  <label
                    htmlFor={`consultation-${type.id}`}
                    className="text-xs cursor-pointer flex-1 flex items-center justify-between"
                  >
                    <span className={isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}>
                      {type.name}
                    </span>
                    <span className={`text-xs ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                      {type.duration_minutes} min
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
          {formData.consultationTypeIds?.length > 0 && (
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Package className="h-3 w-3" />
              {formData.consultationTypeIds.length} prestation{formData.consultationTypeIds.length > 1 ? 's' : ''} sélectionnée{formData.consultationTypeIds.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="duration" className="text-xs font-medium text-gray-700">
              Durée (min) *
            </Label>
            <Input
              id="duration"
              type="number"
              min="5"
              step="5"
              value={formData.duration}
              onChange={(e) => onFieldUpdate('duration', parseInt(e.target.value) || 15)}
              className={`h-7 text-xs ${validationErrors.duration ? 'border-red-500 border-2' : ''}`}
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
