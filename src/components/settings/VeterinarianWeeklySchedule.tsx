
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { Clock, Save } from "lucide-react";
import { DefaultScheduleForm } from "./DefaultScheduleForm";
import { DayScheduleRow } from "./DayScheduleRow";

interface Veterinarian {
  id: string;
  name: string;
  specialty: string;
  is_active: boolean;
}

interface VeterinarianSchedule {
  id?: string;
  veterinarian_id: string;
  day_of_week: number;
  is_working: boolean;
  morning_start?: string;
  morning_end?: string;
  afternoon_start?: string;
  afternoon_end?: string;
}

interface ExtendedVeterinarianSchedule extends VeterinarianSchedule {
  has_special_hours: boolean;
}

interface VeterinarianWeeklyScheduleProps {
  veterinarian: Veterinarian;
  schedules: VeterinarianSchedule[];
}

const DAYS = [
  { value: 1, label: "Lundi", short: "Lun" },
  { value: 2, label: "Mardi", short: "Mar" },
  { value: 3, label: "Mercredi", short: "Mer" },
  { value: 4, label: "Jeudi", short: "Jeu" },
  { value: 5, label: "Vendredi", short: "Ven" },
  { value: 6, label: "Samedi", short: "Sam" },
  { value: 0, label: "Dimanche", short: "Dim" }
];

export const VeterinarianWeeklySchedule: React.FC<VeterinarianWeeklyScheduleProps> = ({
  veterinarian,
  schedules
}) => {
  const { updateSchedule } = useVeterinarianSchedules();
  
  const [defaultSchedule, setDefaultSchedule] = useState({
    morning_start: "08:00",
    morning_end: "12:00",
    afternoon_start: "14:00",
    afternoon_end: "18:00"
  });

  const [localSchedules, setLocalSchedules] = useState<ExtendedVeterinarianSchedule[]>(() => {
    return DAYS.map(day => {
      const existingSchedule = schedules.find(s => s.day_of_week === day.value);
      const hasSpecialHours = existingSchedule ? (
        existingSchedule.morning_start !== defaultSchedule.morning_start ||
        existingSchedule.morning_end !== defaultSchedule.morning_end ||
        existingSchedule.afternoon_start !== defaultSchedule.afternoon_start ||
        existingSchedule.afternoon_end !== defaultSchedule.afternoon_end
      ) : false;
      
      return {
        ...existingSchedule,
        veterinarian_id: veterinarian.id,
        day_of_week: day.value,
        is_working: existingSchedule?.is_working ?? (day.value >= 1 && day.value <= 5),
        morning_start: existingSchedule?.morning_start || defaultSchedule.morning_start,
        morning_end: existingSchedule?.morning_end || defaultSchedule.morning_end,
        afternoon_start: existingSchedule?.afternoon_start || defaultSchedule.afternoon_start,
        afternoon_end: existingSchedule?.afternoon_end || defaultSchedule.afternoon_end,
        has_special_hours: hasSpecialHours
      };
    });
  });

  const handleDefaultScheduleChange = (field: string, value: string) => {
    setDefaultSchedule(prev => ({ ...prev, [field]: value }));
    
    // Update all schedules that don't have special hours
    setLocalSchedules(prev => 
      prev.map(schedule => 
        !schedule.has_special_hours 
          ? { ...schedule, [field]: value }
          : schedule
      )
    );
  };

  const handleScheduleChange = (dayOfWeek: number, field: string, value: string | boolean) => {
    setLocalSchedules(prev => 
      prev.map(schedule => {
        if (schedule.day_of_week !== dayOfWeek) return schedule;
        
        const updatedSchedule = { ...schedule, [field]: value };
        
        // If disabling special hours, revert to default schedule
        if (field === 'has_special_hours' && !value) {
          return {
            ...updatedSchedule,
            morning_start: defaultSchedule.morning_start,
            morning_end: defaultSchedule.morning_end,
            afternoon_start: defaultSchedule.afternoon_start,
            afternoon_end: defaultSchedule.afternoon_end
          };
        }
        
        return updatedSchedule;
      })
    );
  };

  const handleSaveSchedules = async () => {
    console.log('💾 Saving schedules for veterinarian:', veterinarian.name);
    
    const promises = localSchedules.map(schedule => {
      const scheduleToSave = {
        ...schedule,
        // Remove the has_special_hours field as it's not in the database
        has_special_hours: undefined
      };
      delete scheduleToSave.has_special_hours;
      
      console.log('📅 Saving schedule for day:', schedule.day_of_week, scheduleToSave);
      return updateSchedule(scheduleToSave);
    });
    
    await Promise.all(promises);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center text-lg">
          <Clock className="h-5 w-5 mr-2" />
          Horaires - {veterinarian.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DefaultScheduleForm
          defaultSchedule={defaultSchedule}
          onScheduleChange={handleDefaultScheduleChange}
        />
        
        <div className="space-y-2">
          {DAYS.map(day => {
            const schedule = localSchedules.find(s => s.day_of_week === day.value);
            if (!schedule) return null;

            return (
              <DayScheduleRow
                key={day.value}
                day={day}
                schedule={schedule}
                onScheduleChange={(field, value) => handleScheduleChange(day.value, field, value)}
              />
            );
          })}
        </div>
        
        <Button
          onClick={handleSaveSchedules}
          className="w-full bg-vet-blue hover:bg-vet-blue/90 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </CardContent>
    </Card>
  );
};
