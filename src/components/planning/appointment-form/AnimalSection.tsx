
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";

interface AnimalSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string | number) => void;
}

export const AnimalSection = ({ formData, onFieldUpdate }: AnimalSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center mb-3">
        <Heart className="h-5 w-5 mr-2 text-amber-600" />
        <h3 className="font-semibold text-amber-900 text-lg">Animal</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="animal_name" className="text-xs font-medium text-gray-700">Nom *</Label>
          <Input
            id="animal_name"
            type="text"
            placeholder="Nom de l'animal"
            value={formData.animal_name}
            onChange={(e) => onFieldUpdate('animal_name', e.target.value)}
            required
            className="h-8 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="animal_species" className="text-xs font-medium text-gray-700">Espèce *</Label>
          <Select 
            value={formData.animal_species} 
            onValueChange={(value) => onFieldUpdate('animal_species', value)}
            required
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sélectionnez l'espèce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chien">Chien</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="lapin">Lapin</SelectItem>
              <SelectItem value="furet">Furet</SelectItem>
              <SelectItem value="oiseau">Oiseau</SelectItem>
              <SelectItem value="reptile">Reptile</SelectItem>
              <SelectItem value="rongeur">Rongeur</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="animal_breed" className="text-xs font-medium text-gray-700">Race</Label>
          <Input
            id="animal_breed"
            type="text"
            placeholder="Race de l'animal"
            value={formData.animal_breed}
            onChange={(e) => onFieldUpdate('animal_breed', e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="animal_age" className="text-xs font-medium text-gray-700">Âge</Label>
            <Select value={formData.animal_age} onValueChange={(value) => onFieldUpdate('animal_age', value)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Âge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-6 mois">0-6 mois</SelectItem>
                <SelectItem value="6 mois à 1 an">6 mois à 1 an</SelectItem>
                <SelectItem value="1 à 2 ans">1 à 2 ans</SelectItem>
                <SelectItem value="2 à 5 ans">2 à 5 ans</SelectItem>
                <SelectItem value="5 à 8 ans">5 à 8 ans</SelectItem>
                <SelectItem value="8 à 12 ans">8 à 12 ans</SelectItem>
                <SelectItem value="Plus de 12 ans">Plus de 12 ans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="animal_weight" className="text-xs font-medium text-gray-700">Poids (kg)</Label>
            <Input
              id="animal_weight"
              type="number"
              step="0.1"
              placeholder="Poids"
              value={formData.animal_weight}
              onChange={(e) => onFieldUpdate('animal_weight', e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="animal_sex" className="text-xs font-medium text-gray-700">Sexe</Label>
          <Select value={formData.animal_sex} onValueChange={(value) => onFieldUpdate('animal_sex', value)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Mâle</SelectItem>
              <SelectItem value="femelle">Femelle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
