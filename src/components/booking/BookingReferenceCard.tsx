import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface BookingReferenceCardProps {
  appointmentDate: string;
  appointmentTime: string;
}

export const BookingReferenceCard = ({ 
  appointmentDate, 
  appointmentTime 
}: BookingReferenceCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-vet-sage/10 to-vet-blue/10 border-vet-sage shadow-md mb-6">
      <CardContent className="pt-6 pb-6">
        <p className="text-sm text-vet-brown/70 mb-3 text-center">Votre créneau</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-vet-sage" />
            <span className="text-xl sm:text-2xl font-semibold text-vet-navy">
              {new Date(appointmentDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-vet-sage" />
            <span className="text-xl sm:text-2xl font-semibold text-vet-navy">{appointmentTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
