
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { Building2, Clock, Shield, UserPlus, Edit, Trash2, Stethoscope } from "lucide-react";

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
  const { veterinarians, isLoading: isLoadingVets, addVeterinarian, updateVeterinarian, deleteVeterinarian } = useClinicVeterinarians();
  
  const [formData, setFormData] = useState({
    clinic_name: settings.clinic_name,
    asv_enabled: settings.asv_enabled,
    opening_time: settings.opening_time,
    closing_time: settings.closing_time,
    opening_days: settings.opening_days
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
      opening_time: settings.opening_time,
      closing_time: settings.closing_time,
      opening_days: settings.opening_days
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
