
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DefaultScheduleFormProps {
  defaultSchedule: {
    morning_start: string;
    morning_end: string;
    afternoon_start: string;
    afternoon_end: string;
  };
  onScheduleChange: (field: string, value: string) => void;
}

export const DefaultScheduleForm: React.FC<DefaultScheduleFormProps> = ({
  defaultSchedule,
  onScheduleChange
}) => {
  return (
    <div className="space-y-3 p-4 bg-vet-blue/5 rounded-lg border border-vet-blue/20">
      <Label className="text-sm font-medium text-vet-navy">Horaires par défaut</Label>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-vet-brown">Matin - Début</Label>
            <Input
              type="time"
              value={defaultSchedule.morning_start}
              onChange={(e) => onScheduleChange('morning_start', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-vet-brown">Matin - Fin</Label>
            <Input
              type="time"
              value={defaultSchedule.morning_end}
              onChange={(e) => onScheduleChange('morning_end', e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-vet-brown">Après-midi - Début</Label>
            <Input
              type="time"
              value={defaultSchedule.afternoon_start}
              onChange={(e) => onScheduleChange('afternoon_start', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-vet-brown">Après-midi - Fin</Label>
            <Input
              type="time"
              value={defaultSchedule.afternoon_end}
              onChange={(e) => onScheduleChange('afternoon_end', e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
