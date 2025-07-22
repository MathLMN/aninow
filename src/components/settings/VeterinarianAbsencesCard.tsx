
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { VeterinarianAbsence, useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VeterinarianAbsencesCardProps {
  veterinarian: {
    id: string;
    name: string;
  };
  absences: any[];
}

export const VeterinarianAbsencesCard: React.FC<VeterinarianAbsencesCardProps> = ({
  veterinarian,
  absences
}) => {
  const { addAbsence, deleteAbsence } = useVeterinarianAbsences();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [absenceFormData, setAbsenceFormData] = useState({
    start_date: '',
    end_date: '',
    absence_type: 'vacation',
    reason: '',
    is_recurring: false
  });

  const handleSubmitAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await addAbsence({
      veterinarian_id: veterinarian.id,
      ...absenceFormData
    });
    
    if (success) {
      setIsAddModalOpen(false);
      setAbsenceFormData({
        start_date: '',
        end_date: '',
        absence_type: 'vacation',
        reason: '',
        is_recurring: false
      });
    }
  };

  const handleDeleteAbsence = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
      await deleteAbsence(id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getAbsenceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'vacation': 'Vacances',
      'sick': 'Maladie',
      'training': 'Formation',
      'other': 'Autre'
    };
    return types[type] || type;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-vet-navy flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Absences - Dr. {veterinarian.name}
        </CardTitle>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une absence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une absence</DialogTitle>
              <DialogDescription>
                Ajoutez une période d'absence pour Dr. {veterinarian.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitAbsence} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={absenceFormData.start_date}
                    onChange={(e) => setAbsenceFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Date de fin *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={absenceFormData.end_date}
                    onChange={(e) => setAbsenceFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="absence_type">Type d'absence</Label>
                <Select
                  value={absenceFormData.absence_type}
                  onValueChange={(value) => setAbsenceFormData(prev => ({ ...prev, absence_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacances</SelectItem>
                    <SelectItem value="sick">Maladie</SelectItem>
                    <SelectItem value="training">Formation</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reason">Motif (optionnel)</Label>
                <Input
                  id="reason"
                  value={absenceFormData.reason}
                  onChange={(e) => setAbsenceFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Détails de l'absence..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_recurring"
                  checked={absenceFormData.is_recurring}
                  onCheckedChange={(checked) => setAbsenceFormData(prev => ({ ...prev, is_recurring: checked }))}
                />
                <Label htmlFor="is_recurring">Absence récurrente</Label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                  Ajouter
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {absences.length === 0 ? (
          <div className="text-center py-8 text-vet-brown">
            Aucune absence programmée
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Récurrente</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absences.map((absence) => (
                  <TableRow key={absence.id}>
                    <TableCell>
                      {formatDate(absence.start_date)} - {formatDate(absence.end_date)}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-vet-sage/10 text-vet-sage">
                        {getAbsenceTypeLabel(absence.absence_type)}
                      </span>
                    </TableCell>
                    <TableCell>{absence.reason || '-'}</TableCell>
                    <TableCell>
                      {absence.is_recurring ? (
                        <span className="text-xs text-vet-sage">Oui</span>
                      ) : (
                        <span className="text-xs text-gray-500">Non</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAbsence(absence.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
