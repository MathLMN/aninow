
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import VetLayout from "@/components/layout/VetLayout";

const VetSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Données temporaires pour le planning
  const appointments = [
    { id: 1, time: "09:00", duration: 30, pet: "Max", owner: "M. Dupont", type: "Consultation" },
    { id: 2, time: "09:30", duration: 30, pet: "Luna", owner: "Mme Martin", type: "Vaccination" },
    { id: 3, time: "10:30", duration: 60, pet: "Rex", owner: "M. Bernard", type: "Chirurgie" },
    { id: 4, time: "14:00", duration: 30, pet: "Bella", owner: "Mme Leroy", type: "Consultation" },
  ];

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(8 + i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  return (
    <VetLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-vet-navy">Planning</h1>
            <p className="text-vet-brown">Gestion de vos rendez-vous</p>
          </div>
          <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>

        {/* Navigation de date */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateDate('prev')}
                className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-vet-navy">
                  {currentDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h2>
                <p className="text-vet-brown">{appointments.length} rendez-vous prévus</p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateDate('next')}
                className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Planning */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader>
            <CardTitle className="flex items-center text-vet-navy">
              <Calendar className="h-5 w-5 mr-2 text-vet-sage" />
              Planning du jour
            </CardTitle>
            <CardDescription className="text-vet-brown">
              Cette vue sera remplacée par le planning détaillé selon vos captures d'écran
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder pour le planning détaillé */}
            <div className="bg-vet-beige/30 border-2 border-dashed border-vet-blue rounded-lg p-8 mb-6">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-vet-sage mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-vet-navy mb-2">
                  Planning interactif en cours d'intégration
                </h3>
                <p className="text-vet-brown mb-4">
                  Le planning détaillé sera créé selon vos captures d'écran
                </p>
                <div className="space-y-2 text-vet-brown text-left max-w-md mx-auto">
                  <p>• Vue hebdomadaire et quotidienne</p>
                  <p>• Glisser-déposer pour déplacer les RDV</p>
                  <p>• Codes couleur par type de consultation</p>
                  <p>• Gestion des créneaux libres</p>
                  <p>• Export et synchronisation</p>
                </div>
              </div>
            </div>

            {/* Liste temporaire des RDV */}
            <div className="space-y-3">
              <h4 className="font-semibold text-vet-navy mb-4">Rendez-vous du jour :</h4>
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-vet-beige/20 rounded-lg border border-vet-blue/20">
                  <div className="flex items-center space-x-4">
                    <div className="bg-vet-sage text-white rounded-lg px-3 py-2 text-sm font-semibold">
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-semibold text-vet-navy">{appointment.pet}</p>
                      <p className="text-sm text-vet-brown">{appointment.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-vet-navy">{appointment.type}</p>
                      <p className="text-xs text-vet-brown">{appointment.duration} min</p>
                    </div>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" className="border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </VetLayout>
  );
};

export default VetSchedule;
