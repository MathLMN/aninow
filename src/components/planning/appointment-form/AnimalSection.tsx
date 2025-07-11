
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
    <div className="space-y-4">
      <h3 className="font-semibold text-vet-navy flex items-center">
        <PawPrint className="h-4 w-4 mr-2" />
        Informations animal
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="animal_name">Nom de l'animal *</Label>
          <Input
            id="animal_name"
            value={formData.animal_name}
            onChange={(e) => onFieldUpdate('animal_name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="animal_species">Espèce *</Label>
          <Select value={formData.animal_species} onValueChange={(value) => onFieldUpdate('animal_species', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez l'espèce" />
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
          <Label htmlFor="animal_breed">Race</Label>
          <Input
            id="animal_breed"
            value={formData.animal_breed}
            onChange={(e) => onFieldUpdate('animal_breed', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="animal_age">Âge</Label>
          <Input
            id="animal_age"
            value={formData.animal_age}
            onChange={(e) => onFieldUpdate('animal_age', e.target.value)}
            placeholder="ex: 3 ans"
          />
        </div>
        <div>
          <Label htmlFor="animal_weight">Poids (kg)</Label>
          <Input
            id="animal_weight"
            type="number"
            step="0.1"
            value={formData.animal_weight}
            onChange={(e) => onFieldUpdate('animal_weight', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="animal_sex">Sexe</Label>
          <Select value={formData.animal_sex} onValueChange={(value) => onFieldUpdate('animal_sex', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le sexe" />
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
