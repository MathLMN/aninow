
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react";

interface PlanningFiltersProps {
  filters: {
    veterinarian: string;
    status: string;
    consultationType: string;
  };
  onFiltersChange: (newFilters: any) => void;
  veterinarians: any[];
  consultationTypes: any[];
}

export const PlanningFilters = ({
  filters,
  onFiltersChange,
  veterinarians,
  consultationTypes
}: PlanningFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      veterinarian: '',
      status: '',
      consultationType: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="flex items-center space-x-3 flex-wrap gap-2">
      <div className="flex items-center text-vet-navy">
        <Filter className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">Filtres:</span>
      </div>

      <Select value={filters.veterinarian} onValueChange={(value) => updateFilter('veterinarian', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Vétérinaire" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les vétérinaires</SelectItem>
          {veterinarians.map((vet) => (
            <SelectItem key={vet.id} value={vet.id}>
              {vet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les statuts</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="confirmed">Confirmé</SelectItem>
          <SelectItem value="cancelled">Annulé</SelectItem>
          <SelectItem value="completed">Terminé</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.consultationType} onValueChange={(value) => updateFilter('consultationType', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Type consultation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les types</SelectItem>
          {consultationTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-vet-brown hover:text-vet-navy"
        >
          <X className="h-4 w-4 mr-1" />
          Effacer
        </Button>
      )}
    </div>
  );
};
