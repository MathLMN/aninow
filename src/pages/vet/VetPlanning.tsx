
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import VetLayout from "@/components/layout/VetLayout";
import { useVetBookings } from "@/hooks/useVetBookings";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { usePlanningLogic } from "@/hooks/usePlanningLogic";
import { useSlotAssignments } from "@/hooks/useSlotAssignments";
import { WeeklyCalendarView } from "@/components/planning/WeeklyCalendarView";
import { DailyCalendarView } from "@/components/planning/DailyCalendarView";
import { AppointmentDetailsModal } from "@/components/planning/AppointmentDetailsModal";
import { CreateAppointmentModal } from "@/components/planning/CreateAppointmentModal";
import { PlanningHeader } from "@/components/planning/PlanningHeader";
import { WeeklyNavigation } from "@/components/planning/WeeklyNavigation";
import { SlotAssignmentManager } from "@/components/planning/SlotAssignmentManager";

const VetPlanning = () => {
  const {
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    selectedAppointment,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    showAssignmentManager,
    setShowAssignmentManager,
    filters,
    setFilters,
    handleAppointmentClick,
    handleCreateAppointment,
    navigateWeek,
    getWeekDates
  } = usePlanningLogic();

  const { bookings, isLoading: bookingsLoading, updateBookingStatus } = useVetBookings();
  const { consultationTypes, isLoading: slotsLoading } = useSlotManagement();
  const { veterinarians, isLoading: vetsLoading } = useClinicVeterinarians();
  const { assignments, refreshAssignments } = useSlotAssignments(currentDate);

  const isLoading = bookingsLoading || slotsLoading || vetsLoading;
  const weekDates = getWeekDates();

  return (
    <VetLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <PlanningHeader 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {viewMode === 'daily' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignmentManager(!showAssignmentManager)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {showAssignmentManager ? 'Masquer' : 'Gérer'} les attributions
            </Button>
          )}
        </div>

        {/* Gestionnaire d'attributions - visible uniquement en vue quotidienne */}
        {viewMode === 'daily' && showAssignmentManager && (
          <SlotAssignmentManager
            assignments={assignments}
            veterinarians={veterinarians}
            selectedDate={currentDate}
            onAssignmentsChange={refreshAssignments}
          />
        )}

        {/* Filtres pour la vue hebdomadaire */}
        {viewMode === 'weekly' && (
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardContent className="p-4">
              <WeeklyNavigation
                weekDates={weekDates}
                filters={filters}
                onFiltersChange={setFilters}
                onNavigateWeek={navigateWeek}
                onTodayClick={() => setCurrentDate(new Date())}
                veterinarians={veterinarians}
                consultationTypes={consultationTypes}
              />
            </CardContent>
          </Card>
        )}

        {/* Vue selon le mode sélectionné */}
        {viewMode === 'daily' ? (
          <DailyCalendarView
            selectedDate={currentDate}
            onDateChange={setCurrentDate}
            bookings={bookings}
            veterinarians={veterinarians}
            onCreateAppointment={handleCreateAppointment}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <WeeklyCalendarView
            weekDates={weekDates}
            bookings={bookings}
            veterinarians={veterinarians}
            filters={filters}
            isLoading={isLoading}
            onAppointmentClick={handleAppointmentClick}
            onCreateAppointment={handleCreateAppointment}
          />
        )}

        {/* Modales */}
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdateStatus={updateBookingStatus}
        />

        <CreateAppointmentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          defaultData={selectedAppointment}
          veterinarians={veterinarians}
          consultationTypes={consultationTypes}
        />
      </div>
    </VetLayout>
  );
};

export default VetPlanning;
