
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
      <CardHeader>
        <CardTitle className="flex items-center text-vet-navy">
          <UserCheck className="h-5 w-5 mr-2 text-vet-sage" />
          Préférence de vétérinaire
        </CardTitle>
        <CardDescription className="text-vet-brown">
          Choisissez un vétérinaire spécifique ou laissez le choix à la clinique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Option "Pas de préférence" */}
        <Button
          variant={selectedVeterinarian === null ? "default" : "outline"}
          className={`w-full justify-start h-auto p-4 ${
            selectedVeterinarian === null
              ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage"
              : "border-vet-blue/30 hover:bg-vet-blue/10 hover:border-vet-sage/50"
          }`}
          onClick={() => onVeterinarianSelect(null)}
        >
          <div className="flex items-center w-full">
            <Users className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Pas de préférence</div>
              <div className="text-sm opacity-80">
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
            className={`w-full justify-start h-auto p-4 ${
              selectedVeterinarian === vet.id
                ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage"
                : "border-vet-blue/30 hover:bg-vet-blue/10 hover:border-vet-sage/50"
            }`}
            onClick={() => onVeterinarianSelect(vet.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{vet.name}</div>
                  {vet.specialty && (
                    <div className="text-sm opacity-80">{vet.specialty}</div>
                  )}
                </div>
              </div>
              {vet.specialty && (
                <Badge variant="secondary" className="bg-vet-beige/30 text-vet-navy">
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
