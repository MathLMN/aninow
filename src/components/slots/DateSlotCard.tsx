
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, Sun, Moon } from "lucide-react";
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
  onSlotSelect: (date: string, time: string, veterinarianId: string | string[]) => void;
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
    if (!slot.available || slot.blocked) return;
    
    // Passer tous les vétérinaires disponibles ou juste l'ID
    const vetId = slot.availableVeterinarians || slot.veterinarian_id;
    onSlotSelect(date, slot.time, vetId);
  };

  // Séparer les créneaux en matin et après-midi
  const separateSlots = (slots: TimeSlot[]) => {
    const morningSlots = slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour < 12;
    });

    const afternoonSlots = slots.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      return hour >= 12;
    });

    return { morningSlots, afternoonSlots };
  };

  const { morningSlots, afternoonSlots } = separateSlots(availableSlots);

  const renderSlotSection = (sectionSlots: TimeSlot[], title: string, icon: any) => {
    if (sectionSlots.length === 0) return null;

    const IconComponent = icon;

    return (
      <div className="mb-4 last:mb-0">
        <div className="flex items-center mb-2">
          <IconComponent className="h-4 w-4 mr-2 text-vet-brown" />
          <h4 className="text-sm font-medium text-vet-brown">{title}</h4>
          <span className="ml-2 text-xs text-vet-brown/70">
            ({sectionSlots.length} créneau{sectionSlots.length > 1 ? 'x' : ''})
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {sectionSlots.map((slot) => {
            const isSelected = selectedSlot?.date === date && 
                             selectedSlot?.time === slot.time;
            
            return (
              <Button
                key={slot.availableVeterinarians ? `${slot.time}-multi` : `${slot.time}-${slot.veterinarian_id}`}
                variant="outline"
                className={cn(
                  "h-auto p-3 flex flex-col items-center justify-center text-center transition-all duration-200 border-2",
                  isSelected
                    ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage shadow-md" 
                    : "bg-vet-blue/10 border-vet-blue/30 text-vet-navy hover:bg-vet-sage/20 hover:border-vet-sage/50"
                )}
                onClick={() => handleSlotClick(slot)}
              >
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="font-semibold text-sm">{slot.time}</span>
                </div>
                {slot.availableVeterinarians && slot.availableVeterinarians.length > 1 && noVeterinarianPreference && (
                  <span className="text-[10px] opacity-60 mt-0.5">
                    {slot.availableVeterinarians.length} dispos
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
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
            {renderSlotSection(morningSlots, "Matin", Sun)}
            {renderSlotSection(afternoonSlots, "Après-midi", Moon)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
