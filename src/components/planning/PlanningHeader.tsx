
import { ViewModeSelector } from "./ViewModeSelector";
import { PendingBookingsNotification } from "./PendingBookingsNotification";

interface PlanningHeaderProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const PlanningHeader = ({ viewMode, onViewModeChange }: PlanningHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-vet-navy mb-2">
          Planning des consultations
        </h1>
        <p className="text-vet-brown/80">
          Gérez vos rendez-vous et créneaux de consultation
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <PendingBookingsNotification />
        <ViewModeSelector 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
};
