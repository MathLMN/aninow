
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlanningFilters } from "./PlanningFilters";

interface WeeklyNavigationProps {
  weekDates: Date[];
  filters: {
    veterinarian: string;
    status: string;
    consultationType: string;
  };
  onFiltersChange: (filters: any) => void;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
  veterinarians: any[];
  consultationTypes: any[];
}

export const WeeklyNavigation = ({
  weekDates,
  filters,
  onFiltersChange,
  onNavigateWeek,
  onTodayClick,
  veterinarians,
  consultationTypes
}: WeeklyNavigationProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      {/* Navigation semaine */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateWeek('prev')}
          className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-vet-navy">
            Semaine du {weekDates[0].toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateWeek('next')}
          className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onTodayClick}
          className="text-vet-blue hover:bg-vet-blue/10"
        >
          Aujourd'hui
        </Button>
      </div>

      {/* Filtres */}
      <PlanningFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        veterinarians={veterinarians}
        consultationTypes={consultationTypes}
      />
    </div>
  );
};
