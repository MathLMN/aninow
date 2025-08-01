import VetLayout from "@/components/layout/VetLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PasswordChangeForm from "@/components/vet/PasswordChangeForm";
import ClinicSettingsForm from "@/components/settings/ClinicSettingsForm";
import DefaultScheduleForm from "@/components/settings/DefaultScheduleForm";
import VeterinarianScheduleManager from "@/components/settings/VeterinarianScheduleManager";
import VeterinarianAbsenceManager from "@/components/settings/VeterinarianAbsenceManager";

const VetSettings = () => {
  return (
    <VetLayout>
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
            <DefaultScheduleForm />
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
            <VeterinarianAbsenceManager />
          </CardContent>
        </Card>
      </div>
    </VetLayout>
  );
};

export default VetSettings;
