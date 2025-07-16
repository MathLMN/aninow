
import { Badge } from "@/components/ui/badge";
import { PawPrint } from "lucide-react";

interface AnimalInfoProps {
  appointment: any;
}

export const AnimalInfo = ({ appointment }: AnimalInfoProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-vet-navy flex items-center">
        <PawPrint className="h-4 w-4 mr-2" />
        Animal
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm pl-6">
        <div><strong>Nom:</strong> {appointment.animal_name}</div>
        <div><strong>Espèce:</strong> {appointment.animal_species}</div>
        {appointment.animal_breed && <div><strong>Race:</strong> {appointment.animal_breed}</div>}
        {appointment.animal_age && <div><strong>Âge:</strong> {appointment.animal_age}</div>}
        {appointment.animal_weight && <div><strong>Poids:</strong> {appointment.animal_weight} kg</div>}
        {appointment.animal_sex && <div><strong>Sexe:</strong> {appointment.animal_sex}</div>}
        {appointment.animal_sterilized !== null && (
          <div><strong>Stérilisé:</strong> {appointment.animal_sterilized ? 'Oui' : 'Non'}</div>
        )}
        {appointment.animal_vaccines_up_to_date !== null && (
          <div><strong>Vaccins à jour:</strong> {appointment.animal_vaccines_up_to_date ? 'Oui' : 'Non'}</div>
        )}
      </div>
    </div>
  );
};
