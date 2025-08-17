import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker"
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateSlotDialog } from '@/components/slots/CreateSlotDialog';
import { useSlotManagement } from '@/hooks/useSlotManagement';
import { SlotsList } from '@/components/slots/SlotsList';
import { useClinicVeterinarians } from '@/hooks/useClinicVeterinarians';
import { useConsultationTypes } from '@/hooks/useConsultationTypes';

const VetSchedule = () => {
  const { availableSlots, createSlot, deleteSlot, isLoading, isCreating, isDeleting } = useSlotManagement();
  const { veterinarians } = useClinicVeterinarians();
  const { consultationTypes } = useConsultationTypes();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<string | undefined>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateSlot = async (slotData: any) => {
    const success = await createSlot(slotData);
    if (success) {
      setShowCreateDialog(false);
    }
  };

  const filteredSlots = useMemo(() => {
    let filtered = availableSlots;

    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(slot => slot.date === formattedDate);
    }

    if (selectedVeterinarian) {
      filtered = filtered.filter(slot => slot.veterinarian_id === selectedVeterinarian);
    }

    return filtered;
  }, [availableSlots, selectedDate, selectedVeterinarian]);

  const isLoadingData = isLoading || !veterinarians || !consultationTypes;

  return (
    <div className="container mx-auto py-6 pt-10 space-y-6">
      <div className="flex items-center space-x-4">
        <Calendar className="h-8 w-8 text-vet-sage" />
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Planning</h1>
          <p className="text-vet-brown">Gérez vos créneaux de consultation</p>
        </div>
      </div>

      <CreateSlotDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateSlot}
        veterinarians={veterinarians}
        consultationTypes={consultationTypes}
        isCreating={isCreating}
      />

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy">Filtres</CardTitle>
          <CardDescription>Affinez les créneaux affichés</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="date">Date</Label>
            <DatePicker
              id="date"
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              placeholderText={format(new Date(), 'dd/MM/yyyy', { locale: fr })}
            />
          </div>
          <div>
            <Label htmlFor="veterinarian">Vétérinaire</Label>
            <Select onValueChange={setSelectedVeterinarian}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les vétérinaires" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les vétérinaires</SelectItem>
                {veterinarians?.map(vet => (
                  <SelectItem key={vet.id} value={vet.id}>{vet.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end justify-end">
            <Button onClick={() => setShowCreateDialog(true)} className="bg-vet-blue hover:bg-vet-blue/90 text-white">
              Ajouter un créneau
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoadingData ? (
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <p className="text-vet-brown">Chargement des créneaux...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <SlotsList
          slots={filteredSlots}
          onDeleteSlot={deleteSlot}
        />
      )}
    </div>
  );
};

export default VetSchedule;
