
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar } from "lucide-react";
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
import { SlotAssignmentSheet } from "@/components/planning/SlotAssignmentSheet";
import { RecurringBlocksModal } from "@/components/planning/RecurringBlocksModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { MoveAppointmentModal } from "@/components/planning/MoveAppointmentModal";
import { usePlanningActions } from "@/hooks/usePlanningActions";

const VetPlanning = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBookingToMove, setSelectedBookingToMove] = useState<any>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isRecurringBlocksModalOpen, setIsRecurringBlocksModalOpen] = useState(false);

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
    filters,
    setFilters,
    handleAppointmentClick,
    handleCreateAppointment,
    navigateWeek,
    getWeekDates
  } = usePlanningLogic();

  const {
    validateBooking,
    cancelBooking,
    duplicateBooking,
    moveAppointment,
    deleteBooking,
    handleBlockSlot
  } = usePlanningActions();

  // Add error boundary logic
  useEffect(() => {
    console.log('🏥 VetPlanning component mounted');
    console.log('📅 Current date:', currentDate);
    setIsLoading(false);
  }, [currentDate]);

  // Use safe hook calls with error handling
  const { 
    bookings = [], 
    isLoading: bookingsLoading = false, 
    updateBookingStatus, 
    error: bookingsError,
    refreshBookings
  } = useVetBookings() || {};

  const { 
    consultationTypes = [], 
    isLoading: slotsLoading = false, 
    error: slotsError 
  } = useSlotManagement() || {};

  const { 
    veterinarians = [], 
    isLoading: vetsLoading = false, 
    error: vetsError,
    refetch: refetchVeterinarians
  } = useClinicVeterinarians() || {};

  const { 
    assignments = [], 
    refreshAssignments = () => {}, 
    error: assignmentsError 
  } = useSlotAssignments(currentDate) || {};

  // Log any critical errors from the hooks (only once per error type)
  useEffect(() => {
    let hasNewError = false;
    let newErrorMessage = '';

    if (bookingsError && !hasError) {
      console.error('❌ Error loading bookings:', bookingsError);
      hasNewError = true;
      newErrorMessage = 'Erreur lors du chargement des rendez-vous';
    }
    if (slotsError && !hasError) {
      console.error('❌ Error loading slots:', slotsError);
      hasNewError = true;
      newErrorMessage = 'Erreur lors du chargement des créneaux';
    }
    if (vetsError && !hasError) {
      console.error('❌ Error loading veterinarians:', vetsError);
      hasNewError = true;
      newErrorMessage = 'Erreur lors du chargement des vétérinaires';
    }

    if (hasNewError) {
      setHasError(true);
      setErrorMessage(newErrorMessage);
    }

    // Log assignments error but don't treat it as critical
    if (assignmentsError) {
      console.warn('⚠️ Warning loading assignments:', assignmentsError);
    }
  }, [bookingsError, slotsError, vetsError, assignmentsError, hasError]);

  const allLoading = isLoading || bookingsLoading || slotsLoading || vetsLoading;
  const weekDates = getWeekDates();

  // Create a wrapper function to handle the status update with correct signature
  const handleUpdateBookingStatus = async (appointmentId: string, status: string, notes?: string): Promise<boolean> => {
    try {
      if (updateBookingStatus) {
        updateBookingStatus({ id: appointmentId, status });
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
      return false;
    }
  };

  // Handlers pour les nouvelles actions du planning
  const handleValidateBooking = async (bookingId: string) => {
    await validateBooking(bookingId);
    // Recharger les données
    if (refreshBookings) {
      await refreshBookings();
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    await cancelBooking(bookingId);
    // Recharger les données
    if (refreshBookings) {
      await refreshBookings();
    }
  };

  const handleDuplicateBooking = async (booking: any) => {
    await duplicateBooking(booking);
    // Recharger les données
    if (refreshBookings) {
      await refreshBookings();
    }
  };

  const handleMoveBooking = (booking: any) => {
    setSelectedBookingToMove(booking);
    setIsMoveModalOpen(true);
  };

  const handleMoveAppointment = async (appointmentId: string, newDate: string, newTime: string, newVetId?: string) => {
    const success = await moveAppointment(appointmentId, newDate, newTime, newVetId);
    if (success) {
      setIsMoveModalOpen(false);
      setSelectedBookingToMove(null);
      // Recharger les données
      if (refreshBookings) {
        await refreshBookings();
      }
    }
    return success;
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ?')) {
      await deleteBooking(bookingId);
      // Recharger les données
      if (refreshBookings) {
        await refreshBookings();
      }
    }
  };

  // Gestionnaire personnalisé pour la fermeture de la modale de création avec rechargement
  const handleCloseCreateModal = async () => {
    setIsCreateModalOpen(false);
    // Forcer le rechargement des données pour afficher le nouveau RDV
    console.log('🔄 Refreshing bookings after appointment creation...');
    if (refreshBookings) {
      await refreshBookings();
    }
  };

  // Show loading state
  if (allLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-vet-navy mb-2">
            Chargement du planning...
          </h2>
          <p className="text-vet-brown">
            Veuillez patienter pendant le chargement des données.
          </p>
        </div>
      </div>
    );
  }

  // Show error state if any critical data fails to load
  if (hasError) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">
            {errorMessage || 'Une erreur s\'est produite lors du chargement des données du planning.'}
          </p>
          <Button 
            onClick={() => {
              setHasError(false);
              setErrorMessage('');
              window.location.reload();
            }} 
            variant="outline"
          >
            Actualiser la page
          </Button>
        </div>
      </div>
    );
  }

  // Check if no veterinarians are loaded and show a helpful message
  const canManageAssignments = veterinarians && veterinarians.length > 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <PlanningHeader 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        {viewMode === 'daily' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecurringBlocksModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Blocages récurrents
            </Button>
            
            <SlotAssignmentSheet
              assignments={assignments}
              veterinarians={veterinarians}
              selectedDate={currentDate}
              onAssignmentsChange={refreshAssignments}
              canManageAssignments={canManageAssignments}
            />
            
            {!canManageAssignments && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchVeterinarians?.()}
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Actualiser
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Alert si aucun vétérinaire n'est disponible */}
      {viewMode === 'daily' && !canManageAssignments && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucun vétérinaire actif n'a été trouvé. Veuillez ajouter des vétérinaires dans la section Paramètres pour pouvoir gérer les attributions de créneaux.
          </AlertDescription>
        </Alert>
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
          onValidateBooking={handleValidateBooking}
          onCancelBooking={handleCancelBooking}
          onDuplicateBooking={handleDuplicateBooking}
          onMoveBooking={handleMoveBooking}
          onDeleteBooking={handleDeleteBooking}
          onBlockSlot={handleBlockSlot}
        />
      ) : (
        <WeeklyCalendarView
          weekDates={weekDates}
          bookings={bookings}
          veterinarians={veterinarians}
          filters={filters}
          isLoading={allLoading}
          onAppointmentClick={handleAppointmentClick}
          onCreateAppointment={handleCreateAppointment}
        />
      )}

      {/* Modales */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdateStatus={handleUpdateBookingStatus}
        />
      )}

      {selectedAppointment && (
        <CreateAppointmentModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          defaultData={selectedAppointment}
          veterinarians={veterinarians}
          consultationTypes={consultationTypes}
        />
      )}

      {/* Nouvelle modale pour déplacer un rendez-vous */}
      {selectedBookingToMove && (
        <MoveAppointmentModal
          isOpen={isMoveModalOpen}
          onClose={() => {
            setIsMoveModalOpen(false);
            setSelectedBookingToMove(null);
          }}
          appointment={selectedBookingToMove}
          veterinarians={veterinarians}
          onMoveAppointment={handleMoveAppointment}
        />
      )}

      {/* Modale des blocages récurrents */}
      <RecurringBlocksModal
        isOpen={isRecurringBlocksModalOpen}
        onClose={() => setIsRecurringBlocksModalOpen(false)}
        veterinarians={veterinarians}
      />
    </div>
  );
};

export default VetPlanning;
