
import { useState } from "react";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useSlotManagement } from "@/hooks/useSlotManagement";
import { useConsultationTypes } from "@/hooks/useConsultationTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const ClinicSettingsForm = () => {
  const { settings, updateSettings, isLoading: settingsLoading } = useClinicSettings();
  const { 
    availableSlots, 
    isLoading: slotsLoading, 
    isCreateDialogOpen, 
    setIsCreateDialogOpen,
    createSlot,
    isCreating,
    updateSlot,
    isUpdating,
    deleteSlot,
    isDeleting,
  } = useSlotManagement();
  const { consultationTypes } = useConsultationTypes();
  const { toast } = useToast();
  const [newSlot, setNewSlot] = useState({
    date: '',
    start_time: '',
    end_time: '',
    veterinarian_id: '',
    consultation_type_id: '',
  });
  const [selectedSlotForUpdate, setSelectedSlotForUpdate] = useState<any>(null);

  const handleSettingsSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const clinic_name = formData.get('clinic_name') as string;
    const clinic_address_street = formData.get('clinic_address_street') as string;
    const clinic_phone = formData.get('clinic_phone') as string;
    const clinic_email = formData.get('clinic_email') as string;

    await updateSettings({ 
      clinic_name, 
      clinic_address_street, 
      clinic_phone, 
      clinic_email 
    });
  };

  const handleCreateSlot = async () => {
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time || !newSlot.veterinarian_id || !newSlot.consultation_type_id) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs pour créer un créneau.",
        variant: "destructive",
      });
      return;
    }

    createSlot(newSlot);
    setNewSlot({
      date: '',
      start_time: '',
      end_time: '',
      veterinarian_id: '',
      consultation_type_id: '',
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteSlot = async (slotId: string) => {
    deleteSlot(slotId);
  };

  const handleOpenUpdateDialog = (slot: any) => {
    setSelectedSlotForUpdate(slot);
    setNewSlot({
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      veterinarian_id: slot.veterinarian_id,
      consultation_type_id: slot.consultation_type_id,
    });
  };

  const handleUpdateSlot = async () => {
    if (!selectedSlotForUpdate?.id) {
      toast({
        title: "Erreur",
        description: "Impossible de trouver l'ID du créneau à mettre à jour.",
        variant: "destructive",
      });
      return;
    }

    updateSlot({ slotId: selectedSlotForUpdate.id, updatedSlot: newSlot });
    setNewSlot({
      date: '',
      start_time: '',
      end_time: '',
      veterinarian_id: '',
      consultation_type_id: '',
    });
    setSelectedSlotForUpdate(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-vet-navy">
            Informations de la clinique
          </CardTitle>
          <CardDescription className="text-vet-brown">
            Mettez à jour les informations générales de votre clinique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSettingsSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic_name">Nom de la clinique</Label>
                <Input id="clinic_name" name="clinic_name" defaultValue={settings?.clinic_name} className="bg-white" />
              </div>
              <div>
                <Label htmlFor="clinic_address_street">Adresse</Label>
                <Input id="clinic_address_street" name="clinic_address_street" defaultValue={settings?.clinic_address_street} className="bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic_phone">Téléphone</Label>
                <Input id="clinic_phone" name="clinic_phone" defaultValue={settings?.clinic_phone} className="bg-white" />
              </div>
              <div>
                <Label htmlFor="clinic_email">Email</Label>
                <Input id="clinic_email" name="clinic_email" defaultValue={settings?.clinic_email} className="bg-white" />
              </div>
            </div>
            <Button type="submit" className="bg-vet-sage hover:bg-vet-sage/90 text-white w-full">
              {settingsLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-vet-navy">
            Gestion des disponibilités
          </CardTitle>
          <CardDescription className="text-vet-brown">
            Définissez les créneaux horaires disponibles pour les rendez-vous
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-vet-blue hover:bg-vet-blue/90 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ajouter un créneau
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Nouveau créneau</DialogTitle>
                  <DialogDescription>
                    Définir les détails du nouveau créneau de disponibilité
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input
                      type="date"
                      id="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start_time" className="text-right">Heure de début</Label>
                    <Input
                      type="time"
                      id="start_time"
                      value={newSlot.start_time}
                      onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end_time" className="text-right">Heure de fin</Label>
                    <Input
                      type="time"
                      id="end_time"
                      value={newSlot.end_time}
                      onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="veterinarian_id" className="text-right">Vétérinaire</Label>
                    <Input
                      type="text"
                      id="veterinarian_id"
                      value={newSlot.veterinarian_id}
                      onChange={(e) => setNewSlot({ ...newSlot, veterinarian_id: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="consultation_type_id" className="text-right">Type de consultation</Label>
                    <Select onValueChange={(value) => setNewSlot({ ...newSlot, consultation_type_id: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {consultationTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="button" onClick={handleCreateSlot} className="bg-vet-sage hover:bg-vet-sage/90 text-white w-full" disabled={isCreating}>
                  {isCreating ? 'Création...' : 'Créer le créneau'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Liste des créneaux disponibles</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Vétérinaire</TableHead>
                  <TableHead>Consultation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slotsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Chargement...</TableCell>
                  </TableRow>
                ) : (
                  availableSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{format(new Date(slot.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{slot.start_time}</TableCell>
                      <TableCell>{slot.end_time}</TableCell>
                      <TableCell>{slot.veterinarian_id}</TableCell>
                      <TableCell>{slot.consultation_type_id}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleOpenUpdateDialog(slot)}
                          disabled={isUpdating}
                        >
                          Modifier
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={isDeleting}
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Update Slot Dialog */}
          {selectedSlotForUpdate && (
            <Dialog open={!!selectedSlotForUpdate} onOpenChange={() => setSelectedSlotForUpdate(null)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Modifier le créneau</DialogTitle>
                  <DialogDescription>
                    Mettre à jour les détails du créneau sélectionné
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input
                      type="date"
                      id="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start_time" className="text-right">Heure de début</Label>
                    <Input
                      type="time"
                      id="start_time"
                      value={newSlot.start_time}
                      onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end_time" className="text-right">Heure de fin</Label>
                    <Input
                      type="time"
                      id="end_time"
                      value={newSlot.end_time}
                      onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="veterinarian_id" className="text-right">Vétérinaire</Label>
                    <Input
                      type="text"
                      id="veterinarian_id"
                      value={newSlot.veterinarian_id}
                      onChange={(e) => setNewSlot({ ...newSlot, veterinarian_id: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="consultation_type_id" className="text-right">Type de consultation</Label>
                    <Select onValueChange={(value) => setNewSlot({ ...newSlot, consultation_type_id: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {consultationTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="button" onClick={handleUpdateSlot} className="bg-vet-sage hover:bg-vet-sage/90 text-white w-full" disabled={isUpdating}>
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour le créneau'}
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { ClinicSettingsForm };
