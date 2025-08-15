
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface EnhancedDateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const EnhancedDateNavigation = ({
  selectedDate,
  onDateChange
}: EnhancedDateNavigationProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const goToYesterday = () => {
    const yesterday = new Date(selectedDate);
    yesterday.setDate(selectedDate.getDate() - 1);
    onDateChange(yesterday);
  };

  const goToTomorrow = () => {
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(selectedDate.getDate() + 1);
    onDateChange(tomorrow);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center gap-2">
      {/* Navigation rapide avec flèches */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={goToYesterday}
          className="h-8 w-8 p-0"
          title="Jour précédent"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs px-2"
        >
          Aujourd'hui
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToTomorrow}
          className="h-8 w-8 p-0"
          title="Jour suivant"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Séparateur */}
      <div className="h-6 w-px bg-border" />

      {/* Calendrier pour navigation avancée */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendrier
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
                setIsCalendarOpen(false);
              }
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
