
import { Button } from "@/components/ui/button";
import { CalendarDays, List } from "lucide-react";

type ViewMode = 'daily' | 'weekly';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeSelector = ({ viewMode, onViewModeChange }: ViewModeSelectorProps) => {
  return (
    <div className="flex items-center border border-vet-blue/30 rounded-lg bg-white">
      <Button
        variant={viewMode === 'daily' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('daily')}
        className={viewMode === 'daily' ? 'bg-vet-sage hover:bg-vet-sage/90 text-white' : 'text-vet-navy hover:bg-vet-sage/10'}
      >
        <CalendarDays className="h-4 w-4 mr-2" />
        Jour
      </Button>
      <Button
        variant={viewMode === 'weekly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('weekly')}
        className={viewMode === 'weekly' ? 'bg-vet-sage hover:bg-vet-sage/90 text-white' : 'text-vet-navy hover:bg-vet-sage/10'}
      >
        <List className="h-4 w-4 mr-2" />
        Semaine
      </Button>
    </div>
  );
};
