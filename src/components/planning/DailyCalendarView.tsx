
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
}

export const DailyCalendarView = ({
  selectedDate,
  onDateChange,
  bookings,
  veterinarians,
  onCreateAppointment,
  onAppointmentClick
}: DailyCalendarViewProps) => {
  const { settings } = useClinicSettings();

  console.log('DailyCalendarView - Veterinarians received:', veterinarians);
  console.log('DailyCalendarView - Settings:', settings);

  const daySchedule = getDaySchedule(selectedDate, settings);
  const columns = generateColumns(veterinarians, settings);
  const scheduleInfo = getScheduleInfo(daySchedule);

  console.log('DailyCalendarView - Columns generated:', columns);

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
      />
    </div>
  );
};
