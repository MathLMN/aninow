
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Users } from "lucide-react";

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
      <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Option "Pas de préférence" */}
        <Button
          variant={selectedVeterinarian === null ? "default" : "outline"}
          className={`w-full justify-start h-auto p-3 sm:p-4 text-left ${
            selectedVeterinarian === null
              ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage"
              : "border-vet-blue/30 hover:bg-vet-blue/10 hover:border-vet-sage/50"
          }`}
          onClick={() => onVeterinarianSelect(null)}
        >
          <div className="flex items-center w-full">
            <Users className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <div className="font-medium text-xs sm:text-sm">Pas de préférence</div>
              <div className="text-xs opacity-80 truncate">
                Voir tous les créneaux disponibles
              </div>
            </div>
          </div>
        </Button>

        {/* Liste des vétérinaires */}
        {veterinarians.map((vet) => (
          <Button
            key={vet.id}
            variant={selectedVeterinarian === vet.id ? "default" : "outline"}
            className={`w-full justify-start h-auto p-3 sm:p-4 text-left ${
              selectedVeterinarian === vet.id
                ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage"
                : "border-vet-blue/30 hover:bg-vet-blue/10 hover:border-vet-sage/50"
            }`}
            onClick={() => onVeterinarianSelect(vet.id)}
          >
            <div className="flex items-center justify-between w-full min-w-0">
              <div className="flex items-center min-w-0 flex-1 mr-2">
                <UserCheck className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm truncate">{vet.name}</div>
                  {vet.specialty && (
                    <div className="text-xs opacity-80 truncate">{vet.specialty}</div>
                  )}
                </div>
              </div>
              {vet.specialty && (
                <Badge variant="secondary" className="bg-vet-beige/30 text-vet-navy text-xs flex-shrink-0 hidden sm:inline-flex">
                  {vet.specialty}
                </Badge>
              )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
