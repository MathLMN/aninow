
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ZoomIn, ZoomOut } from "lucide-react";
import { ViewModeSelector } from "./ViewModeSelector";
import { SlotAssignmentSheet } from "./SlotAssignmentSheet";
import { RecurringBlocksModal } from "./RecurringBlocksModal";
import { useSlotAssignments } from "@/hooks/useSlotAssignments";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useVetAuth } from "@/hooks/useVetAuth";
import type { ZoomLevel } from "@/pages/vet/VetPlanning";

interface PlanningHeaderProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  selectedDate?: Date;
  zoomLevel?: ZoomLevel;
  onZoomLevelChange?: (level: ZoomLevel) => void;
}

export const PlanningHeader = ({ 
  viewMode, 
  onViewModeChange,
  selectedDate = new Date(),
  zoomLevel = 'normal',
  onZoomLevelChange
}: PlanningHeaderProps) => {
  const [isRecurringBlocksModalOpen, setIsRecurringBlocksModalOpen] = useState(false);
  const { veterinarians } = useClinicVeterinarians();
  const { assignments, refreshAssignments } = useSlotAssignments(selectedDate);
  const { adminProfile, clinicAccess } = useVetAuth();

  // Vérifier si l'utilisateur peut gérer les attributions (admin ou vétérinaire principal)
  const canManageAssignments = !!adminProfile || (clinicAccess?.role === 'admin' || clinicAccess?.role === 'veterinarian');

  return (
    <>
      {/* Bandeau ultra-compact */}
      <div className="bg-white/90 backdrop-blur-sm border border-vet-blue/30 rounded-lg shadow-sm">
        <div className="px-3 py-1.5">
          <div className="flex items-center justify-between">
            {/* Sélecteur de vue à gauche */}
            <ViewModeSelector 
              viewMode={viewMode} 
              onViewModeChange={onViewModeChange} 
            />

            {/* Boutons d'action à droite - plus compacts */}
            <div className="flex items-center gap-1.5">
              {/* Sélecteur de zoom */}
              {onZoomLevelChange && (
                <div className="flex items-center gap-0.5 border rounded-md px-1 py-0.5 bg-white shadow-sm">
                  <Button
                    variant={zoomLevel === 'compact' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onZoomLevelChange('compact')}
                    className="h-7 px-2 text-[10px] font-medium"
                    title="Vue compacte (70%)"
                  >
                    70%
                  </Button>
                  <Button
                    variant={zoomLevel === 'normal' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onZoomLevelChange('normal')}
                    className="h-7 px-2 text-[10px] font-medium"
                    title="Vue normale (100%)"
                  >
                    100%
                  </Button>
                  <Button
                    variant={zoomLevel === 'large' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onZoomLevelChange('large')}
                    className="h-7 px-2 text-[10px] font-medium"
                    title="Vue large (140%)"
                  >
                    140%
                  </Button>
                </div>
              )}
              
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
                className="flex items-center gap-1 h-7 px-2 text-[10px]"
              >
                <Calendar className="h-3 w-3" />
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
