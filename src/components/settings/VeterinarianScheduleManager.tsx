import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { VeterinarianScheduleCard } from "./VeterinarianScheduleCard";
import { VeterinarianAbsencesCard } from "./VeterinarianAbsencesCard";

export const VeterinarianScheduleManager = () => {
  const { veterinarians, isLoading: isLoadingVets } = useClinicVeterinarians();
  const { schedules, isLoading: isLoadingSchedules } = useVeterinarianSchedules();
  const { absences, isLoading: isLoadingAbsences } = useVeterinarianAbsences();

  if (isLoadingVets || isLoadingSchedules || isLoadingAbsences) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-8">
          <div className="text-center text-vet-brown">Chargement des horaires et absences...</div>
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
            Configurez les horaires de travail et les périodes d'absence pour chaque vétérinaire
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
            Configurez les horaires de travail et les périodes d'absence pour chaque vétérinaire
          </CardDescription>
        </CardHeader>
      </Card>

      {activeVeterinarians.map((veterinarian) => {
        const vetSchedules = schedules.filter(s => s.veterinarian_id === veterinarian.id);
        const vetAbsences = absences.filter(a => a.veterinarian_id === veterinarian.id);

        return (
          <div key={veterinarian.id} className="space-y-4">
            <VeterinarianScheduleCard
              veterinarian={veterinarian}
              schedules={vetSchedules}
            />
            <VeterinarianAbsencesCard
              veterinarian={veterinarian}
              absences={vetAbsences}
            />
          </div>
        );
      })}
    </div>
  );
};
