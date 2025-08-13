
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { VeterinarianWeeklySchedule } from "./VeterinarianWeeklySchedule";
import { VeterinarianAbsenceManager } from "./VeterinarianAbsenceManager";
import { Veterinarian } from "@/types/veterinarian.types";

export const VeterinarianScheduleManager = () => {
  const {
    veterinarians,
    isLoading: isLoadingVets
  } = useClinicVeterinarians();
  const {
    schedules,
    isLoading: isLoadingSchedules
  } = useVeterinarianSchedules();
  const {
    absences,
    isLoading: isLoadingAbsences
  } = useVeterinarianAbsences();

  if (isLoadingVets || isLoadingSchedules || isLoadingAbsences) {
    return <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-8">
          <div className="text-center text-vet-brown">Chargement des horaires et absences...</div>
        </CardContent>
      </Card>;
  }

  const activeVeterinarians: Veterinarian[] = veterinarians.filter((vet: Veterinarian) => vet.is_active);

  if (activeVeterinarians.length === 0) {
    return <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Gestion des horaires et absences
          </CardTitle>
          <CardDescription>
            Configuration rapide des horaires hebdomadaires et gestion des absences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-vet-brown">
            Aucun vétérinaire actif. Ajoutez d'abord des vétérinaires dans la section "Équipe vétérinaire" ci-dessus.
          </div>
        </CardContent>
      </Card>;
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
            Configuration rapide des horaires hebdomadaires et gestion des absences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Weekly Schedules */}
      {activeVeterinarians.map((veterinarian: Veterinarian) => (
        <VeterinarianWeeklySchedule
          key={veterinarian.id}
          veterinarian={veterinarian}
          schedules={schedules.filter(s => s.veterinarian_id === veterinarian.id)}
        />
      ))}

      {/* Centralized Absence Manager */}
      <VeterinarianAbsenceManager veterinarians={activeVeterinarians} />
    </div>
  );
};
