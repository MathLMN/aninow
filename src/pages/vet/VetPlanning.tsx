import { useState } from "react";
import { DailyCalendarView } from "@/components/planning/DailyCalendarView";
import { WeeklyCalendarView } from "@/components/planning/WeeklyCalendarView";
import { PlanningHeader } from "@/components/planning/PlanningHeader";
import { CreateAppointmentModal } from "@/components/planning/CreateAppointmentModal";
import { PendingBookingsNotification } from "@/components/planning/PendingBookingsNotification";
import { useVetBookings } from "@/hooks/useVetBookings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { usePlanningActions } from "@/hooks/usePlanningActions";
export default function VetPlanning() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
  const [createModalDefaultData, setCreateModalDefaultData] = useState<any>(null);
  const {
    bookings,
    refreshBookings
  } = useVetBookings();
  const {
    veterinarians
  } = useClinicVeterinarians();
  const {
    validateBooking,
    cancelBooking,
    duplicateBooking,
    moveAppointment,
    deleteBooking,
    handleBlockSlot
  } = usePlanningActions();
  const handleCreateAppointment = (timeSlot: {
    date: string;
    time: string;
    veterinarian?: string;
  }) => {
    console.log('🎯 Opening create modal with time slot:', timeSlot);
    setCreateModalDefaultData(timeSlot);
    setAppointmentToEdit(null);
    setIsCreateModalOpen(true);
  };
  const handleAppointmentClick = (appointment: any) => {
    console.log('🎯 Opening edit modal for appointment:', appointment);
    setAppointmentToEdit(appointment);
    setCreateModalDefaultData(null);
    setIsCreateModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setCreateModalDefaultData(null);
    setAppointmentToEdit(null);
    refreshBookings();
  };

  // Wrapper functions to match expected signatures
  const handleValidateBooking = async (bookingId: string) => {
    const success = await validateBooking(bookingId);
    if (success) {
      refreshBookings();
    }
  };
  const handleCancelBooking = async (bookingId: string) => {
    const success = await cancelBooking(bookingId);
    if (success) {
      refreshBookings();
    }
  };
  const handleDuplicateBooking = async (booking: any) => {
    const success = await duplicateBooking(booking);
    if (success) {
      refreshBookings();
    }
  };
  const handleMoveBooking = async (booking: any) => {
    // For now, we'll handle move through the edit modal
    // This could be enhanced later with a dedicated move interface
    handleAppointmentClick(booking);
  };
  const handleDeleteBooking = async (bookingId: string) => {
    const success = await deleteBooking(bookingId);
    if (success) {
      refreshBookings();
    }
  };

  // Filter bookings for selected date (daily view)
  const todayBookings = bookings.filter(booking => {
    if (viewMode === 'daily') {
      const bookingDate = new Date(booking.appointment_date);
      return bookingDate.toDateString() === selectedDate.toDateString();
    }
    return true;
  });

  // Get week dates for weekly view
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };
  const weekDates = getWeekDates(selectedDate);
  return <div className="h-screen bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5 flex flex-col">
      {/* Fixed layout container */}
      <div className="flex-1 flex pt-16 pb-16 overflow-hidden">
        {/* Left sidebar with date navigation - Fixed */}
        <div className="w-80 flex-shrink-0 p-4 space-y-4">
          {/* Date navigation panel */}
          
        </div>

        {/* Right main content area - Fixed headers with scrollable content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Planning content */}
          <div className="flex-1 p-4">
            {viewMode === 'daily' ? <DailyCalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} bookings={todayBookings} veterinarians={veterinarians} onCreateAppointment={handleCreateAppointment} onAppointmentClick={handleAppointmentClick} onValidateBooking={handleValidateBooking} onCancelBooking={handleCancelBooking} onDuplicateBooking={handleDuplicateBooking} onMoveBooking={handleMoveBooking} onDeleteBooking={handleDeleteBooking} onBlockSlot={handleBlockSlot} mainViewMode={true} /> : <WeeklyCalendarView weekDates={weekDates} bookings={bookings} veterinarians={veterinarians} filters={{
            veterinarian: 'all',
            status: 'all'
          }} isLoading={false} onCreateAppointment={handleCreateAppointment} onAppointmentClick={handleAppointmentClick} />}
          </div>
        </div>
      </div>

      {/* Fixed bottom planning header */}
      <PlanningHeader viewMode={viewMode} onViewModeChange={setViewMode} selectedDate={selectedDate} />

      <CreateAppointmentModal isOpen={isCreateModalOpen} onClose={handleCloseModal} defaultData={createModalDefaultData} appointmentToEdit={appointmentToEdit} veterinarians={veterinarians} consultationTypes={[]} />
    </div>;
}