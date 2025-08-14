
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { Calendar, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { VeterinarianWeeklySchedule } from "./VeterinarianWeeklySchedule";

export const VeterinarianScheduleManager: React.FC = () => {
  const { veterinarians } = useClinicVeterinarians();
  const { schedules } = useVeterinarianSchedules();
  const [openVeterinarians, setOpenVeterinarians] = useState<Set<string>>(new Set());

  const toggleVeterinarian = (vetId: string) => {
    const newOpenVets = new Set(openVeterinarians);
    if (newOpenVets.has(vetId)) {
      newOpenVets.delete(vetId);
    } else {
      newOpenVets.add(vetId);
    }
    setOpenVeterinarians(newOpenVets);
  };

  const activeVeterinarians = veterinarians.filter(vet => vet.is_active);

  if (activeVeterinarians.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Horaires des vétérinaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-vet-brown bg-vet-beige/10 rounded-lg border border-vet-blue/20">
            <Clock className="h-8 w-8 mx-auto mb-2 text-vet-blue/60" />
            <p>Aucun vétérinaire actif</p>
            <p className="text-sm">Ajoutez d'abord des vétérinaires pour configurer leurs horaires</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Horaires des vétérinaires
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeVeterinarians.map(veterinarian => {
          const vetSchedules = schedules.filter(s => s.veterinarian_id === veterinarian.id);
          const isOpen = openVeterinarians.has(veterinarian.id);
          
          return (
            <Collapsible key={veterinarian.id} open={isOpen} onOpenChange={() => toggleVeterinarian(veterinarian.id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between p-4 h-auto bg-vet-beige/10 hover:bg-vet-beige/20 border-vet-blue/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-vet-blue" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-vet-blue" />
                      )}
                      <Clock className="h-4 w-4 text-vet-sage" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-vet-navy">{veterinarian.name}</div>
                      <div className="text-sm text-vet-brown">{veterinarian.specialty}</div>
                    </div>
                  </div>
                  <div className="text-xs text-vet-brown">
                    {isOpen ? 'Réduire' : 'Configurer les horaires'}
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3">
                <div className="border border-vet-blue/20 rounded-lg p-4 bg-white/50">
                  <VeterinarianWeeklySchedule
                    veterinarian={veterinarian}
                    schedules={vetSchedules}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};
