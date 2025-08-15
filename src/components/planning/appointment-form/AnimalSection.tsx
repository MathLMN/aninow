
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint } from "lucide-react";

interface AnimalSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string) => void;
}

export const AnimalSection = ({ formData, onFieldUpdate }: AnimalSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center mb-3">
        <PawPrint className="h-5 w-5 mr-2 text-amber-600" />
        <h3 className="font-semibold text-amber-900 text-lg">Animal</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="animal_name" className="text-xs font-medium text-gray-700">Nom *</Label>
          <Input
            id="animal_name"
            value={formData.animal_name}
            onChange={(e) => onFieldUpdate('animal_name', e.target.value)}
            required
            className="h-8 text-sm"
            placeholder="Nom de l'animal"
          />
        </div>
        
        <div>
          <Label htmlFor="animal_species" className="text-xs font-medium text-gray-700">Espèce *</Label>
          <Select value={formData.animal_species} onValueChange={(value) => onFieldUpdate('animal_species', value)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chien">Chien</SelectItem>
              <SelectItem value="Chat">Chat</SelectItem>
              <SelectItem value="Lapin">Lapin</SelectItem>
              <SelectItem value="Oiseau">Oiseau</SelectItem>
              <SelectItem value="Hamster">Hamster</SelectItem>
              <SelectItem value="Reptile">Reptile</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="animal_breed" className="text-xs font-medium text-gray-700">Race</Label>
          <Input
            id="animal_breed"
            value={formData.animal_breed}
            onChange={(e) => onFieldUpdate('animal_breed', e.target.value)}
            className="h-8 text-sm"
            placeholder="Race de l'animal"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="animal_age" className="text-xs font-medium text-gray-700">Âge</Label>
            <Input
              id="animal_age"
              value={formData.animal_age}
              onChange={(e) => onFieldUpdate('animal_age', e.target.value)}
              placeholder="3 ans"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="animal_weight" className="text-xs font-medium text-gray-700">Poids (kg)</Label>
            <Input
              id="animal_weight"
              type="number"
              step="0.1"
              value={formData.animal_weight}
              onChange={(e) => onFieldUpdate('animal_weight', e.target.value)}
              className="h-8 text-sm"
              placeholder="5.2"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="animal_sex" className="text-xs font-medium text-gray-700">Sexe</Label>
          <Select value={formData.animal_sex} onValueChange={(value) => onFieldUpdate('animal_sex', value)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mâle">Mâle</SelectItem>
              <SelectItem value="Femelle">Femelle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
