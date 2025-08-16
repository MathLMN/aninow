
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Settings, RefreshCw } from "lucide-react";
import { ViewModeSelector } from "./ViewModeSelector";
import { SlotAssignmentSheet } from "./SlotAssignmentSheet";
import { RecurringBlocksModal } from "./RecurringBlocksModal";
import { useSlotAssignments } from "@/hooks/useSlotAssignments";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useVetAuth } from "@/hooks/useVetAuth";

interface PlanningHeaderProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  selectedDate?: Date;
}

export const PlanningHeader = ({ 
  viewMode, 
  onViewModeChange,
  selectedDate = new Date()
}: PlanningHeaderProps) => {
  const [isRecurringBlocksModalOpen, setIsRecurringBlocksModalOpen] = useState(false);
  const { veterinarians } = useClinicVeterinarians();
  const { assignments, refreshAssignments } = useSlotAssignments(selectedDate);
  const { currentUser } = useVetAuth();

  // Vérifier si l'utilisateur peut gérer les attributions (admin ou vétérinaire principal)
  const canManageAssignments = currentUser?.role === 'admin' || currentUser?.is_clinic_admin;

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-vet-navy">
                Planning des consultations
              </h1>
              <ViewModeSelector 
                viewMode={viewMode} 
                onViewModeChange={onViewModeChange} 
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Bouton Gérer les attributions */}
              <SlotAssignmentSheet
                assignments={assignments}
                veterinarians={veterinarians}
                selectedDate={selectedDate}
                onAssignmentsChange={refreshAssignments}
                canManageAssignments={canManageAssignments}
              />

              {/* Bouton Blocages récurrents */}
              <Button
                onClick={() => setIsRecurringBlocksModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Blocages récurrents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modale des blocages récurrents */}
      <RecurringBlocksModal
        isOpen={isRecurringBlocksModalOpen}
        onClose={() => setIsRecurringBlocksModalOpen(false)}
        veterinarians={veterinarians}
      />
    </>
  );
};
