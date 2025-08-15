import { useState } from "react";
import { DailyCalendarView } from "@/components/planning/DailyCalendarView";
import { WeeklyCalendarView } from "@/components/planning/WeeklyCalendarView";
import { PlanningHeader } from "@/components/planning/PlanningHeader";
import { CreateAppointmentModal } from "@/components/planning/CreateAppointmentModal";
import { useVetBookings } from "@/hooks/useVetBookings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { usePlanningActions } from "@/hooks/usePlanningActions";
import { useConsultationTypes } from "@/hooks/useConsultationTypes";

export default function VetPlanning() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
  const [createModalDefaultData, setCreateModalDefaultData] = useState<any>(null);

  const { bookings, refreshBookings } = useVetBookings();
  const { veterinarians } = useClinicVeterinarians();
  const { consultationTypes } = useConsultationTypes();

  const {
    onValidateBooking,
    onCancelBooking,
    onDuplicateBooking,
    onMoveBooking,
    onDeleteBooking,
    onBlockSlot
  } = usePlanningActions();

  const handleCreateAppointment = (timeSlot: { date: string; time: string; veterinarian?: string }) => {
    console.log('🎯 Opening create modal with time slot:', timeSlot);
    setCreateModalDefaultData(timeSlot);
    setAppointmentToEdit(null); // S'assurer qu'on est en mode création
    setIsCreateModalOpen(true);
  };

  const handleAppointmentClick = (appointment: any) => {
    console.log('🎯 Opening edit modal for appointment:', appointment);
    setAppointmentToEdit(appointment);
    setCreateModalDefaultData(null); // S'assurer qu'on est en mode édition
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setCreateModalDefaultData(null);
    setAppointmentToEdit(null);
    // Rafraîchir les données après fermeture du modal
    refreshBookings();
  };

  // Filtrer les réservations pour la date sélectionnée (vue quotidienne)
  const todayBookings = bookings.filter(booking => {
    if (viewMode === 'daily') {
      const bookingDate = new Date(booking.appointment_date);
      return bookingDate.toDateString() === selectedDate.toDateString();
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5">
      <div className="container mx-auto p-6 space-y-6">
        <PlanningHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === 'daily' ? (
          <DailyCalendarView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            bookings={todayBookings}
            veterinarians={veterinarians}
            onCreateAppointment={handleCreateAppointment}
            onAppointmentClick={handleAppointmentClick}
            onValidateBooking={onValidateBooking}
            onCancelBooking={onCancelBooking}
            onDuplicateBooking={onDuplicateBooking}
            onMoveBooking={onMoveBooking}
            onDeleteBooking={onDeleteBooking}
            onBlockSlot={onBlockSlot}
          />
        ) : (
          <WeeklyCalendarView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            bookings={bookings}
            veterinarians={veterinarians}
            onCreateAppointment={handleCreateAppointment}
            onAppointmentClick={handleAppointmentClick}
          />
        )}

        <CreateAppointmentModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          defaultData={createModalDefaultData}
          appointmentToEdit={appointmentToEdit}
          veterinarians={veterinarians}
          consultationTypes={consultationTypes}
        />
      </div>
    </div>
  );
}
