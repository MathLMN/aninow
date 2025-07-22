
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Stethoscope, Clock, Save } from "lucide-react";
import { VeterinarianSchedule, useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";

const DAYS_OF_WEEK = [
  { key: 0, label: 'Dimanche' },
  { key: 1, label: 'Lundi' },
  { key: 2, label: 'Mardi' },
  { key: 3, label: 'Mercredi' },
  { key: 4, label: 'Jeudi' },
  { key: 5, label: 'Vendredi' },
  { key: 6, label: 'Samedi' }
];

interface VeterinarianScheduleCardProps {
  veterinarian: {
    id: string;
    name: string;
  };
  schedules: VeterinarianSchedule[];
}

export const VeterinarianScheduleCard: React.FC<VeterinarianScheduleCardProps> = ({
  veterinarian,
  schedules
}) => {
  const { updateSchedule } = useVeterinarianSchedules();
  const [isSaving, setIsSaving] = useState(false);
  const [localSchedules, setLocalSchedules] = useState<Record<number, VeterinarianSchedule>>(() => {
    const scheduleMap: Record<number, VeterinarianSchedule> = {};
    
    // Initialiser avec les horaires existants ou des valeurs par défaut
    DAYS_OF_WEEK.forEach(day => {
      const existingSchedule = schedules.find(s => s.day_of_week === day.key);
      scheduleMap[day.key] = existingSchedule || {
        veterinarian_id: veterinarian.id,
        day_of_week: day.key,
        is_working: false,
        morning_start: '08:00',
        morning_end: '12:00',
        afternoon_start: '14:00',
        afternoon_end: '18:00'
      };
    });
    
    return scheduleMap;
  });

  const handleScheduleChange = (dayKey: number, field: keyof VeterinarianSchedule, value: any) => {
    setLocalSchedules(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }));
  };

  const handleSaveSchedules = async () => {
    setIsSaving(true);
    try {
      for (const schedule of Object.values(localSchedules)) {
        await updateSchedule(schedule);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-vet-navy flex items-center">
          <Stethoscope className="h-5 w-5 mr-2" />
          Dr. {veterinarian.name}
        </CardTitle>
        <Button
          onClick={handleSaveSchedules}
          disabled={isSaving}
          size="sm"
          variant="outline"
          className="text-vet-sage border-vet-sage hover:bg-vet-sage hover:text-white"
        >
          <Save className="h-4 w-4 mr-1" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const schedule = localSchedules[day.key];
            return (
              <div key={day.key} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={schedule.is_working}
                    onCheckedChange={(checked) => handleScheduleChange(day.key, 'is_working', checked)}
                  />
                  <Label className="font-semibold">{day.label}</Label>
                </div>
                
                {schedule.is_working && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Matin
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          type="time"
                          value={schedule.morning_start || ''}
                          onChange={(e) => handleScheduleChange(day.key, 'morning_start', e.target.value)}
                          className="flex-1"
                        />
                        <span className="flex items-center px-2">à</span>
                        <Input
                          type="time"
                          value={schedule.morning_end || ''}
                          onChange={(e) => handleScheduleChange(day.key, 'morning_end', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Après-midi
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          type="time"
                          value={schedule.afternoon_start || ''}
                          onChange={(e) => handleScheduleChange(day.key, 'afternoon_start', e.target.value)}
                          className="flex-1"
                        />
                        <span className="flex items-center px-2">à</span>
                        <Input
                          type="time"
                          value={schedule.afternoon_end || ''}
                          onChange={(e) => handleScheduleChange(day.key, 'afternoon_end', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
