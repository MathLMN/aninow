
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSlotDialog } from "@/components/slots/CreateSlotDialog";
import { SlotsList } from "@/components/slots/SlotsList";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { useConsultationTypes } from "@/hooks/useConsultationTypes";
import { Calendar, Clock, Users } from "lucide-react";

const VetSchedule = () => {
  const { veterinarians } = useClinicVeterinarians();
  const { 
    availableSlots, 
    isLoading, 
    error, 
    fetchAvailableSlots,
    createSlot, 
    deleteSlot 
  } = useSlotManagement();
  const { consultationTypes } = useConsultationTypes();

  console.log('🔍 VetSchedule - Veterinarians:', veterinarians?.length || 0);
  console.log('🔍 VetSchedule - Available slots:', availableSlots?.length || 0);
  console.log('🔍 VetSchedule - Consultation types:', consultationTypes?.length || 0);
  console.log('🔍 VetSchedule - Loading:', isLoading);
  console.log('🔍 VetSchedule - Error:', error);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vet-sage mx-auto mb-4"></div>
            <p className="text-vet-brown">Chargement des créneaux...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateSlot = async (slotData: {
    veterinarian_id: string
    consultation_type_id: string
    date: string
    start_time: string
    end_time: string
  }) => {
    console.log('🔄 Creating slot with data:', slotData);
    return await createSlot(slotData);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="h-8 w-8 text-vet-sage" />
          <div>
            <h1 className="text-3xl font-bold text-vet-navy">Gestion des créneaux</h1>
            <p className="text-vet-brown">Créez et gérez les créneaux disponibles pour les consultations</p>
          </div>
        </div>
        <CreateSlotDialog 
          veterinarians={veterinarians}
          onCreateSlot={handleCreateSlot}
        />
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Erreur: {error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-navy">
              Créneaux disponibles
            </CardTitle>
            <Clock className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">
              {availableSlots?.filter(slot => !slot.is_booked).length || 0}
            </div>
            <p className="text-xs text-vet-brown">
              créneaux libres
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-navy">
              Créneaux réservés
            </CardTitle>
            <Calendar className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">
              {availableSlots?.filter(slot => slot.is_booked).length || 0}
            </div>
            <p className="text-xs text-vet-brown">
              créneaux occupés
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-navy">
              Vétérinaires actifs
            </CardTitle>
            <Users className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">
              {veterinarians?.filter(vet => vet.is_active).length || 0}
            </div>
            <p className="text-xs text-vet-brown">
              praticiens disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-vet-navy">
            Liste des créneaux
          </CardTitle>
          <CardDescription className="text-vet-brown">
            Tous les créneaux disponibles et réservés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SlotsList 
            slots={availableSlots}
            veterinarians={veterinarians}
            consultationTypes={consultationTypes}
            onDeleteSlot={deleteSlot}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VetSchedule;
