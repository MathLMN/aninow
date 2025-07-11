
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { Building2, Clock, Shield } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' }
];

export const ClinicSettingsForm = () => {
  const { settings, isLoading, updateSettings } = useClinicSettings();
  const [formData, setFormData] = useState({
    clinic_name: settings.clinic_name,
    asv_enabled: settings.asv_enabled,
    opening_time: settings.opening_time,
    closing_time: settings.closing_time,
    opening_days: settings.opening_days
  });

  const handleSave = async () => {
    await updateSettings(formData);
  };

  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        opening_days: [...prev.opening_days, day]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        opening_days: prev.opening_days.filter(d => d !== day)
      }));
    }
  };

  // Update formData when settings change
  React.useEffect(() => {
    setFormData({
      clinic_name: settings.clinic_name,
      asv_enabled: settings.asv_enabled,
      opening_time: settings.opening_time,
      closing_time: settings.closing_time,
      opening_days: settings.opening_days
    });
  }, [settings]);

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
            <Clock className="h-5 w-5 mr-2" />
            Horaires d'ouverture
          </CardTitle>
          <CardDescription>
            Configurez les heures et jours d'ouverture de votre clinique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opening_time">Heure d'ouverture</Label>
              <Input
                id="opening_time"
                type="time"
                value={formData.opening_time}
                onChange={(e) => setFormData(prev => ({ ...prev, opening_time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="closing_time">Heure de fermeture</Label>
              <Input
                id="closing_time"
                type="time"
                value={formData.closing_time}
                onChange={(e) => setFormData(prev => ({ ...prev, closing_time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Jours d'ouverture</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.value}
                    checked={formData.opening_days.includes(day.value)}
                    onCheckedChange={(checked) => handleDayChange(day.value, checked as boolean)}
                  />
                  <Label htmlFor={day.value} className="text-sm font-normal">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Configuration du planning
          </CardTitle>
          <CardDescription>
            Paramètres pour l'affichage du planning journalier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
