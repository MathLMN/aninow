
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const { adminProfile, clinicAccess } = useVetAuth();

  // Vérifier si l'utilisateur peut gérer les attributions (admin ou vétérinaire principal)
  const canManageAssignments = !!adminProfile || (clinicAccess?.role === 'admin' || clinicAccess?.role === 'veterinarian');

  return (
    <>
      {/* Bandeau ultra-compact - hauteur minimale */}
      <div className="bg-white/90 backdrop-blur-sm border border-vet-blue/30 rounded-lg shadow-sm">
        <div className="px-2 py-1">
          <div className="flex items-center justify-between">
            {/* Sélecteur de vue à gauche */}
            <ViewModeSelector 
              viewMode={viewMode} 
              onViewModeChange={onViewModeChange} 
            />

            {/* Boutons d'action à droite - ultra-compacts */}
            <div className="flex items-center gap-1">
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
                className="flex items-center gap-0.5 h-6 px-1.5 text-[9px]"
              >
                <Calendar className="h-2.5 w-2.5" />
                Blocages
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modale des blocages récurrents */}
      <RecurringBlocksModal
        isOpen={isRecurringBlocksModalOpen}
        onClose={() => setIsRecurringBlocksModalOpen(false)}
        veterinarians={veterinarians}
      />
    </>
  );
};
