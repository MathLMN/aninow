
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { VeterinarianWeeklySchedule } from "./VeterinarianWeeklySchedule";
import { VeterinarianAbsenceManager } from "./VeterinarianAbsenceManager";

export const VeterinarianScheduleManager = () => {
  const { veterinarians, isLoading: isLoadingVets } = useClinicVeterinarians();
  const { schedules, isLoading: isLoadingSchedules } = useVeterinarianSchedules();

  if (isLoadingVets || isLoadingSchedules) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-8">
          <div className="text-center text-vet-brown">Chargement des horaires...</div>
        </CardContent>
      </Card>
    );
  }

  const activeVeterinarians = veterinarians.filter(vet => vet.is_active);

  if (activeVeterinarians.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Gestion des horaires et absences
          </CardTitle>
          <CardDescription>
            Configuration des horaires hebdomadaires et gestion des absences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-vet-brown">
            Aucun vétérinaire actif. Ajoutez d'abord des vétérinaires dans la section "Équipe vétérinaire" ci-dessus.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Gestion des horaires et absences
          </CardTitle>
          <CardDescription>
            Configuration des horaires hebdomadaires et gestion centralisée des absences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Weekly Schedules */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-vet-navy">Horaires hebdomadaires</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeVeterinarians.map((veterinarian) => {
            const vetSchedules = schedules.filter(s => s.veterinarian_id === veterinarian.id);

            return (
              <VeterinarianWeeklySchedule
                key={veterinarian.id}
                veterinarian={veterinarian}
                schedules={vetSchedules}
              />
            );
          })}
        </div>
      </div>

      {/* Unified Absence Management */}
      <VeterinarianAbsenceManager veterinarians={activeVeterinarians} />
    </div>
  );
};
