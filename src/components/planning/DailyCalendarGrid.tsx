
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TimeSlotCell } from "./TimeSlotCell";
import { generateAllTimeSlots, isTimeSlotOpen, getBookingsForSlot } from "./utils/scheduleUtils";

interface DailyCalendarGridProps {
  selectedDate: Date;
  bookings: any[];
  columns: any[];
  daySchedule: any;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
}

export const DailyCalendarGrid = ({
  selectedDate,
  bookings,
  columns,
  daySchedule,
  onCreateAppointment,
  onAppointmentClick
}: DailyCalendarGridProps) => {
  const timeSlots = generateAllTimeSlots();

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* En-tête des colonnes */}
            <div className={`grid border-b border-vet-blue/20 bg-vet-beige/30`} style={{gridTemplateColumns: `120px repeat(${columns.length}, 1fr)`}}>
              <div className="p-4 font-semibold text-vet-navy text-center border-r border-vet-blue/20">
                Horaires (24h)
              </div>
              {columns.map((column) => (
                <div key={column.id} className="p-4 text-center border-l border-vet-blue/20">
                  <div className={`font-semibold ${column.type === 'asv' ? 'text-vet-sage' : 'text-vet-navy'}`}>
                    {column.title}
                  </div>
                  <div className="text-xs text-vet-brown mt-1">
                    {getBookingsForSlot('', column.id, bookings, selectedDate).length} RDV
                  </div>
                </div>
              ))}
            </div>

            {/* Grille horaire 24h */}
            <div className="relative">
              {timeSlots.map((time, timeIndex) => {
                const isOpen = isTimeSlotOpen(time, daySchedule);
                const [hours] = time.split(':').map(Number);
                const isHourMark = timeIndex % 4 === 0; // Toutes les heures
                
                return (
                  <div 
                    key={time} 
                    className={cn(
                      `grid border-b min-h-[40px]`,
                      isHourMark ? 'border-vet-blue/30' : 'border-vet-blue/10',
                      !isOpen && 'bg-gray-50/80' // Griser les périodes fermées
                    )} 
                    style={{gridTemplateColumns: `120px repeat(${columns.length}, 1fr)`}}
                  >
                    {/* Colonne horaire */}
                    <div className={cn(
                      "p-2 text-sm text-center font-medium border-r border-vet-blue/20 flex items-center justify-center",
                      isOpen ? "bg-vet-beige/10 text-vet-brown" : "bg-gray-100 text-gray-400",
                      isHourMark && "font-semibold"
                    )}>
                      <span>{time}</span>
                    </div>
                    
                    {/* Colonnes par vétérinaire/ASV */}
                    {columns.map((column) => {
                      const slotBookings = getBookingsForSlot(time, column.id, bookings, selectedDate);
                      const canBook = isOpen && daySchedule.isOpen;
                      
                      return (
                        <TimeSlotCell
                          key={`${column.id}-${time}`}
                          time={time}
                          columnId={column.id}
                          bookings={slotBookings}
                          isOpen={isOpen}
                          canBook={canBook}
                          onCreateAppointment={onCreateAppointment}
                          onAppointmentClick={onAppointmentClick}
                          selectedDate={selectedDate}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
