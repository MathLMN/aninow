
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Trash2, CalendarIcon } from "lucide-react";
import { VeterinarianAbsence, useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { format, parseISO, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface VeterinarianAbsenceCalendarProps {
  veterinarian: {
    id: string;
    name: string;
  };
  absences: any[];
}

export const VeterinarianAbsenceCalendar: React.FC<VeterinarianAbsenceCalendarProps> = ({
  veterinarian,
  absences
}) => {
  const { addAbsence, deleteAbsence } = useVeterinarianAbsences();
  const [selectedStartDate, setSelectedStartDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [absenceType, setAbsenceType] = useState('vacation');
  const [reason, setReason] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAbsence = async () => {
    if (!selectedStartDate || !selectedEndDate) return;

    setIsAdding(true);
    try {
      const success = await addAbsence({
        veterinarian_id: veterinarian.id,
        start_date: format(selectedStartDate, 'yyyy-MM-dd'),
        end_date: format(selectedEndDate, 'yyyy-MM-dd'),
        absence_type: absenceType,
        reason: reason,
        is_recurring: false
      });

      if (success) {
        setSelectedStartDate(undefined);
        setSelectedEndDate(undefined);
        setReason('');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const getAbsenceTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      'vacation': { label: 'Vacances', color: 'bg-blue-100 text-blue-800' },
      'sick': { label: 'Maladie', color: 'bg-red-100 text-red-800' },
      'training': { label: 'Formation', color: 'bg-green-100 text-green-800' },
      'other': { label: 'Autre', color: 'bg-gray-100 text-gray-800' }
    };
    return types[type] || types['other'];
  };

  const isDateInAbsence = (date: Date) => {
    return absences.some(absence => {
      const startDate = parseISO(absence.start_date);
      const endDate = parseISO(absence.end_date);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  const modifiers = {
    absence: (date: Date) => isDateInAbsence(date),
    selected: (date: Date) => {
      if (selectedStartDate && !selectedEndDate) {
        return date.getTime() === selectedStartDate.getTime();
      }
      if (selectedStartDate && selectedEndDate) {
        return isWithinInterval(date, { start: selectedStartDate, end: selectedEndDate });
      }
      return false;
    }
  };

  const modifiersClassNames = {
    absence: "bg-red-100 text-red-900 font-medium",
    selected: "bg-vet-sage text-white"
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Nouveau début de sélection
      setSelectedStartDate(date);
      setSelectedEndDate(undefined);
    } else if (selectedStartDate && !selectedEndDate) {
      // Fin de sélection
      if (date >= selectedStartDate) {
        setSelectedEndDate(date);
      } else {
        // Si on clique sur une date antérieure, on recommence
        setSelectedStartDate(date);
        setSelectedEndDate(undefined);
      }
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy text-lg flex items-center">
          <CalendarDays className="h-4 w-4 mr-2" />
          Absences - Dr. {veterinarian.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout rapide */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-4 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une absence
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-sm">Type d'absence</Label>
              <Select value={absenceType} onValueChange={setAbsenceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacances</SelectItem>
                  <SelectItem value="sick">Maladie</SelectItem>
                  <SelectItem value="training">Formation</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-sm">Motif (optionnel)</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Détails de l'absence..."
              />
            </div>
          </div>

          {selectedStartDate && (
            <div className="mb-4 p-2 bg-vet-sage/10 rounded border-l-4 border-vet-sage">
              <div className="text-sm">
                <strong>Période sélectionnée :</strong> {format(selectedStartDate, 'dd/MM/yyyy', { locale: fr })}
                {selectedEndDate && selectedEndDate !== selectedStartDate && 
                  ` → ${format(selectedEndDate, 'dd/MM/yyyy', { locale: fr })}`
                }
              </div>
            </div>
          )}

          <Button
            onClick={handleAddAbsence}
            disabled={!selectedStartDate || !selectedEndDate || isAdding}
            className="w-full bg-vet-sage hover:bg-vet-sage/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? 'Ajout en cours...' : 'Ajouter cette absence'}
          </Button>
        </div>

        {/* Calendrier */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedStartDate}
            onSelect={handleDateSelect}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border"
            locale={fr}
          />
        </div>

        <div className="text-xs text-muted-foreground text-center">
          💡 Cliquez sur une date de début, puis sur une date de fin pour sélectionner une période d'absence
        </div>

        {/* Liste des absences */}
        {absences.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Absences programmées</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {absences.map((absence) => {
                const typeInfo = getAbsenceTypeLabel(absence.absence_type);
                return (
                  <div key={absence.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <Badge className={typeInfo.color}>
                        {typeInfo.label}
                      </Badge>
                      <span className="text-sm">
                        {format(parseISO(absence.start_date), 'dd/MM/yy')} - {format(parseISO(absence.end_date), 'dd/MM/yy')}
                      </span>
                      {absence.reason && (
                        <span className="text-xs text-muted-foreground">
                          ({absence.reason})
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAbsence(absence.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
