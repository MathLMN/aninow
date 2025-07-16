
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
}

export const DateSlotCard = ({
  date,
  slots,
  veterinarians,
  selectedSlot,
  onSlotSelect,
  isExpanded = false
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
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot?.date === date && 
                                 selectedSlot?.time === slot.time && 
                                 selectedSlot?.veterinarianId === slot.veterinarian_id;
                
                const veterinarian = veterinarians.find(v => v.id === slot.veterinarian_id);
                
                return (
                  <Button
                    key={`${date}-${slot.time}-${slot.veterinarian_id}`}
                    variant="outline"
                    className={cn(
                      "h-auto p-3 flex flex-col items-center text-center transition-all duration-200 border-2",
                      isSelected
                        ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage shadow-md" 
                        : "bg-vet-blue/10 border-vet-blue/30 text-vet-navy hover:bg-vet-sage/20 hover:border-vet-sage/50"
                    )}
                    onClick={() => onSlotSelect(date, slot.time, slot.veterinarian_id)}
                  >
                    <div className="flex items-center mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="font-semibold text-sm">{slot.time}</span>
                    </div>
                    {veterinarian && (
                      <span className="text-xs opacity-80 truncate max-w-full leading-tight">
                        {veterinarian.name}
                      </span>
                    )}
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
