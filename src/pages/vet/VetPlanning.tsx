import { useState } from "react";
import { DailyCalendarView } from "@/components/planning/DailyCalendarView";
import { WeeklyCalendarView } from "@/components/planning/WeeklyCalendarView";
import { PlanningHeader } from "@/components/planning/PlanningHeader";
import { CreateAppointmentModal } from "@/components/planning/CreateAppointmentModal";
import { PendingBookingsNotification } from "@/components/planning/PendingBookingsNotification";
import { useVetBookings } from "@/hooks/useVetBookings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { usePlanningActions } from "@/hooks/usePlanningActions";
import { useIsMobile } from "@/hooks/use-mobile";

export default function VetPlanning() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
  const [createModalDefaultData, setCreateModalDefaultData] = useState<any>(null);

  const { bookings, refreshBookings } = useVetBookings();
  const { veterinarians } = useClinicVeterinarians();
  const isMobile = useIsMobile();

  const {
    validateBooking,
    cancelBooking,
    duplicateBooking,
    moveAppointment,
    deleteBooking,
    handleBlockSlot
  } = usePlanningActions();

  const handleCreateAppointment = (timeSlot: { date: string; time: string; veterinarian?: string }) => {
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
    handleAppointmentClick(booking);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const success = await deleteBooking(bookingId);
    if (success) {
      refreshBookings();
    }
  };

  const todayBookings = bookings.filter(booking => {
    if (viewMode === 'daily') {
      const bookingDate = new Date(booking.appointment_date);
      return bookingDate.toDateString() === selectedDate.toDateString();
    }
    return true;
  });

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5 flex flex-col">
      {/* Layout pleine largeur optimisé */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Sidebar - masqué sur mobile et tablette, visible sur desktop */}
        {!isMobile && (
          <div className="hidden xl:flex xl:w-64 2xl:w-72 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm border-r border-vet-blue/30 w-full flex flex-col">
              {/* Header avec notification */}
              <div className="flex items-center justify-between p-3 border-b border-vet-blue/20">
                <h3 className="font-semibold text-vet-navy text-sm">Navigation</h3>
                <PendingBookingsNotification />
              </div>
              
              {/* Contenu de navigation */}
              <div className="flex-1 p-3 overflow-hidden">
                {viewMode === 'daily' ? (
                  <DailyCalendarView
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    bookings={todayBookings}
                    veterinarians={veterinarians}
                    onCreateAppointment={handleCreateAppointment}
                    onAppointmentClick={handleAppointmentClick}
                    onValidateBooking={handleValidateBooking}
                    onCancelBooking={handleCancelBooking}
                    onDuplicateBooking={handleDuplicateBooking}
                    onMoveBooking={handleMoveBooking}
                    onDeleteBooking={handleDeleteBooking}
                    onBlockSlot={handleBlockSlot}
                    sidebarMode={true}
                  />
                ) : (
                  <WeeklyCalendarView
                    weekDates={weekDates}
                    bookings={bookings}
                    veterinarians={veterinarians}
                    filters={{ veterinarian: 'all', status: 'all' }}
                    isLoading={false}
                    onCreateAppointment={handleCreateAppointment}
                    onAppointmentClick={handleAppointmentClick}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Zone principale - utilise toute la largeur disponible */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header de planning - pleine largeur */}
          <div className="flex-shrink-0 px-2 sm:px-4 py-2 bg-white/50 backdrop-blur-sm border-b border-vet-blue/20">
            <PlanningHeader
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedDate={selectedDate}
            />
          </div>

          {/* Contenu du planning principal - pleine largeur, hauteur optimisée */}
          <div className="flex-1 min-h-0 px-1 sm:px-2 py-1 sm:py-2">
            <div className="h-full">
              {viewMode === 'daily' ? (
                <DailyCalendarView
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  bookings={todayBookings}
                  veterinarians={veterinarians}
                  onCreateAppointment={handleCreateAppointment}
                  onAppointmentClick={handleAppointmentClick}
                  onValidateBooking={handleValidateBooking}
                  onCancelBooking={handleCancelBooking}
                  onDuplicateBooking={handleDuplicateBooking}
                  onMoveBooking={handleMoveBooking}
                  onDeleteBooking={handleDeleteBooking}
                  onBlockSlot={handleBlockSlot}
                  mainViewMode={true}
                />
              ) : (
                <WeeklyCalendarView
                  weekDates={weekDates}
                  bookings={bookings}
                  veterinarians={veterinarians}
                  filters={{ veterinarian: 'all', status: 'all' }}
                  isLoading={false}
                  onCreateAppointment={handleCreateAppointment}
                  onAppointmentClick={handleAppointmentClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        defaultData={createModalDefaultData}
        appointmentToEdit={appointmentToEdit}
        veterinarians={veterinarians}
        consultationTypes={[]}
      />
    </div>
  );
}
