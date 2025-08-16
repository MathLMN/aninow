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
  compact?: boolean;
}

export const EnhancedDateNavigation = ({
  selectedDate,
  onDateChange,
  compact = false
}: EnhancedDateNavigationProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  if (compact) {
    return (
      <div className="space-y-2 h-full flex flex-col">
        {/* Navigation avec flèches et date - ultra compact */}
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('prev')}
            className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white h-6 w-6 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          
          <div className="text-center flex-1 mx-1">
            <h3 className="text-[10px] font-semibold text-vet-navy leading-tight">
              {format(selectedDate, 'EEE d MMM', { locale: fr })}
            </h3>
            <p className="text-[8px] text-vet-brown">
              8h-12h / 14h-19h
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('next')}
            className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white h-6 w-6 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateChange(new Date())}
          className="w-full text-vet-blue hover:bg-vet-blue/10 h-6 text-[10px] mb-2"
        >
          Aujourd'hui
        </Button>

        {/* Calendrier compact dans l'espace restant */}
        <div className="flex-1 border border-vet-blue/30 rounded-lg overflow-hidden min-h-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
              }
            }}
            locale={fr}
            className={cn("p-1 pointer-events-auto w-full h-full")}
            classNames={{
              months: "flex flex-col h-full",
              month: "space-y-1 w-full flex-1 flex flex-col",
              caption: "flex justify-center pt-0.5 relative items-center text-[10px] font-medium text-vet-navy",
              caption_label: "text-[10px] font-medium text-vet-navy",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-4 w-4 bg-transparent p-0 opacity-70 hover:opacity-100 border border-vet-blue/30 text-vet-navy hover:bg-vet-blue/10"
              ),
              nav_button_previous: "absolute left-0.5",
              nav_button_next: "absolute right-0.5",
              table: "w-full border-collapse flex-1",
              head_row: "flex w-full",
              head_cell: "text-vet-brown rounded-md w-5 font-normal text-[8px] flex-1 text-center p-0",
              row: "flex w-full mt-0.5",
              cell: "h-5 w-5 text-center text-xs p-0 relative flex-1",
              day: cn(
                "h-5 w-full p-0 font-normal aria-selected:opacity-100 text-[8px] hover:bg-vet-blue/10 rounded"
              ),
              day_selected: "bg-vet-blue text-white hover:bg-vet-blue hover:text-white focus:bg-vet-blue focus:text-white",
              day_today: "bg-vet-sage/20 text-vet-navy font-medium",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
            }}
            weekStartsOn={1}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateDay('prev')}
        className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateDay('next')}
        className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDateChange(new Date())}
        className="text-vet-blue hover:bg-vet-blue/10"
      >
        Aujourd'hui
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border-vet-blue text-vet-blue hover:bg-vet-blue/10"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
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
            locale={fr}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
