
import { ViewModeSelector } from "./ViewModeSelector";

type ViewMode = 'daily' | 'weekly';

interface PlanningHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const PlanningHeader = ({ viewMode, onViewModeChange }: PlanningHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-vet-navy">Planning des Rendez-vous</h1>
        <p className="text-vet-brown">Gestion centralisée de tous les rendez-vous</p>
      </div>
      <div className="flex items-center space-x-3">
        <ViewModeSelector viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </div>
  );
};
