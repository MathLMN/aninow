import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, User, Heart } from "lucide-react";

interface ClinicDetailsCardProps {
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
  veterinarianName?: string;
  animalName: string;
  animalSpecies: string;
}

export const ClinicDetailsCard = ({
  clinicName,
  clinicAddress,
  clinicPhone,
  veterinarianName,
  animalName,
  animalSpecies
}: ClinicDetailsCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-sage/30 shadow-lg mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-vet-navy">Détails du rendez-vous</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Animal */}
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 text-vet-sage mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-vet-navy text-sm">Votre animal</p>
            <p className="text-vet-brown">
              {animalName} • {animalSpecies}
            </p>
          </div>
        </div>

        {/* Vétérinaire */}
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-vet-sage mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-vet-navy text-sm">Vétérinaire</p>
            <p className="text-vet-brown">
              {veterinarianName || "À définir par la clinique"}
            </p>
          </div>
        </div>

        {/* Clinique et adresse */}
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-vet-sage mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-vet-navy text-sm">Clinique</p>
            <p className="text-vet-brown">{clinicName}</p>
            {clinicAddress && (
              <p className="text-sm text-vet-brown/70 mt-1">{clinicAddress}</p>
            )}
          </div>
        </div>

        {/* Téléphone */}
        {clinicPhone && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-vet-sage mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-vet-navy text-sm">Contact</p>
              <a 
                href={`tel:${clinicPhone}`}
                className="text-vet-brown hover:text-vet-sage transition-colors"
              >
                {clinicPhone}
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
