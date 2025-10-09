
import { useState } from "react";
import { DailyCalendarView } from "@/components/planning/DailyCalendarView";
import { WeeklyCalendarView } from "@/components/planning/WeeklyCalendarView";
import { PlanningHeader } from "@/components/planning/PlanningHeader";
import { CreateAppointmentModal } from "@/components/planning/CreateAppointmentModal";
import { CreateNoteModal } from "@/components/planning/CreateNoteModal";
import { PendingBookingsNotification } from "@/components/planning/PendingBookingsNotification";
import { useVetBookings } from "@/hooks/useVetBookings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { usePlanningActions } from "@/hooks/usePlanningActions";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { useAppointmentClipboard } from "@/hooks/useAppointmentClipboard";

export default function VetPlanning() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
  const [createModalDefaultData, setCreateModalDefaultData] = useState<any>(null);
  const [noteModalDefaultData, setNoteModalDefaultData] = useState<any>(null);

  const { bookings, refreshBookings } = useVetBookings();
  const { veterinarians } = useClinicVeterinarians();
  const { consultationTypes } = useSlotManagement();

  const {
    validateBooking,
    cancelBooking,
    deleteBooking,
    handleBlockSlot
  } = usePlanningActions();

  const {
    copyAppointment,
    cutAppointment,
    pasteAppointment,
    clearClipboard,
    hasClipboard,
    getClipboardAppointment
  } = useAppointmentClipboard();

  const handleCreateAppointment = (timeSlot: { date: string; time: string; veterinarian?: string }) => {
    console.log('🎯 Opening create modal with time slot:', timeSlot);
    // S'assurer que les données sont propres (pas de contamination)
    setCreateModalDefaultData({
      date: timeSlot.date,
      time: timeSlot.time,
      veterinarian: timeSlot.veterinarian
    });
    setAppointmentToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateNote = (timeSlot: { date: string; time: string; veterinarian?: string }) => {
    console.log('📝 Opening note modal with time slot:', timeSlot);
    setNoteModalDefaultData({
      date: timeSlot.date,
      time: timeSlot.time,
      veterinarian: timeSlot.veterinarian
    });
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setNoteModalDefaultData(null);
    refreshBookings();
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

  const handleCopyBooking = async (booking: any) => {
    copyAppointment(booking);
  };

  const handleCutBooking = async (booking: any) => {
    console.log('✂️ Cutting booking:', booking.id);
    cutAppointment(booking);
    
    // Supprimer immédiatement le rendez-vous du planning
    const success = await deleteBooking(booking.id);
    if (success) {
      console.log('✅ Appointment cut and removed from original slot');
      refreshBookings();
    } else {
      console.error('❌ Failed to cut appointment');
      clearClipboard(); // Nettoyer le clipboard si la suppression a échoué
    }
  };

  const handlePasteBooking = async (timeSlot: { date: string; time: string; veterinarian?: string }) => {
    const pasteResult = pasteAppointment(timeSlot);
    if (pasteResult) {
      console.log('📌 Opening create modal with pasted data:', pasteResult.data);
      
      if (pasteResult.action === 'cut') {
        console.log('🔄 This is a move operation (cut/paste)');
      } else {
        console.log('📋 This is a copy operation');
      }
      
      setCreateModalDefaultData(pasteResult.data);
      setAppointmentToEdit(null);
      setIsCreateModalOpen(true);
    }
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

  return (
    <div className="h-screen bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5 flex flex-col overflow-hidden">
      {/* Layout container optimisé pour écran complet */}
      <div className="flex-1 flex min-h-0 p-1 gap-1">
        {/* Sidebar de navigation ultra-compacte */}
        <div className="w-48 flex-shrink-0 h-full">
          <div className="bg-white/90 backdrop-blur-sm border border-vet-blue/30 rounded-lg h-[calc(100vh-140px)] flex flex-col">
            {/* Header compact avec notification */}
            <div className="flex items-center justify-end p-2 border-b border-vet-blue/20">
              <PendingBookingsNotification />
            </div>
            
            {/* Contenu de navigation optimisé */}
            <div className="flex-1 p-2 overflow-hidden">
              {viewMode === 'daily' ? (
                <DailyCalendarView
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  bookings={todayBookings}
                  veterinarians={veterinarians}
                  onCreateAppointment={handleCreateAppointment}
                  onCreateNote={handleCreateNote}
                  onAppointmentClick={handleAppointmentClick}
                  onValidateBooking={handleValidateBooking}
                  onCancelBooking={handleCancelBooking}
                  onCopyBooking={handleCopyBooking}
                  onCutBooking={handleCutBooking}
                  onPasteBooking={handlePasteBooking}
                  onDeleteBooking={handleDeleteBooking}
                  onBlockSlot={handleBlockSlot}
                  hasClipboard={hasClipboard()}
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

        {/* Zone principale avec planning optimisé */}
        <div className="flex-1 flex flex-col min-h-0 gap-1">
          {/* Contenu du planning principal - hauteur réduite pour laisser place au header */}
          <div className="flex-1 min-h-0 max-h-[calc(100vh-120px)]">
            {viewMode === 'daily' ? (
              <DailyCalendarView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                bookings={todayBookings}
                veterinarians={veterinarians}
                onCreateAppointment={handleCreateAppointment}
                onCreateNote={handleCreateNote}
                onAppointmentClick={handleAppointmentClick}
                onValidateBooking={handleValidateBooking}
                onCancelBooking={handleCancelBooking}
                onCopyBooking={handleCopyBooking}
                onCutBooking={handleCutBooking}
                onPasteBooking={handlePasteBooking}
                onDeleteBooking={handleDeleteBooking}
                onBlockSlot={handleBlockSlot}
                hasClipboard={hasClipboard()}
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

          {/* Header de planning compact en bas */}
          <div className="flex-shrink-0">
            <PlanningHeader
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>

      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        defaultData={createModalDefaultData}
        appointmentToEdit={appointmentToEdit}
        veterinarians={veterinarians}
        consultationTypes={consultationTypes}
      />

      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleCloseNoteModal}
        defaultData={noteModalDefaultData}
        veterinarians={veterinarians}
      />
    </div>
  );
}
