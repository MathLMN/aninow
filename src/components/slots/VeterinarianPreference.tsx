
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck } from "lucide-react";

interface VeterinarianPreferenceProps {
  veterinarians: Array<{
    id: string;
    name: string;
    specialty?: string;
  }>;
  selectedVeterinarian: string | null;
  onVeterinarianSelect: (veterinarianId: string | null) => void;
}

export const VeterinarianPreference = ({
  veterinarians,
  selectedVeterinarian,
  onVeterinarianSelect
}: VeterinarianPreferenceProps) => {
  const handleValueChange = (value: string) => {
    if (value === "no-preference") {
      onVeterinarianSelect(null);
    } else {
      onVeterinarianSelect(value);
    }
  };

  const getCurrentValue = () => {
    if (selectedVeterinarian === null) {
      return "no-preference";
    }
    return selectedVeterinarian;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg">
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="flex items-center text-vet-navy text-lg sm:text-xl">
          <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-vet-sage flex-shrink-0" />
          <span className="text-sm sm:text-base">Préférence de vétérinaire</span>
        </CardTitle>
        <CardDescription className="text-vet-brown text-xs sm:text-sm">
          Choisissez un vétérinaire spécifique ou laissez le choix à la clinique
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <Select value={getCurrentValue()} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage/20">
            <SelectValue placeholder="Sélectionnez un vétérinaire..." />
          </SelectTrigger>
          <SelectContent className="bg-white border-vet-blue/30 shadow-lg">
            <SelectItem 
              value="no-preference"
              className="focus:bg-vet-sage/10 focus:text-vet-navy"
            >
              Pas de préférence
            </SelectItem>
            {veterinarians.map((vet) => (
              <SelectItem 
                key={vet.id} 
                value={vet.id}
                className="focus:bg-vet-sage/10 focus:text-vet-navy"
              >
                {vet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
