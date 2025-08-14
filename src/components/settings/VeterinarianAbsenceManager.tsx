import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface Veterinarian {
  id: string;
  name: string;
  specialty: string;
  is_active: boolean;
}

interface VeterinarianAbsenceManagerProps {
  veterinarians: Veterinarian[];
}

const ABSENCE_TYPES = [
  { value: 'vacation', label: 'Congés' },
  { value: 'sick_leave', label: 'Arrêt maladie' },
  { value: 'training', label: 'Formation' },
  { value: 'other', label: 'Autre' }
];

export const VeterinarianAbsenceManager = ({ veterinarians }: VeterinarianAbsenceManagerProps) => {
  const { absences, addAbsence, updateAbsence, deleteAbsence, isLoading } = useVeterinarianAbsences();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<any>(null);
  const [formData, setFormData] = useState({
    veterinarian_id: '',
    absence_type: 'vacation',
    start_date: '',
    end_date: '',
    is_recurring: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.veterinarian_id || !formData.start_date || !formData.end_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être postérieure à la date de début",
        variant: "destructive"
      });
      return;
    }

    const success = editingAbsence 
      ? await updateAbsence(editingAbsence.id, formData)
      : await addAbsence(formData);

    if (success) {
      setIsDialogOpen(false);
      setEditingAbsence(null);
      setFormData({
        veterinarian_id: '',
        absence_type: 'vacation',
        start_date: '',
        end_date: '',
        is_recurring: false
      });
    }
  };

  const handleEdit = (absence: any) => {
    setEditingAbsence(absence);
    setFormData({
      veterinarian_id: absence.veterinarian_id,
      absence_type: absence.absence_type,
      start_date: absence.start_date,
      end_date: absence.end_date,
      is_recurring: absence.is_recurring
    });
    setIsDialogOpen(true);
  };

  const getVeterinarianName = (veterinarianId: string) => {
    const vet = veterinarians.find(v => v.id === veterinarianId);
    return vet?.name || 'Vétérinaire inconnu';
  };

  const getAbsenceTypeLabel = (type: string) => {
    const absenceType = ABSENCE_TYPES.find(t => t.value === type);
    return absenceType?.label || type;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center">
          <CalendarDays className="h-5 w-5 mr-2" />
          Gestion des absences
        </CardTitle>
        <CardDescription>
          Planifiez les absences de vos vétérinaires pour bloquer automatiquement les créneaux dans le planning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-vet-navy">Absences programmées</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingAbsence(null);
                  setFormData({
                    veterinarian_id: '',
                    absence_type: 'vacation',
                    start_date: '',
                    end_date: '',
                    is_recurring: false
                  });
                }}
                className="bg-vet-blue hover:bg-vet-blue/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une absence
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-vet-navy">
                  {editingAbsence ? 'Modifier l\'absence' : 'Ajouter une absence'}
                </DialogTitle>
                <DialogDescription>
                  Planifiez une période d'absence pour bloquer automatiquement les créneaux dans le planning.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="veterinarian">Vétérinaire *</Label>
                    <Select
                      value={formData.veterinarian_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, veterinarian_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un vétérinaire" />
                      </SelectTrigger>
                      <SelectContent>
                        {veterinarians.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            {vet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="absence-type">Type d'absence *</Label>
                    <Select
                      value={formData.absence_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, absence_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type d'absence" />
                      </SelectTrigger>
                      <SelectContent>
                        {ABSENCE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Date de début *</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Date de fin *</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-vet-blue hover:bg-vet-blue/90 text-white">
                    {editingAbsence ? 'Modifier' : 'Ajouter'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {absences.length === 0 ? (
            <div className="text-center py-8 text-vet-brown bg-vet-beige/10 rounded-lg border border-vet-blue/20">
              <CalendarDays className="h-8 w-8 mx-auto mb-2 text-vet-blue/60" />
              <p>Aucune absence programmée</p>
              <p className="text-sm">Les absences planifiées apparaîtront ici</p>
            </div>
          ) : (
            absences.map((absence) => (
              <div key={absence.id} className="border border-vet-blue/20 rounded-lg p-4 bg-vet-beige/5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-vet-navy">
                        {getVeterinarianName(absence.veterinarian_id)}
                      </h4>
                      <Badge variant="outline" className="bg-vet-sage/10 text-vet-sage border-vet-sage/30">
                        {getAbsenceTypeLabel(absence.absence_type)}
                      </Badge>
                    </div>
                    <div className="text-sm text-vet-brown space-y-1">
                      <p>
                        <strong>Du :</strong> {format(parseISO(absence.start_date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      <p>
                        <strong>Au :</strong> {format(parseISO(absence.end_date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(absence)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
                            Les créneaux redeviendront disponibles à la réservation.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteAbsence(absence.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Information importante</p>
              <p className="text-amber-700">
                Les absences programmées bloquent automatiquement la prise de rendez-vous en ligne 
                pour les vétérinaires concernés. Les colonnes des vétérinaires absents apparaîtront 
                grisées dans le planning pendant leurs périodes d'absence.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
