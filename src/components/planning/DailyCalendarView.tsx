
import { Card, CardContent } from "@/components/ui/card";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { DailyCalendarHeader } from "./DailyCalendarHeader";
import { DailyCalendarGrid } from "./DailyCalendarGrid";
import { getDaySchedule, getScheduleInfo, generateColumns } from "./utils/scheduleUtils";

interface DailyCalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  bookings: any[];
  veterinarians: any[];
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
  // Nouvelles props pour les actions du planning
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onDuplicateBooking?: (booking: any) => void;
  onMoveBooking?: (booking: any) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onBlockSlot?: (timeSlot: { date: string; time: string; veterinarian: string }) => void;
}

export const DailyCalendarView = ({
  selectedDate,
  onDateChange,
  bookings,
  veterinarians,
  onCreateAppointment,
  onAppointmentClick,
  onValidateBooking,
  onCancelBooking,
  onDuplicateBooking,
  onMoveBooking,
  onDeleteBooking,
  onBlockSlot
}: DailyCalendarViewProps) => {
  const { settings } = useClinicSettings();

  console.log('DailyCalendarView - Veterinarians received:', veterinarians);
  console.log('DailyCalendarView - Settings:', settings);

  const daySchedule = getDaySchedule(selectedDate, settings);
  const columns = generateColumns(veterinarians, settings);
  const scheduleInfo = getScheduleInfo(daySchedule);

  console.log('DailyCalendarView - Columns generated:', columns);

  // Si aucun vétérinaire actif, afficher un message
  if (columns.length === 0) {
    return (
      <div className="space-y-4">
        <DailyCalendarHeader
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          scheduleInfo="Aucun vétérinaire actif"
        />
        
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-8 text-center">
            <div className="text-vet-brown">
              <p className="text-lg font-medium mb-2">Aucun vétérinaire actif configuré</p>
              <p>Veuillez ajouter et activer des vétérinaires dans les paramètres pour afficher le planning.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DailyCalendarHeader
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        scheduleInfo={scheduleInfo.message}
      />

      <DailyCalendarGrid
        selectedDate={selectedDate}
        bookings={bookings}
        columns={columns}
        daySchedule={daySchedule}
        onCreateAppointment={onCreateAppointment}
        onAppointmentClick={onAppointmentClick}
        veterinarians={veterinarians}
        onValidateBooking={onValidateBooking}
        onCancelBooking={onCancelBooking}
        onDuplicateBooking={onDuplicateBooking}
        onMoveBooking={onMoveBooking}
        onDeleteBooking={onDeleteBooking}
        onBlockSlot={onBlockSlot}
      />
    </div>
  );
};
