
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { CreateSlotDialog } from "@/components/slots/CreateSlotDialog";
import { SlotsList } from "@/components/slots/SlotsList";

const VetSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    veterinarians,
    consultationTypes,
    availableSlots,
    isLoading,
    fetchAvailableSlots,
    createSlot,
    deleteSlot
  } = useSlotManagement();

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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Planning et Créneaux</h1>
          <p className="text-vet-brown">Gestion de vos créneaux de consultation</p>
        </div>
        <div className="flex items-center space-x-3">
          <CreateSlotDialog
            veterinarians={veterinarians}
            consultationTypes={consultationTypes}
            onCreateSlot={handleCreateSlot}
          />
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-vet-navy">{availableSlots.length}</div>
              <div className="text-sm text-vet-brown">Total créneaux</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-vet-sage">{availableSlotsCount}</div>
              <div className="text-sm text-vet-brown">Disponibles</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-vet-blue">{availableSlots.length - availableSlotsCount}</div>
              <div className="text-sm text-vet-brown">Réservés</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-vet-navy">{todaySlots.length}</div>
              <div className="text-sm text-vet-brown">Aujourd'hui</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation de date */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate('prev')}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-vet-navy">
                {currentDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <p className="text-vet-brown">{todaySlots.length} créneaux aujourd'hui</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate('next')}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
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
