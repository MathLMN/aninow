import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface BookingReferenceCardProps {
  bookingId: string;
  appointmentDate: string;
  appointmentTime: string;
}

export const BookingReferenceCard = ({ 
  bookingId, 
  appointmentDate, 
  appointmentTime 
}: BookingReferenceCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-vet-sage/10 to-vet-blue/10 border-vet-sage shadow-md mb-6">
      <CardContent className="pt-6 text-center">
        <p className="text-sm text-vet-brown/70 mb-2">Numéro de référence</p>
        <p className="text-3xl sm:text-4xl font-bold text-vet-navy mb-4">
          #RDV-{bookingId.slice(0, 8).toUpperCase()}
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-vet-brown">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-vet-sage" />
            <span>
              {new Date(appointmentDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-vet-sage" />
            <span>{appointmentTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
