
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, User, AlertCircle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reassignSlot, deleteSlotAssignment, SlotAssignment } from './utils/slotAssignmentUtils';
import { useClinicAccess } from '@/hooks/useClinicAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SlotAssignmentSheetProps {
  assignments: SlotAssignment[];
  veterinarians: any[];
  selectedDate: Date;
  onAssignmentsChange: () => void;
  canManageAssignments: boolean;
}

export const SlotAssignmentSheet = ({
  assignments,
  veterinarians,
  selectedDate,
  onAssignmentsChange,
  canManageAssignments
}: SlotAssignmentSheetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { currentClinicId } = useClinicAccess();

  const handleReassign = async (assignment: SlotAssignment, newVetId: string) => {
    if (isLoading || !currentClinicId) return;
    
    setIsLoading(true);
    try {
      const success = await reassignSlot(
        assignment.date,
        assignment.time_slot,
        newVetId,
        currentClinicId
      );

      if (success) {
        toast({
          title: "Attribution modifiée",
          description: `Créneau ${assignment.time_slot} réassigné avec succès`,
        });
        onAssignmentsChange();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'attribution",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error reassigning slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'attribution",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (assignment: SlotAssignment) => {
    if (isLoading || !currentClinicId) return;
    
    setIsLoading(true);
    try {
      const success = await deleteSlotAssignment(assignment.date, assignment.time_slot, currentClinicId);

      if (success) {
        toast({
          title: "Attribution supprimée",
          description: `Attribution du créneau ${assignment.time_slot} supprimée`,
        });
        onAssignmentsChange();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'attribution",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error deleting assignment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'attribution",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVetName = (vetId: string) => {
    const vet = veterinarians.find(v => v.id === vetId);
    return vet?.name || 'Vétérinaire inconnu';
  };

  const todayAssignments = assignments.filter(
    assignment => assignment.date === selectedDate.toISOString().split('T')[0]
  );

  const renderAssignmentContent = () => {
    // Error handling for missing requirements
    if (!currentClinicId) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Accès clinique requis pour gérer les attributions.
          </AlertDescription>
        </Alert>
      );
    }

    if (!veterinarians || veterinarians.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucun vétérinaire actif trouvé. Veuillez d'abord ajouter des vétérinaires dans la section Paramètres pour pouvoir gérer les attributions.
          </AlertDescription>
        </Alert>
      );
    }

    if (todayAssignments.length === 0) {
      return (
        <p className="text-vet-brown text-sm text-center py-8">
          Aucune attribution spécifique pour cette date.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {todayAssignments.map((assignment) => (
          <div
            key={`${assignment.date}-${assignment.time_slot}`}
            className="flex items-center justify-between p-3 border border-vet-blue/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Badge
                variant={assignment.assignment_type === 'manual' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {assignment.time_slot}
              </Badge>
              <span className="text-sm font-medium text-vet-navy">
                {getVetName(assignment.veterinarian_id)}
              </span>
              <Badge
                variant="outline"
                className={assignment.assignment_type === 'manual' ? 'border-blue-500' : 'border-gray-400'}
              >
                {assignment.assignment_type === 'manual' ? 'Manuel' : 'Auto'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={assignment.veterinarian_id}
                onValueChange={(newVetId) => handleReassign(assignment, newVetId)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {veterinarians.filter(vet => vet.is_active).map((vet) => (
                    <SelectItem key={vet.id} value={vet.id}>
                      {vet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(assignment)}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="flex items-center gap-2"
          disabled={!canManageAssignments}
        >
          <Settings className="h-4 w-4" />
          Gérer les attributions
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-vet-navy flex items-center gap-2">
            <User className="h-5 w-5" />
            Attributions des créneaux ({todayAssignments.length})
          </SheetTitle>
          <SheetDescription>
            Gérez les attributions de vétérinaires pour les créneaux du {selectedDate.toLocaleDateString('fr-FR')}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {renderAssignmentContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
