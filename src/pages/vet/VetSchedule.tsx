
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { CreateSlotDialog } from "@/components/slots/CreateSlotDialog";
import { SlotsList } from "@/components/slots/SlotsList";
import { useIsMobile } from "@/hooks/use-mobile";

const VetSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    consultationTypes,
    availableSlots,
    isLoading,
    fetchAvailableSlots,
    createSlot,
    deleteSlot
  } = useSlotManagement();
  
  const { 
    veterinarians,
    isLoading: vetsLoading 
  } = useClinicVeterinarians();

  const isMobile = useIsMobile();

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleFilterByDate = (date: string) => {
    fetchAvailableSlots(date);
  };

  const handleCreateSlot = async (slotData: {
    veterinarian_id: string;
    consultation_type_id: string;
    date: string;
    start_time: string;
    end_time: string;
  }) => {
    return await createSlot(slotData);
  };

  const todaySlots = availableSlots.filter(slot => {
    const today = new Date().toISOString().split('T')[0];
    return slot.date === today;
  });

  const availableSlotsCount = availableSlots.filter(slot => !slot.is_booked).length;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6">
      {/* En-tête responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy">Planning et Créneaux</h1>
          <p className="text-sm sm:text-base text-vet-brown">Gestion de vos créneaux de consultation</p>
        </div>
        <div className="flex items-center justify-center sm:justify-end">
          <CreateSlotDialog
            veterinarians={veterinarians}
            consultationTypes={consultationTypes}
            onCreateSlot={handleCreateSlot}
          />
        </div>
      </div>

      {/* Statistiques rapides - responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-vet-navy">{availableSlots.length}</div>
              <div className="text-xs sm:text-sm text-vet-brown">Total créneaux</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-vet-sage">{availableSlotsCount}</div>
              <div className="text-xs sm:text-sm text-vet-brown">Disponibles</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-vet-blue">{availableSlots.length - availableSlotsCount}</div>
              <div className="text-xs sm:text-sm text-vet-brown">Réservés</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-vet-navy">{todaySlots.length}</div>
              <div className="text-xs sm:text-sm text-vet-brown">Aujourd'hui</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation de date responsive */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={() => navigateDate('prev')}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <div className="text-center flex-1 px-2 sm:px-4">
              <h2 className="text-base sm:text-xl font-semibold text-vet-navy">
                {currentDate.toLocaleDateString('fr-FR', { 
                  weekday: isMobile ? 'short' : 'long', 
                  day: 'numeric', 
                  month: isMobile ? 'short' : 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <p className="text-xs sm:text-base text-vet-brown">{todaySlots.length} créneaux aujourd'hui</p>
            </div>
            
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={() => navigateDate('next')}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des créneaux */}
      <SlotsList
        slots={availableSlots}
        onDeleteSlot={deleteSlot}
        onFilterByDate={handleFilterByDate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default VetSchedule;
