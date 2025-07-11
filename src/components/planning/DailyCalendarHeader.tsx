
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DailyCalendarHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  scheduleInfo: string;
}

export const DailyCalendarHeader = ({
  selectedDate,
  onDateChange,
  scheduleInfo
}: DailyCalendarHeaderProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Navigation journalière */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('prev')}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-vet-navy">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </h2>
              <p className="text-sm text-vet-brown">
                {scheduleInfo}
              </p>
            </div>
            
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
          </div>

          {/* Calendrier mensuel */}
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
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};
