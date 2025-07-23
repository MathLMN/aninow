
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Veterinarian {
  id: string;
  name: string;
  specialty: string;
  is_active: boolean;
}

interface VeterinarianAbsence {
  id?: string;
  veterinarian_id: string;
  start_date: string;
  end_date: string;
  absence_type: string;
  reason?: string;
  is_recurring: boolean;
}

interface VeterinarianAbsenceCalendarProps {
  veterinarian: Veterinarian;
  absences: VeterinarianAbsence[];
}

const ABSENCE_TYPES = [
  { value: "vacation", label: "Congés" },
  { value: "sick", label: "Maladie" },
  { value: "training", label: "Formation" },
  { value: "other", label: "Autre" }
];

export const VeterinarianAbsenceCalendar: React.FC<VeterinarianAbsenceCalendarProps> = ({
  veterinarian,
  absences
}) => {
  const { addAbsence, deleteAbsence } = useVeterinarianAbsences();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAbsence, setNewAbsence] = useState({
    start_date: "",
    end_date: "",
    absence_type: "",
    reason: ""
  });

  const handleAddAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAbsence.start_date || !newAbsence.end_date || !newAbsence.absence_type) {
      return;
    }

    const success = await addAbsence({
      veterinarian_id: veterinarian.id,
      start_date: newAbsence.start_date,
      end_date: newAbsence.end_date,
      absence_type: newAbsence.absence_type,
      reason: newAbsence.reason || undefined,
      is_recurring: false
    });

    if (success) {
      setIsDialogOpen(false);
      setNewAbsence({
        start_date: "",
        end_date: "",
        absence_type: "",
        reason: ""
      });
    }
  };

  const handleDeleteAbsence = async (absenceId: string) => {
    await deleteAbsence(absenceId);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center text-lg">
          <CalendarDays className="h-5 w-5 mr-2" />
          Absences - {veterinarian.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-vet-blue hover:bg-vet-blue/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une absence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-vet-navy">Ajouter une absence</DialogTitle>
              <DialogDescription>
                Définissez une période d'absence pour {veterinarian.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAbsence}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newAbsence.start_date}
                      onChange={(e) => setNewAbsence(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newAbsence.end_date}
                      onChange={(e) => setNewAbsence(prev => ({ ...prev, end_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="absence-type">Type d'absence</Label>
                  <Select
                    value={newAbsence.absence_type}
                    onValueChange={(value) => setNewAbsence(prev => ({ ...prev, absence_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ABSENCE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reason">Raison (optionnel)</Label>
                  <Input
                    id="reason"
                    value={newAbsence.reason}
                    onChange={(e) => setNewAbsence(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Précisez la raison si nécessaire"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-vet-blue hover:bg-vet-blue/90 text-white">
                  Ajouter
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {absences.length === 0 ? (
            <div className="text-center py-8 text-vet-brown bg-vet-beige/10 rounded-lg border border-vet-blue/20">
              <CalendarDays className="h-8 w-8 mx-auto mb-2 text-vet-blue/60" />
              <p>Aucune absence programmée</p>
              <p className="text-sm">Ajoutez des absences pour bloquer des créneaux</p>
            </div>
          ) : (
            absences.map(absence => (
              <div key={absence.id} className="flex items-center justify-between p-3 bg-vet-beige/10 rounded-lg border border-vet-blue/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-vet-navy">
                      {ABSENCE_TYPES.find(t => t.value === absence.absence_type)?.label}
                    </span>
                  </div>
                  <p className="text-sm text-vet-brown">
                    {format(new Date(absence.start_date), "dd/MM/yyyy", { locale: fr })} 
                    {" - "}
                    {format(new Date(absence.end_date), "dd/MM/yyyy", { locale: fr })}
                  </p>
                  {absence.reason && (
                    <p className="text-xs text-vet-brown mt-1">{absence.reason}</p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette absence ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAbsence(absence.id!)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
