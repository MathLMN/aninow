
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { Building2, Users, Shield } from "lucide-react";

export const ClinicSettingsForm = () => {
  const { settings, isLoading, updateSettings } = useClinicSettings();
  const [formData, setFormData] = useState({
    clinic_name: settings.clinic_name,
    veterinarian_count: settings.veterinarian_count,
    asv_enabled: settings.asv_enabled
  });

  const handleSave = async () => {
    await updateSettings(formData);
  };

  const handleVetCountChange = (value: string) => {
    const count = Math.max(1, Math.min(10, parseInt(value) || 1));
    setFormData(prev => ({ ...prev, veterinarian_count: count }));
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-8">
          <div className="text-center text-vet-brown">Chargement des paramètres...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Informations de la clinique
          </CardTitle>
          <CardDescription>
            Paramètres généraux de votre établissement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clinic_name">Nom de la clinique</Label>
            <Input
              id="clinic_name"
              value={formData.clinic_name}
              onChange={(e) => setFormData(prev => ({ ...prev, clinic_name: e.target.value }))}
              placeholder="Nom de votre clinique"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Configuration du planning
          </CardTitle>
          <CardDescription>
            Paramètres pour l'affichage du planning journalier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="veterinarian_count">Nombre de vétérinaires</Label>
            <Input
              id="veterinarian_count"
              type="number"
              min="1"
              max="10"
              value={formData.veterinarian_count}
              onChange={(e) => handleVetCountChange(e.target.value)}
              className="w-32"
            />
            <p className="text-sm text-vet-brown mt-1">
              Entre 1 et 10 vétérinaires (affecte le nombre de colonnes dans le planning)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="asv_enabled"
              checked={formData.asv_enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, asv_enabled: checked }))}
            />
            <Label htmlFor="asv_enabled" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Afficher la colonne ASV
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-vet-sage hover:bg-vet-sage/90 text-white"
        >
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};
