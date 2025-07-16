
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  veterinarian_id: string;
  available: boolean;
  blocked: boolean;
  availableVeterinarians?: string[]; // Nouveau : liste des vétérinaires disponibles pour ce créneau
}

interface DateSlotCardProps {
  date: string;
  slots: TimeSlot[];
  veterinarians: Array<{
    id: string;
    name: string;
    specialty?: string;
  }>;
  selectedSlot: {date: string, time: string, veterinarianId: string} | null;
  onSlotSelect: (date: string, time: string, veterinarianId: string) => void;
  isExpanded?: boolean;
  noVeterinarianPreference?: boolean; // Nouveau : indique si aucune préférence de vétérinaire
}

export const DateSlotCard = ({
  date,
  slots,
  veterinarians,
  selectedSlot,
  onSlotSelect,
  isExpanded = false,
  noVeterinarianPreference = false
}: DateSlotCardProps) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const availableSlots = slots.filter(slot => slot.available);

  const handleSlotClick = (slot: TimeSlot) => {
    if (noVeterinarianPreference && slot.availableVeterinarians && slot.availableVeterinarians.length > 0) {
      // Si pas de préférence, prendre le premier vétérinaire disponible
      onSlotSelect(date, slot.time, slot.availableVeterinarians[0]);
    } else {
      // Si préférence spécifique, utiliser le vétérinaire du créneau
      onSlotSelect(date, slot.time, slot.veterinarian_id);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-sm">
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full justify-between p-4 sm:p-6 h-auto text-left hover:bg-vet-beige/30"
          onClick={handleToggle}
        >
          <div className="flex flex-col items-start">
            <h3 className="text-base sm:text-lg font-semibold text-vet-navy">
              {formatDate(date)}
            </h3>
            <p className="text-xs sm:text-sm text-vet-brown mt-1">
              {availableSlots.length} créneau{availableSlots.length > 1 ? 'x' : ''} disponible{availableSlots.length > 1 ? 's' : ''}
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-vet-blue flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-vet-blue flex-shrink-0" />
          )}
        </Button>

        {expanded && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot?.date === date && 
                                 selectedSlot?.time === slot.time;
                
                return (
                  <Button
                    key={`${date}-${slot.time}-${slot.veterinarian_id}`}
                    variant="outline"
                    className={cn(
                      "h-auto p-3 flex items-center justify-center text-center transition-all duration-200 border-2",
                      isSelected
                        ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage shadow-md" 
                        : "bg-vet-blue/10 border-vet-blue/30 text-vet-navy hover:bg-vet-sage/20 hover:border-vet-sage/50"
                    )}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      <span className="font-semibold text-sm">{slot.time}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
