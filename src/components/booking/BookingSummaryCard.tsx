import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Phone, User, Heart } from "lucide-react";

interface BookingSummaryCardProps {
  appointmentDate: string;
  appointmentTime: string;
  clinicName: string;
  clinicAddress?: string;
  clinicPhone?: string;
  veterinarianName?: string;
  animalName: string;
  animalSpecies: string;
}

export const BookingSummaryCard = ({ 
  appointmentDate, 
  appointmentTime,
  clinicName,
  clinicAddress,
  clinicPhone,
  veterinarianName,
  animalName,
  animalSpecies
}: BookingSummaryCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-sage/30 shadow-lg mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-vet-navy">Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date et heure */}
        <div className="flex flex-wrap items-center gap-4 pb-3 border-b border-vet-beige/30">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-vet-sage" />
            <span className="text-base font-semibold text-vet-navy">
              {new Date(appointmentDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-vet-sage" />
            <span className="text-base font-semibold text-vet-navy">{appointmentTime}</span>
          </div>
        </div>

        {/* Détails */}
        <div className="space-y-3 text-sm">
          {/* Clinique */}
          <div>
            <p className="font-semibold text-vet-navy mb-1">{clinicName}</p>
            {clinicAddress && (
              <div className="flex items-start gap-2 text-vet-brown/80">
                <MapPin className="h-4 w-4 mt-0.5 text-vet-sage flex-shrink-0" />
                <span>{clinicAddress}</span>
              </div>
            )}
            {clinicPhone && (
              <div className="flex items-center gap-2 text-vet-brown/80 mt-1">
                <Phone className="h-4 w-4 text-vet-sage" />
                <span>{clinicPhone}</span>
              </div>
            )}
          </div>

          {/* Vétérinaire */}
          <div className="flex items-center gap-2 text-vet-brown/80">
            <User className="h-4 w-4 text-vet-sage" />
            <span>
              {veterinarianName ? (
                <span className="font-medium text-vet-navy">{veterinarianName}</span>
              ) : (
                <span className="italic">Vétérinaire à définir</span>
              )}
            </span>
          </div>

          {/* Animal */}
          <div className="flex items-center gap-2 text-vet-brown/80">
            <Heart className="h-4 w-4 text-vet-sage" />
            <span>
              <span className="font-medium text-vet-navy">{animalName}</span>
              <span className="text-vet-brown/60"> • {animalSpecies}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
