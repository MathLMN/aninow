
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, UserCheck, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentSectionProps {
  formData: any;
  veterinarians: any[];
  consultationTypes: any[];
  validationErrors?: Record<string, boolean>;
  onFieldUpdate: (field: string, value: string | number | string[]) => void;
  onConsultationTypesChange: (consultationTypeIds: string[]) => void;
  onTimeChange: (time: string) => void;
  calculateEndTime: (startTime: string, duration: number) => string;
  onMarkArrival: () => void;
}

export const AppointmentSection = ({
  formData,
  veterinarians,
  consultationTypes,
  validationErrors = {},
  onFieldUpdate,
  onConsultationTypesChange,
  onTimeChange,
  calculateEndTime,
  onMarkArrival
}: AppointmentSectionProps) => {

  const handleConsultationTypeToggle = (typeId: string) => {
    const currentIds = formData.consultationTypeIds || [];
    const newIds = currentIds.includes(typeId)
      ? currentIds.filter((id: string) => id !== typeId)
      : [...currentIds, typeId];
    onConsultationTypesChange(newIds);
  };

  const handleRemoveConsultationType = (typeId: string) => {
    const currentIds = formData.consultationTypeIds || [];
    const newIds = currentIds.filter((id: string) => id !== typeId);
    onConsultationTypesChange(newIds);
  };

  const selectedTypes = consultationTypes.filter(type => 
    (formData.consultationTypeIds || []).includes(type.id)
  );

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
          <Label htmlFor="consultationTypeId" className="text-xs font-medium text-gray-700">
            Type(s) de consultation *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-full h-auto min-h-7 justify-between text-xs ${
                  validationErrors.consultationTypeIds || (formData.booking_source === 'online' && (!formData.consultationTypeIds || formData.consultationTypeIds.length === 0))
                    ? 'border-red-500 border-2' 
                    : ''
                }`}
              >
                <div className="flex flex-wrap gap-1 flex-1 overflow-hidden max-w-[90%]">
                  {selectedTypes.length === 0 ? (
                    <span className="text-muted-foreground">Sélectionnez...</span>
                  ) : selectedTypes.length === 1 ? (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0.5 gap-1 hover:bg-secondary/80 cursor-pointer flex items-center max-w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveConsultationType(selectedTypes[0].id);
                      }}
                    >
                      <span className="truncate">
                        {selectedTypes[0].name} ({selectedTypes[0].duration_minutes} min)
                      </span>
                      <X className="h-2.5 w-2.5 shrink-0" />
                    </Badge>
                  ) : (
                    <>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5 gap-1 hover:bg-secondary/80 cursor-pointer flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveConsultationType(selectedTypes[0].id);
                        }}
                      >
                        <span className="truncate max-w-[120px]">
                          {selectedTypes[0].name}
                        </span>
                        <X className="h-2.5 w-2.5 shrink-0" />
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 border-blue-200"
                      >
                        +{selectedTypes.length - 1} autre{selectedTypes.length > 2 ? 's' : ''}
                      </Badge>
                    </>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-2 bg-white z-50" align="start">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedTypes.length > 0 && (
                  <div className="pb-2 border-b mb-2">
                    <div className="text-[10px] font-medium text-gray-500 mb-2">
                      Sélectionné{selectedTypes.length > 1 ? 's' : ''} ({selectedTypes.reduce((sum, t) => sum + t.duration_minutes, 0)} min total)
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTypes.map((type) => (
                        <Badge
                          key={type.id}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0.5 gap-1 hover:bg-secondary/80 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveConsultationType(type.id);
                          }}
                        >
                          {type.name} ({type.duration_minutes}m)
                          <X className="h-2.5 w-2.5" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {consultationTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2 hover:bg-gray-50 p-1.5 rounded">
                    <Checkbox
                      id={`type-${type.id}`}
                      checked={(formData.consultationTypeIds || []).includes(type.id)}
                      onCheckedChange={() => handleConsultationTypeToggle(type.id)}
                      className="h-3.5 w-3.5"
                    />
                    <label
                      htmlFor={`type-${type.id}`}
                      className="text-xs font-normal leading-none cursor-pointer flex-1"
                    >
                      {type.name} <span className="text-gray-500">({type.duration_minutes} min)</span>
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
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
              className={`h-7 text-xs duration-input-spinner ${validationErrors.duration ? 'border-red-500 border-2' : ''}`}
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
                onClick={onMarkArrival}
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
