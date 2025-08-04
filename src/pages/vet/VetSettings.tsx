
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PasswordChangeForm from "@/components/vet/PasswordChangeForm";
import { ClinicSettingsForm } from "@/components/settings/ClinicSettingsForm";
import { DefaultScheduleForm } from "@/components/settings/DefaultScheduleForm";
import { VeterinarianScheduleManager } from "@/components/settings/VeterinarianScheduleManager";
import { VeterinarianAbsenceManager } from "@/components/settings/VeterinarianAbsenceManager";
import { useState } from "react";

const VetSettings = () => {
  const [defaultSchedule, setDefaultSchedule] = useState({
    morning_start: "08:00",
    morning_end: "12:00",
    afternoon_start: "14:00",
    afternoon_end: "18:00"
  });

  const handleScheduleChange = (field: string, value: string) => {
    setDefaultSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-vet-navy">Paramètres</h1>
        <p className="text-vet-brown mt-2">
          Gérez les paramètres de votre clinique et votre compte
        </p>
      </div>

      {/* Sécurité du compte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Sécurité du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      <Separator />

      {/* Paramètres de la clinique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Informations de la clinique</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicSettingsForm />
        </CardContent>
      </Card>

      <Separator />

      {/* Horaires par défaut */}
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Horaires par défaut</CardTitle>
        </CardHeader>
        <CardContent>
          <DefaultScheduleForm 
            defaultSchedule={defaultSchedule}
            onScheduleChange={handleScheduleChange}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Planning des vétérinaires */}
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Planning des vétérinaires</CardTitle>
        </CardHeader>
        <CardContent>
          <VeterinarianScheduleManager />
        </CardContent>
      </Card>

      <Separator />

      {/* Gestion des absences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Gestion des absences</CardTitle>
        </CardHeader>
        <CardContent>
          <VeterinarianAbsenceManager veterinarians={[]} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VetSettings;
