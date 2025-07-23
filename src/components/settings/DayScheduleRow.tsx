
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface DayScheduleRowProps {
  day: {
    value: number;
    label: string;
    short: string;
  };
  schedule: {
    day_of_week: number;
    is_working: boolean;
    has_special_hours: boolean;
    morning_start?: string;
    morning_end?: string;
    afternoon_start?: string;
    afternoon_end?: string;
  };
  onScheduleChange: (field: string, value: string | boolean) => void;
}

export const DayScheduleRow: React.FC<DayScheduleRowProps> = ({
  day,
  schedule,
  onScheduleChange
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-vet-beige/10 rounded-lg border border-vet-blue/20">
      <div className="flex items-center space-x-4">
        <Label className="text-sm font-medium text-vet-navy w-20">{day.label}</Label>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={schedule.is_working}
            onCheckedChange={(checked) => onScheduleChange('is_working', checked)}
          />
          <Label className="text-xs text-vet-brown">Travail</Label>
        </div>
        
        {schedule.is_working && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={schedule.has_special_hours}
              onCheckedChange={(checked) => onScheduleChange('has_special_hours', checked)}
            />
            <Label className="text-xs text-vet-brown">Horaires spéciaux</Label>
          </div>
        )}
      </div>
      
      {schedule.is_working && schedule.has_special_hours && (
        <div className="grid grid-cols-4 gap-1 text-xs">
          <Input
            type="time"
            value={schedule.morning_start || "08:00"}
            onChange={(e) => onScheduleChange('morning_start', e.target.value)}
            className="text-xs h-8"
            placeholder="Matin début"
          />
          <Input
            type="time"
            value={schedule.morning_end || "12:00"}
            onChange={(e) => onScheduleChange('morning_end', e.target.value)}
            className="text-xs h-8"
            placeholder="Matin fin"
          />
          <Input
            type="time"
            value={schedule.afternoon_start || "14:00"}
            onChange={(e) => onScheduleChange('afternoon_start', e.target.value)}
            className="text-xs h-8"
            placeholder="AM début"
          />
          <Input
            type="time"
            value={schedule.afternoon_end || "18:00"}
            onChange={(e) => onScheduleChange('afternoon_end', e.target.value)}
            className="text-xs h-8"
            placeholder="AM fin"
          />
        </div>
      )}
    </div>
  );
};
