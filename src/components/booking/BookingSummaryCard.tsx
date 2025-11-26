import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Phone, User, Heart, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update isOpen once isMobile is determined
    setIsOpen(!isMobile);
  }, [isMobile]);
  
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-sage/30 shadow-lg mb-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-1 pt-2">
          <CollapsibleTrigger className="w-full flex items-center justify-between hover:opacity-80 transition-opacity">
            <CardTitle className="text-xs font-bold text-vet-navy">
              Voir le récapitulatif du rendez-vous demandé
            </CardTitle>
            <ChevronDown 
              className={`h-4 w-4 text-vet-navy transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-1.5 pb-2">
            {/* Date et heure */}
            <div className="flex flex-wrap items-center gap-2 pb-1.5 border-b border-vet-beige/30">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-vet-sage" />
                <span className="text-xs font-semibold text-vet-navy">
                  {new Date(appointmentDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-vet-sage" />
                <span className="text-xs font-semibold text-vet-navy">{appointmentTime}</span>
              </div>
            </div>

            {/* Détails compacts */}
            <div className="space-y-1 text-[10px]">
              {/* Clinique */}
              <div>
                <p className="font-semibold text-vet-navy text-xs">{clinicName}</p>
                {clinicAddress && (
                  <div className="flex items-start gap-1 text-vet-brown/80 mt-0.5">
                    <MapPin className="h-3 w-3 mt-0.5 text-vet-sage flex-shrink-0" />
                    <span>{clinicAddress}</span>
                  </div>
                )}
                {clinicPhone && (
                  <div className="flex items-center gap-1 text-vet-brown/80 mt-0.5">
                    <Phone className="h-3 w-3 text-vet-sage" />
                    <span>{clinicPhone}</span>
                  </div>
                )}
              </div>

              {/* Vétérinaire et Animal sur même ligne */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex items-center gap-1 text-vet-brown/80">
                  <User className="h-3 w-3 text-vet-sage" />
                  <span>
                    {veterinarianName ? (
                      <span className="font-medium text-vet-navy text-[10px]">{veterinarianName}</span>
                    ) : (
                      <span className="italic">Vét. à définir</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-vet-brown/80">
                  <Heart className="h-3 w-3 text-vet-sage" />
                  <span>
                    <span className="font-medium text-vet-navy text-[10px]">{animalName}</span>
                    <span className="text-vet-brown/60"> • {animalSpecies}</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
