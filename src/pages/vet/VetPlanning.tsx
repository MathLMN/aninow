
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
import { useEffect } from "react";

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

  // Add debugging logs to identify which hook is causing the error
  useEffect(() => {
    console.log('🏥 VetPlanning component mounted');
    console.log('📅 Current date:', currentDate);
  }, [currentDate]);

  const { bookings, isLoading: bookingsLoading, updateBookingStatus, error: bookingsError } = useVetBookings();
  const { consultationTypes, isLoading: slotsLoading, error: slotsError } = useSlotManagement();
  const { veterinarians, isLoading: vetsLoading, error: vetsError } = useClinicVeterinarians();
  const { assignments, refreshAssignments, error: assignmentsError } = useSlotAssignments(currentDate);

  // Log any errors from the hooks
  useEffect(() => {
    if (bookingsError) {
      console.error('❌ Error loading bookings:', bookingsError);
    }
    if (slotsError) {
      console.error('❌ Error loading slots:', slotsError);
    }
    if (vetsError) {
      console.error('❌ Error loading veterinarians:', vetsError);
    }
    if (assignmentsError) {
      console.error('❌ Error loading assignments:', assignmentsError);
    }
  }, [bookingsError, slotsError, vetsError, assignmentsError]);

  const isLoading = bookingsLoading || slotsLoading || vetsLoading;
  const weekDates = getWeekDates();

  // Show error state if any critical data fails to load
  if (bookingsError || vetsError) {
    return (
      <VetLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-gray-600 mb-4">
              Une erreur s'est produite lors du chargement des données du planning.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Actualiser la page
            </Button>
          </div>
        </div>
      </VetLayout>
    );
  }

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
