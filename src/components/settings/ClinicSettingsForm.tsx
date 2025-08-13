import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { VeterinarianScheduleManager } from "./VeterinarianScheduleManager";
import { DefaultScheduleForm } from "./DefaultScheduleForm";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  X
} from "lucide-react";
import { Veterinarian } from "@/types/veterinarian.types";
import { useClinicContext } from "@/contexts/ClinicContext";
import { Checkbox } from "@/components/ui/checkbox";

interface ClinicSettingsFormProps {
  clinicId?: string;
}

export const ClinicSettingsForm = () => {
  const { toast } = useToast();
  const { currentClinic } = useClinicContext();
  const { 
    settings, 
    isLoading, 
    error, 
    updateSettings 
  } = useClinicSettings();
  const { 
    veterinarians, 
    isLoading: isLoadingVets,
    addVeterinarian,
    updateVeterinarian,
    deleteVeterinarian
  } = useClinicVeterinarians();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [isAddingVeterinarian, setIsAddingVeterinarian] = useState(false);
  const [newVeterinarianData, setNewVeterinarianData] = useState({
    name: '',
    specialty: '',
    is_active: true
  });
  const [editingVeterinarian, setEditingVeterinarian] = useState<Veterinarian | null>(null);

  useEffect(() => {
    if (settings) {
      setName(settings.name || '');
      setAddress(settings.address || '');
      setCity(settings.city || '');
      setProvince(settings.province || '');
      setPostalCode(settings.postal_code || '');
      setPhone(settings.phone || '');
      setEmail(settings.email || '');
      setWebsite(settings.website || '');
      setAboutUs(settings.about_us || '');
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSettings = {
      name,
      address,
      city,
      province,
      postal_code: postalCode,
      phone,
      email,
      website,
      about_us: aboutUs,
    };

    try {
      await updateSettings(updatedSettings);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de la clinique ont été mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres de la clinique",
        variant: "destructive",
      });
    }
  };

  const handleAddVeterinarian = async () => {
    try {
      if (editingVeterinarian) {
        // Update existing veterinarian
        await updateVeterinarian(editingVeterinarian.id, newVeterinarianData);
        toast({
          title: "Vétérinaire mis à jour",
          description: "Les informations du vétérinaire ont été mises à jour avec succès",
        });
      } else {
        // Add new veterinarian
        await addVeterinarian(newVeterinarianData);
        toast({
          title: "Vétérinaire ajouté",
          description: "Le vétérinaire a été ajouté avec succès",
        });
      }
      
      setNewVeterinarianData({ name: '', specialty: '', is_active: true });
      setIsAddingVeterinarian(false);
      setEditingVeterinarian(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter/modifier le vétérinaire",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVeterinarian = async (id: string) => {
    try {
      await deleteVeterinarian(id);
      toast({
        title: "Vétérinaire supprimé",
        description: "Le vétérinaire a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le vétérinaire",
        variant: "destructive",
      });
    }
  };
  
  const handleEditVeterinarian = (vet: Veterinarian) => {
    setEditingVeterinarian(vet);
    setNewVeterinarianData({
      name: vet.name,
      specialty: vet.specialty || '',
      is_active: vet.is_active
    });
    setIsAddingVeterinarian(true);
  };

  if (isLoading || isLoadingVets) {
    return <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardContent className="p-8">
        <div className="text-center text-vet-brown">Chargement des paramètres de la clinique...</div>
      </CardContent>
    </Card>;
  }

  if (error) {
    return <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardContent className="p-8">
        <div className="text-center text-vet-brown">Erreur lors du chargement des paramètres de la clinique.</div>
      </CardContent>
    </Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-vet-navy flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Informations de la clinique
          </CardTitle>
          <CardDescription className="text-vet-brown">
            Mettez à jour les informations de votre clinique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom de la clinique</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Input
                  type="text"
                  id="province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="website">Site web</Label>
                <Input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="aboutUs">À propos de nous</Label>
              <Textarea
                id="aboutUs"
                value={aboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <Button type="submit" className="bg-vet-sage hover:bg-vet-sage/90 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mettre à jour les informations
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-vet-navy flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Équipe vétérinaire
          </CardTitle>
          <CardDescription className="text-vet-brown">
            Gérez les vétérinaires de votre clinique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => {
              setIsAddingVeterinarian(true);
              setEditingVeterinarian(null);
              setNewVeterinarianData({ name: '', specialty: '', is_active: true });
            }} className="bg-vet-sage hover:bg-vet-sage/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un vétérinaire
            </Button>
          </div>

          {isAddingVeterinarian && (
            <div className="mb-4 p-4 border border-vet-blue/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vetName">Nom du vétérinaire</Label>
                  <Input
                    type="text"
                    id="vetName"
                    value={newVeterinarianData.name}
                    onChange={(e) => setNewVeterinarianData({ ...newVeterinarianData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vetSpecialty">Spécialité</Label>
                  <Input
                    type="text"
                    id="vetSpecialty"
                    value={newVeterinarianData.specialty}
                    onChange={(e) => setNewVeterinarianData({ ...newVeterinarianData, specialty: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Label htmlFor="vetIsActive">Actif</Label>
                <Checkbox
                  id="vetIsActive"
                  checked={newVeterinarianData.is_active}
                  onCheckedChange={(checked) => setNewVeterinarianData({ ...newVeterinarianData, is_active: !!checked })}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsAddingVeterinarian(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddVeterinarian} className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                  {editingVeterinarian ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            {veterinarians && veterinarians.length > 0 ? (
              veterinarians.map((vet) => (
                <div key={vet.id} className="flex items-center justify-between p-4 border border-vet-blue/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-vet-navy">{vet.name}</h3>
                    <p className="text-sm text-vet-brown">{vet.specialty || 'Non spécifié'}</p>
                    <Badge variant={vet.is_active ? "default" : "secondary"}>
                      {vet.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEditVeterinarian(vet)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteVeterinarian(vet.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-vet-brown">
                Aucun vétérinaire ajouté.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <VeterinarianScheduleManager />

      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-vet-navy flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Horaires par défaut
          </CardTitle>
          <CardDescription className="text-vet-brown">
            Définissez les horaires par défaut de votre clinique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DefaultScheduleForm />
        </CardContent>
      </Card>
    </div>
  );
};
