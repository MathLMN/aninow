
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, List } from "lucide-react";
import VetLayout from "@/components/layout/VetLayout";
import { useVetBookings } from "@/hooks/useVetBookings";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { WeeklyCalendarView } from "@/components/planning/WeeklyCalendarView";
import { DailyCalendarView } from "@/components/planning/DailyCalendarView";
import { AppointmentDetailsModal } from "@/components/planning/AppointmentDetailsModal";
import { CreateAppointmentModal } from "@/components/planning/CreateAppointmentModal";
import { PlanningFilters } from "@/components/planning/PlanningFilters";

type ViewMode = 'daily' | 'weekly';

const VetPlanning = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    veterinarian: 'all',
    status: 'all',
    consultationType: 'all'
  });

  const { bookings, isLoading: bookingsLoading, updateBookingStatus } = useVetBookings();
  const { veterinarians, consultationTypes, isLoading: slotsLoading } = useSlotManagement();

  const isLoading = bookingsLoading || slotsLoading;

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleCreateAppointment = (timeSlot: { date: string; time: string; veterinarian?: string }) => {
    setSelectedAppointment(timeSlot);
    setIsCreateModalOpen(true);
  };

  // Navigation par semaine (pour la vue hebdomadaire)
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  return (
    <VetLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-vet-navy">Planning des Rendez-vous</h1>
            <p className="text-vet-brown">Gestion centralisée de tous les rendez-vous</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Sélecteur de vue */}
            <div className="flex items-center border border-vet-blue/30 rounded-lg bg-white">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('daily')}
                className={viewMode === 'daily' ? 'bg-vet-sage hover:bg-vet-sage/90 text-white' : 'text-vet-navy hover:bg-vet-sage/10'}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Jour
              </Button>
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('weekly')}
                className={viewMode === 'weekly' ? 'bg-vet-sage hover:bg-vet-sage/90 text-white' : 'text-vet-navy hover:bg-vet-sage/10'}
              >
                <List className="h-4 w-4 mr-2" />
                Semaine
              </Button>
            </div>
          </div>
        </div>

        {/* Filtres pour la vue hebdomadaire */}
        {viewMode === 'weekly' && (
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Navigation semaine */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                    className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-vet-navy">
                      Semaine du {weekDates[0].toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h2>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                    className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="text-vet-blue hover:bg-vet-blue/10"
                  >
                    Aujourd'hui
                  </Button>
                </div>

                {/* Filtres */}
                <PlanningFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  veterinarians={veterinarians}
                  consultationTypes={consultationTypes}
                />
              </div>
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
