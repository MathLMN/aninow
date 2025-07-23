
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
    <div className="flex flex-col space-y-2 p-2 bg-vet-beige/10 rounded-lg border border-vet-blue/20 min-w-0">
      <div className="text-center">
        <Label className="text-xs font-medium text-vet-navy">{day.short}</Label>
      </div>
      
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-center space-x-1">
          <Switch
            checked={schedule.is_working}
            onCheckedChange={(checked) => onScheduleChange('is_working', checked)}
            className="scale-75"
          />
          <Label className="text-xs text-vet-brown">Travail</Label>
        </div>
        
        {schedule.is_working && (
          <div className="flex items-center justify-center space-x-1">
            <Checkbox
              checked={schedule.has_special_hours}
              onCheckedChange={(checked) => onScheduleChange('has_special_hours', checked)}
              className="scale-75"
            />
            <Label className="text-xs text-vet-brown">Spéciaux</Label>
          </div>
        )}
      </div>
      
      {schedule.is_working && schedule.has_special_hours && (
        <div className="grid grid-cols-2 gap-1 text-xs">
          <Input
            type="time"
            value={schedule.morning_start || "08:00"}
            onChange={(e) => onScheduleChange('morning_start', e.target.value)}
            className="text-xs h-6 text-center"
            placeholder="Matin"
          />
          <Input
            type="time"
            value={schedule.morning_end || "12:00"}
            onChange={(e) => onScheduleChange('morning_end', e.target.value)}
            className="text-xs h-6 text-center"
            placeholder="Matin"
          />
          <Input
            type="time"
            value={schedule.afternoon_start || "14:00"}
            onChange={(e) => onScheduleChange('afternoon_start', e.target.value)}
            className="text-xs h-6 text-center"
            placeholder="AM"
          />
          <Input
            type="time"
            value={schedule.afternoon_end || "18:00"}
            onChange={(e) => onScheduleChange('afternoon_end', e.target.value)}
            className="text-xs h-6 text-center"
            placeholder="AM"
          />
        </div>
      )}
    </div>
  );
};
