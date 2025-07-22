
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
        {/* Configuration détaillée par jour */}
        <div className="space-y-4">
          {DAYS_FULL.map((dayFull, index) => {
            const dayKey = index === 6 ? 0 : index + 1; // Dimanche = 0
            const dayShort = DAYS_SHORT[index];
            const schedule = weekSchedule[dayKey];
            
            return (
              <div key={dayKey} className="border rounded-lg p-4 bg-gray-50">
                {/* En-tête du jour */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-vet-blue/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-vet-navy">{dayShort}</span>
                    </div>
                    <Label className="font-medium text-vet-navy">{dayFull}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {schedule.is_working ? 'Jour travaillé' : 'Jour de repos'}
                    </span>
                    <Switch
                      checked={schedule.is_working}
                      onCheckedChange={(checked) => handleDayToggle(dayKey, checked)}
                    />
                  </div>
                </div>

                {/* Horaires si jour travaillé */}
                {schedule.is_working && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Matin */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-vet-brown">Matin</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="time"
                          value={schedule.morning_start || '08:00'}
                          onChange={(e) => handleTimeChange(dayKey, 'morning_start', e.target.value)}
                          className="flex-1"
                        />
                        <span className="flex items-center px-2 text-sm text-muted-foreground">à</span>
                        <Input
                          type="time"
                          value={schedule.morning_end || '12:00'}
                          onChange={(e) => handleTimeChange(dayKey, 'morning_end', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Après-midi */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-vet-brown">Après-midi</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="time"
                          value={schedule.afternoon_start || '14:00'}
                          onChange={(e) => handleTimeChange(dayKey, 'afternoon_start', e.target.value)}
                          className="flex-1"
                        />
                        <span className="flex items-center px-2 text-sm text-muted-foreground">à</span>
                        <Input
                          type="time"
                          value={schedule.afternoon_end || '18:00'}
                          onChange={(e) => handleTimeChange(dayKey, 'afternoon_end', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Message si jour de repos */}
                {!schedule.is_working && (
                  <div className="text-center py-2">
                    <span className="text-sm text-muted-foreground italic">
                      Jour de repos - aucun créneau disponible
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-muted-foreground bg-vet-sage/10 p-3 rounded border-l-4 border-vet-sage">
          💡 <strong>Horaires spéciaux :</strong> Vous pouvez configurer des horaires différents pour chaque jour. 
          Par exemple, si Dr {veterinarian.name} ne travaille pas le mercredi après-midi, 
          laissez les champs après-midi vides ou désactivez complètement le mercredi.
        </div>
      </CardContent>
    </Card>
  );
};
