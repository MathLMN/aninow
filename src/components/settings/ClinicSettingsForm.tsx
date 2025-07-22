import React, { useState, useEffect } from "react";
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
import { Building2, Clock, Shield, UserPlus, Edit, Trash2, Stethoscope, Timer, Phone, Mail, MapPin } from "lucide-react";

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
    clinic_name: '',
    clinic_phone: '',
    clinic_email: '',
    clinic_address_street: '',
    clinic_address_city: '',
    clinic_address_postal_code: '',
    clinic_address_country: 'France',
    asv_enabled: true,
    daily_schedules: {
      monday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      tuesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      wednesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      thursday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      friday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
      saturday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } },
      sunday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } }
    },
    default_slot_duration_minutes: 30
  });

  const [isSavingClinicInfo, setIsSavingClinicInfo] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVet, setEditingVet] = useState<any>(null);
  const [vetFormData, setVetFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    is_active: true
  });

  // Synchroniser formData avec settings à chaque changement
  useEffect(() => {
    console.log('🔄 Settings changed, updating form data:', settings);
    setFormData({
      clinic_name: settings.clinic_name || 'Clinique Vétérinaire',
      clinic_phone: settings.clinic_phone || '',
      clinic_email: settings.clinic_email || '',
      clinic_address_street: settings.clinic_address_street || '',
      clinic_address_city: settings.clinic_address_city || '',
      clinic_address_postal_code: settings.clinic_address_postal_code || '',
      clinic_address_country: settings.clinic_address_country || 'France',
      asv_enabled: settings.asv_enabled ?? true,
      daily_schedules: settings.daily_schedules || {
        monday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
        tuesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
        wednesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
        thursday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
        friday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
        saturday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } },
        sunday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } }
      },
      default_slot_duration_minutes: settings.default_slot_duration_minutes || 30
    });
  }, [settings]);

  const handleSaveClinicInfo = async () => {
    console.log('🚀 Save clinic info button clicked');
    setIsSavingClinicInfo(true);
    
    const clinicInfo = {
      clinic_name: formData.clinic_name,
      clinic_phone: formData.clinic_phone,
      clinic_email: formData.clinic_email,
      clinic_address_street: formData.clinic_address_street,
      clinic_address_city: formData.clinic_address_city,
      clinic_address_postal_code: formData.clinic_address_postal_code,
      clinic_address_country: formData.clinic_address_country
    };

    console.log('📤 Saving clinic info:', clinicInfo);
    
    try {
      const success = await updateSettings(clinicInfo);
      
      if (success) {
        console.log('✅ Clinic info saved successfully');
      } else {
        console.error('❌ Failed to save clinic info');
      }
    } catch (error) {
      console.error('❌ Error saving clinic info:', error);
    } finally {
      setIsSavingClinicInfo(false);
    }
  };

  const handleSaveSlotConfig = async () => {
    console.log('⏱️ Saving slot configuration:', { default_slot_duration_minutes: formData.default_slot_duration_minutes });
    const success = await updateSettings({ default_slot_duration_minutes: formData.default_slot_duration_minutes });
    if (success) {
      console.log('✅ Slot configuration saved successfully');
    } else {
      console.error('❌ Failed to save slot configuration');
    }
  };

  const handleSaveSchedules = async () => {
    console.log('📅 Saving schedules:', { daily_schedules: formData.daily_schedules });
    const success = await updateSettings({ daily_schedules: formData.daily_schedules });
    if (success) {
      console.log('✅ Schedules saved successfully');
    } else {
      console.error('❌ Failed to save schedules');
    }
  };

  const handleSavePlanningConfig = async () => {
    console.log('🔧 Saving planning configuration:', { asv_enabled: formData.asv_enabled });
    const success = await updateSettings({ asv_enabled: formData.asv_enabled });
    if (success) {
      console.log('✅ Planning configuration saved successfully');
    } else {
      console.error('❌ Failed to save planning configuration');
    }
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
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinic_name">Nom de la clinique</Label>
              <Input
                id="clinic_name"
                value={formData.clinic_name}
                onChange={(e) => setFormData(prev => ({ ...prev, clinic_name: e.target.value }))}
                placeholder="Nom de votre clinique"
              />
            </div>
            <div>
              <Label htmlFor="clinic_phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Téléphone
              </Label>
              <Input
                id="clinic_phone"
                value={formData.clinic_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, clinic_phone: e.target.value }))}
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clinic_email" className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Label>
            <Input
              id="clinic_email"
              type="email"
              value={formData.clinic_email}
              onChange={(e) => setFormData(prev => ({ ...prev, clinic_email: e.target.value }))}
              placeholder="contact@clinique.com"
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-center text-base font-medium">
              <MapPin className="h-4 w-4 mr-1" />
              Adresse
            </Label>
            <div className="grid grid-cols-1 gap-4 ml-5">
              <div>
                <Label htmlFor="clinic_address_street">Rue</Label>
                <Input
                  id="clinic_address_street"
                  value={formData.clinic_address_street}
                  onChange={(e) => setFormData(prev => ({ ...prev, clinic_address_street: e.target.value }))}
                  placeholder="123 Rue de la Paix"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="clinic_address_city">Ville</Label>
                  <Input
                    id="clinic_address_city"
                    value={formData.clinic_address_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, clinic_address_city: e.target.value }))}
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <Label htmlFor="clinic_address_postal_code">Code postal</Label>
                  <Input
                    id="clinic_address_postal_code"
                    value={formData.clinic_address_postal_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, clinic_address_postal_code: e.target.value }))}
                    placeholder="75001"
                  />
                </div>
                <div>
                  <Label htmlFor="clinic_address_country">Pays</Label>
                  <Input
                    id="clinic_address_country"
                    value={formData.clinic_address_country}
                    onChange={(e) => setFormData(prev => ({ ...prev, clinic_address_country: e.target.value }))}
                    placeholder="France"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveClinicInfo}
              disabled={isSavingClinicInfo}
              size="sm"
              variant="outline"
              className="text-vet-sage border-vet-sage hover:bg-vet-sage hover:text-white"
            >
              {isSavingClinicInfo ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
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
          <div className="flex items-end gap-4">
            <div className="flex-1">
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
            <Button
              onClick={handleSaveSlotConfig}
              size="sm"
              variant="outline"
              className="text-vet-sage border-vet-sage hover:bg-vet-sage hover:text-white"
            >
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-vet-navy flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Horaires d'ouverture
            </CardTitle>
            <CardDescription>
              Configurez les horaires d'ouverture pour chaque jour de la semaine
            </CardDescription>
          </div>
          <Button
            onClick={handleSaveSchedules}
            size="sm"
            variant="outline"
            className="text-vet-sage border-vet-sage hover:bg-vet-sage hover:text-white"
          >
            Sauvegarder
          </Button>
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
          <div className="flex items-center justify-between">
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
            <Button
              onClick={handleSavePlanningConfig}
              size="sm"
              variant="outline"
              className="text-vet-sage border-vet-sage hover:bg-vet-sage hover:text-white"
            >
              Sauvegarder
            </Button>
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
    </div>
  );
};
