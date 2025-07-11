
import VetLayout from "@/components/layout/VetLayout";
import { ClinicSettingsForm } from "@/components/settings/ClinicSettingsForm";
import { VeterinarianManagement } from "@/components/settings/VeterinarianManagement";

const VetSettings = () => {
  return (
    <VetLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Paramètres</h1>
          <p className="text-vet-brown">Configuration de votre clinique vétérinaire</p>
        </div>

        <ClinicSettingsForm />
        <VeterinarianManagement />
      </div>
    </VetLayout>
  );
};

export default VetSettings;
