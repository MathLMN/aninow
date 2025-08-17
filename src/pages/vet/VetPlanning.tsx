
import React from 'react';
import { PlanningHeader } from '@/components/planning/PlanningHeader';
import { DailyCalendarView } from '@/components/planning/DailyCalendarView';
import { WeeklyCalendarView } from '@/components/planning/WeeklyCalendarView';
import { CreateAppointmentModal } from '@/components/planning/CreateAppointmentModal';
import { AppointmentDetailsModal } from '@/components/planning/AppointmentDetailsModal';
import { usePlanningLogic } from '@/hooks/usePlanningLogic';
import { useVetBookings } from '@/hooks/useVetBookings';
import { useClinicVeterinarians } from '@/hooks/useClinicVeterinarians';
import { usePlanningActions } from '@/hooks/usePlanningActions';
import { useConsultationTypes } from '@/hooks/useConsultationTypes';
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedDateNavigation } from '@/components/planning/EnhancedDateNavigation';

const VetPlanning = () => {
  const {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    selectedAppointment,
    setSelectedAppointment,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    filters,
    setFilters,
    handleAppointmentClick,
    handleCreateAppointment,
    navigateWeek,
    getWeekDates
  } = usePlanningLogic();

  const { 
    bookings, 
    isLoading, 
    refreshBookings,
    updateBookingStatus 
  } = useVetBookings();

  const { veterinarians } = useClinicVeterinarians();
  const { consultationTypes } = useConsultationTypes();

  const {
    validateBooking,
    cancelBooking,
    duplicateBooking,
    moveAppointment,
    deleteBooking
  } = usePlanningActions();

  const handleCreateAppointmentFromSlot = (timeSlot: {
    date: string;
    time: string;
    veterinarian?: string;
  }) => {
    setSelectedAppointment({
      date: timeSlot.date,
      start_time: timeSlot.time,
      end_time: timeSlot.time,
      veterinarian_id: timeSlot.veterinarian || ''
    });
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedAppointment(null);
    refreshBookings(); // Rafraîchir les données après création
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleUpdateStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      updateBookingStatus({ id: appointmentId, status });
      refreshBookings();
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  // Create wrapper function for move booking that matches expected signature
  const handleMoveBooking = (booking: any) => {
    // This would typically open a modal for the user to select new date/time
    // The actual moveAppointment function will be called from within that modal
    console.log('Move booking:', booking);
  };

  return (
    <div className="min-h-screen bg-vet-beige/20 flex">
      {/* Sidebar gauche avec navigation de date */}
      <div className="w-80 bg-white border-r border-vet-blue/20 flex flex-col">
        {/* Header de la sidebar */}
        <div className="p-4 border-b border-vet-blue/20">
          <h2 className="text-lg font-semibold text-vet-navy mb-2">Navigation</h2>
          <p className="text-sm text-vet-brown">Sélectionnez une date</p>
        </div>

        {/* Navigation de date */}
        <div className="p-4">
          <EnhancedDateNavigation 
            selectedDate={currentDate} 
            onDateChange={setCurrentDate}
            compact={false}
          />
        </div>

        {/* Vue quotidienne compacte dans la sidebar */}
        <div className="flex-1 p-4">
          <Card className="bg-vet-beige/30 border-vet-blue/20">
            <CardContent className="p-3">
              <h3 className="text-sm font-medium text-vet-navy mb-2">
                Aperçu du jour
              </h3>
              <DailyCalendarView
                selectedDate={currentDate}
                onDateChange={setCurrentDate}
                bookings={bookings}
                veterinarians={veterinarians}
                onCreateAppointment={handleCreateAppointmentFromSlot}
                onAppointmentClick={handleAppointmentClick}
                onValidateBooking={validateBooking}
                onCancelBooking={cancelBooking}
                onDuplicateBooking={duplicateBooking}
                onMoveBooking={handleMoveBooking}
                onDeleteBooking={deleteBooking}
                sidebarMode={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {/* Header du planning avec sélecteur de vue et boutons d'action */}
        <div className="p-4 border-b border-vet-blue/20 bg-white">
          <PlanningHeader 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedDate={currentDate}
          />
        </div>

        {/* Contenu principal du planning */}
        <div className="flex-1 p-4">
          {viewMode === 'daily' ? (
            <DailyCalendarView
              selectedDate={currentDate}
              onDateChange={setCurrentDate}
              bookings={bookings}
              veterinarians={veterinarians}
              onCreateAppointment={handleCreateAppointmentFromSlot}
              onAppointmentClick={handleAppointmentClick}
              onValidateBooking={validateBooking}
              onCancelBooking={cancelBooking}
              onDuplicateBooking={duplicateBooking}
              onMoveBooking={handleMoveBooking}
              onDeleteBooking={deleteBooking}
              mainViewMode={true}
            />
          ) : (
            <WeeklyCalendarView
              weekDates={getWeekDates()}
              bookings={bookings}
              veterinarians={veterinarians}
              filters={filters}
              isLoading={isLoading}
              onAppointmentClick={handleAppointmentClick}
              onCreateAppointment={handleCreateAppointmentFromSlot}
            />
          )}
        </div>
      </div>

      {/* Modale de création/modification de rendez-vous */}
      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        defaultData={selectedAppointment}
        appointmentToEdit={selectedAppointment?.id ? selectedAppointment : undefined}
      />

      {/* Modale de détails du rendez-vous */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default VetPlanning;
