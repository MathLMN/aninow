
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { VeterinarianSchedule, useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";

const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAYS_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

interface VeterinarianWeeklyScheduleProps {
  veterinarian: {
    id: string;
    name: string;
  };
  schedules: VeterinarianSchedule[];
}

export const VeterinarianWeeklySchedule: React.FC<VeterinarianWeeklyScheduleProps> = ({
  veterinarian,
  schedules
}) => {
  const { updateSchedule } = useVeterinarianSchedules();
  const [isSaving, setIsSaving] = useState(false);
  const [weekSchedule, setWeekSchedule] = useState<Record<number, VeterinarianSchedule>>(() => {
    const scheduleMap: Record<number, VeterinarianSchedule> = {};
    
    // Initialiser avec les horaires existants ou des valeurs par défaut
    for (let day = 1; day <= 7; day++) {
      const dayKey = day === 7 ? 0 : day; // Dimanche = 0
      const existingSchedule = schedules.find(s => s.day_of_week === dayKey);
      scheduleMap[dayKey] = existingSchedule || {
        veterinarian_id: veterinarian.id,
        day_of_week: dayKey,
        is_working: day <= 5, // Lundi-Vendredi par défaut
        morning_start: '08:00',
        morning_end: '12:00',
        afternoon_start: '14:00',
        afternoon_end: '18:00'
      };
    }
    
    return scheduleMap;
  });

  const handleDayToggle = (dayKey: number, isWorking: boolean) => {
    setWeekSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        is_working: isWorking
      }
    }));
  };

  const handleTimeChange = (dayKey: number, field: keyof VeterinarianSchedule, value: string) => {
    setWeekSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const schedule of Object.values(weekSchedule)) {
        await updateSchedule(schedule);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-vet-navy text-lg flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Dr. {veterinarian.name}
          </CardTitle>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="bg-vet-sage hover:bg-vet-sage/90"
          >
            <Save className="h-3 w-3 mr-1" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Grille des jours de la semaine */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {DAYS_SHORT.map((dayShort, index) => {
            const dayKey = index === 6 ? 0 : index + 1; // Dimanche = 0
            const dayFull = DAYS_FULL[index];
            const schedule = weekSchedule[dayKey];
            
            return (
              <div key={dayKey} className="text-center">
                <div className="flex flex-col items-center space-y-2 p-2 border rounded-lg">
                  <Label className="text-xs font-medium">{dayShort}</Label>
                  <Switch
                    checked={schedule.is_working}
                    onCheckedChange={(checked) => handleDayToggle(dayKey, checked)}
                    className="scale-75"
                  />
                  <span className="text-xs text-muted-foreground">
                    {schedule.is_working ? 'Travail' : 'Repos'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Horaires pour les jours travaillés */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Horaires du matin */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Matin (jours travaillés)</Label>
              <div className="flex space-x-2">
                <Input
                  type="time"
                  value={weekSchedule[1]?.morning_start || '08:00'}
                  onChange={(e) => {
                    // Appliquer à tous les jours travaillés
                    const newTime = e.target.value;
                    Object.keys(weekSchedule).forEach(dayStr => {
                      const dayKey = parseInt(dayStr);
                      if (weekSchedule[dayKey].is_working) {
                        handleTimeChange(dayKey, 'morning_start', newTime);
                      }
                    });
                  }}
                  className="flex-1"
                />
                <span className="flex items-center px-2">à</span>
                <Input
                  type="time"
                  value={weekSchedule[1]?.morning_end || '12:00'}
                  onChange={(e) => {
                    const newTime = e.target.value;
                    Object.keys(weekSchedule).forEach(dayStr => {
                      const dayKey = parseInt(dayStr);
                      if (weekSchedule[dayKey].is_working) {
                        handleTimeChange(dayKey, 'morning_end', newTime);
                      }
                    });
                  }}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Horaires de l'après-midi */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Après-midi (jours travaillés)</Label>
              <div className="flex space-x-2">
                <Input
                  type="time"
                  value={weekSchedule[1]?.afternoon_start || '14:00'}
                  onChange={(e) => {
                    const newTime = e.target.value;
                    Object.keys(weekSchedule).forEach(dayStr => {
                      const dayKey = parseInt(dayStr);
                      if (weekSchedule[dayKey].is_working) {
                        handleTimeChange(dayKey, 'afternoon_start', newTime);
                      }
                    });
                  }}
                  className="flex-1"
                />
                <span className="flex items-center px-2">à</span>
                <Input
                  type="time"
                  value={weekSchedule[1]?.afternoon_end || '18:00'}
                  onChange={(e) => {
                    const newTime = e.target.value;
                    Object.keys(weekSchedule).forEach(dayStr => {
                      const dayKey = parseInt(dayStr);
                      if (weekSchedule[dayKey].is_working) {
                        handleTimeChange(dayKey, 'afternoon_end', newTime);
                      }
                    });
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            💡 Les horaires s'appliquent automatiquement à tous les jours travaillés. 
            Utilisez les boutons ci-dessus pour définir les jours de repos.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
