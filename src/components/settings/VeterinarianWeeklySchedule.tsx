
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { Clock, Save } from "lucide-react";

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
  const [localSchedules, setLocalSchedules] = useState<VeterinarianSchedule[]>(() => {
    // Initialize with existing schedules or default values
    return DAYS.map(day => {
      const existingSchedule = schedules.find(s => s.day_of_week === day.value);
      return existingSchedule || {
        veterinarian_id: veterinarian.id,
        day_of_week: day.value,
        is_working: day.value >= 1 && day.value <= 5, // Default: working Mon-Fri
        morning_start: "08:00",
        morning_end: "12:00",
        afternoon_start: "14:00",
        afternoon_end: "18:00"
      };
    });
  });

  const handleScheduleChange = (dayOfWeek: number, field: string, value: string | boolean) => {
    setLocalSchedules(prev => 
      prev.map(schedule => 
        schedule.day_of_week === dayOfWeek 
          ? { ...schedule, [field]: value }
          : schedule
      )
    );
  };

  const handleSaveSchedules = async () => {
    console.log('💾 Saving schedules for veterinarian:', veterinarian.name);
    
    const promises = localSchedules.map(schedule => {
      console.log('📅 Saving schedule for day:', schedule.day_of_week, schedule);
      return updateSchedule(schedule);
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
        {DAYS.map(day => {
          const schedule = localSchedules.find(s => s.day_of_week === day.value);
          if (!schedule) return null;

          return (
            <div key={day.value} className="space-y-3 p-4 bg-vet-beige/10 rounded-lg border border-vet-blue/20">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-vet-navy">{day.label}</Label>
                <Switch
                  checked={schedule.is_working}
                  onCheckedChange={(checked) => handleScheduleChange(day.value, 'is_working', checked)}
                />
              </div>
              
              {schedule.is_working && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-vet-brown">Matin - Début</Label>
                      <Input
                        type="time"
                        value={schedule.morning_start || "08:00"}
                        onChange={(e) => handleScheduleChange(day.value, 'morning_start', e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-vet-brown">Matin - Fin</Label>
                      <Input
                        type="time"
                        value={schedule.morning_end || "12:00"}
                        onChange={(e) => handleScheduleChange(day.value, 'morning_end', e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-vet-brown">Après-midi - Début</Label>
                      <Input
                        type="time"
                        value={schedule.afternoon_start || "14:00"}
                        onChange={(e) => handleScheduleChange(day.value, 'afternoon_start', e.target.value)}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-vet-brown">Après-midi - Fin</Label>
                      <Input
                        type="time"
                        value={schedule.afternoon_end || "18:00"}
                        onChange={(e) => handleScheduleChange(day.value, 'afternoon_end', e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
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
