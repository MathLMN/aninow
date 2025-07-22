import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { Building2, Clock, Shield, UserPlus, Edit, Trash2, Stethoscope, Timer } from "lucide-react";

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' }
];

export const ClinicSettingsForm = () => {
  const { settings, isLoading, updateSettings } = useClinicSettings();
  const { veterinarians, isLoading: isLoadingVets, addVeterinarian, updateVeterinarian, deleteVeterinarian } = useClinicVeterinarians();
  
  const [formData, setFormData] = useState({
    clinic_name: settings.clinic_name,
    asv_enabled: settings.asv_enabled,
    daily_schedules: settings.daily_schedules,
    default_slot_duration_minutes: settings.default_slot_duration_minutes || 30
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVet, setEditingVet] = useState<any>(null);
  const [vetFormData, setVetFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    is_active: true
  });

  const handleSave = async () => {
    await updateSettings(formData);
  };

  const handleDayToggle = (day: string, isOpen: boolean) => {
    setFormData(prev => ({
      ...prev,
      daily_schedules: {
        ...prev.daily_schedules,
        [day]: {
          ...prev.daily_schedules[day as keyof typeof prev.daily_schedules],
          isOpen
        }
      }
    }));
  };

  const handleTimeChange = (day: string, period: 'morning' | 'afternoon', type: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      daily_schedules: {
        ...prev.daily_schedules,
        [day]: {
          ...prev.daily_schedules[day as keyof typeof prev.daily_schedules],
          [period]: {
            ...prev.daily_schedules[day as keyof typeof prev.daily_schedules][period],
            [type]: value
          }
        }
      }
    }));
  };

  const handleVetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVet) {
      const success = await updateVeterinarian(editingVet.id, vetFormData);
      if (success) {
        setEditingVet(null);
        setVetFormData({ name: '', email: '', specialty: '', is_active: true });
      }
    } else {
      const success = await addVeterinarian(vetFormData);
      if (success) {
        setIsAddModalOpen(false);
        setVetFormData({ name: '', email: '', specialty: '', is_active: true });
      }
    }
  };

  const handleEditVet = (vet: any) => {
    setEditingVet(vet);
    setVetFormData({
      name: vet.name,
      email: vet.email || '',
      specialty: vet.specialty || '',
      is_active: vet.is_active
    });
  };

  const handleDeleteVet = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vétérinaire ?')) {
      await deleteVeterinarian(id);
    }
  };

  const resetVetForm = () => {
    setVetFormData({ name: '', email: '', specialty: '', is_active: true });
    setEditingVet(null);
  };

  // Update formData when settings change
  React.useEffect(() => {
    setFormData({
      clinic_name: settings.clinic_name,
      asv_enabled: settings.asv_enabled,
      daily_schedules: settings.daily_schedules,
      default_slot_duration_minutes: settings.default_slot_duration_minutes || 30
    });
  }, [settings]);

  if (isLoading || isLoadingVets) {
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
            <Timer className="h-5 w-5 mr-2" />
            Configuration des créneaux
          </CardTitle>
          <CardDescription>
            Paramètres pour la durée des créneaux de rendez-vous
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="default_slot_duration">Durée par défaut des créneaux (minutes)</Label>
            <Select
              value={formData.default_slot_duration_minutes.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, default_slot_duration_minutes: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Horaires d'ouverture par jour
          </CardTitle>
          <CardDescription>
            Configurez les horaires d'ouverture pour chaque jour de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = formData.daily_schedules[day.key as keyof typeof formData.daily_schedules];
              return (
                <div key={day.key} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={daySchedule.isOpen}
                      onCheckedChange={(checked) => handleDayToggle(day.key, checked)}
                    />
                    <Label className="font-semibold">{day.label}</Label>
                  </div>
                  
                  {daySchedule.isOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Matin</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="time"
                            value={daySchedule.morning.start}
                            onChange={(e) => handleTimeChange(day.key, 'morning', 'start', e.target.value)}
                            className="flex-1"
                          />
                          <span className="flex items-center px-2">à</span>
                          <Input
                            type="time"
                            value={daySchedule.morning.end}
                            onChange={(e) => handleTimeChange(day.key, 'morning', 'end', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Après-midi</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="time"
                            value={daySchedule.afternoon.start}
                            onChange={(e) => handleTimeChange(day.key, 'afternoon', 'start', e.target.value)}
                            className="flex-1"
                          />
                          <span className="flex items-center px-2">à</span>
                          <Input
                            type="time"
                            value={daySchedule.afternoon.end}
                            onChange={(e) => handleTimeChange(day.key, 'afternoon', 'end', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
            Paramètres pour l'affichage du planning journalier et gestion de l'équipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-vet-navy flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Équipe vétérinaire
                </h4>
                <p className="text-sm text-vet-brown">
                  {veterinarians.filter(v => v.is_active).length} vétérinaire(s) actif(s)
                </p>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter un vétérinaire
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un vétérinaire</DialogTitle>
                    <DialogDescription>
                      Ajoutez un nouveau vétérinaire à votre équipe.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleVetSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={vetFormData.name}
                        onChange={(e) => setVetFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={vetFormData.email}
                        onChange={(e) => setVetFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Spécialité</Label>
                      <Input
                        id="specialty"
                        value={vetFormData.specialty}
                        onChange={(e) => setVetFormData(prev => ({ ...prev, specialty: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={vetFormData.is_active}
                        onCheckedChange={(checked) => setVetFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="is_active">Actif</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                        Ajouter
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddModalOpen(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {veterinarians.map((vet) => (
                    <TableRow key={vet.id}>
                      <TableCell>
                        {editingVet?.id === vet.id ? (
                          <Input
                            value={vetFormData.name}
                            onChange={(e) => setVetFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full"
                          />
                        ) : (
                          vet.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingVet?.id === vet.id ? (
                          <Input
                            value={vetFormData.email}
                            onChange={(e) => setVetFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full"
                          />
                        ) : (
                          vet.email || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingVet?.id === vet.id ? (
                          <Input
                            value={vetFormData.specialty}
                            onChange={(e) => setVetFormData(prev => ({ ...prev, specialty: e.target.value }))}
                            className="w-full"
                          />
                        ) : (
                          vet.specialty || '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingVet?.id === vet.id ? (
                          <Switch
                            checked={vetFormData.is_active}
                            onCheckedChange={(checked) => setVetFormData(prev => ({ ...prev, is_active: checked }))}
                          />
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            vet.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {vet.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingVet?.id === vet.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={handleVetSubmit}
                                className="bg-vet-sage hover:bg-vet-sage/90 text-white"
                              >
                                Sauvegarder
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={resetVetForm}
                              >
                                Annuler
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditVet(vet)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteVet(vet.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
