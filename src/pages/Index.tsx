import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, Phone, Mail, Users, Plus, Edit, Trash2, Building2, Calendar, Settings } from "lucide-react";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { VeterinarianScheduleManager } from "./VeterinarianScheduleManager";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ClinicSettings {
  clinic_name: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_address_street: string;
  clinic_address_city: string;
  clinic_address_postal_code: string;
  clinic_address_country: string;
  asv_enabled: boolean;
  default_slot_duration_minutes: number;
}

const defaultSettings: ClinicSettings = {
  clinic_name: "Clinique Vétérinaire",
  clinic_phone: "",
  clinic_email: "",
  clinic_address_street: "",
  clinic_address_city: "",
  clinic_address_postal_code: "",
  clinic_address_country: "France",
  asv_enabled: true,
  default_slot_duration_minutes: 15
};

const formSchema = z.object({
  clinicName: z.string().min(2, {
    message: "Le nom de la clinique doit comporter au moins 2 caractères."
  }),
  clinicPhone: z.string().optional(),
  clinicEmail: z.string().email({
    message: "Veuillez entrer une adresse email valide."
  }).optional().or(z.literal("")),
  clinicAddressStreet: z.string().optional(),
  clinicAddressCity: z.string().optional(),
  clinicAddressPostalCode: z.string().optional(),
  clinicAddressCountry: z.string().optional(),
  asvEnabled: z.boolean().default(true),
  defaultSlotDurationMinutes: z.number().min(5).max(60).default(15)
});

interface Veterinarian {
  id: string;
  name: string;
  specialty: string;
  is_active: boolean;
}

interface NewVeterinarian {
  name: string;
  specialty: string;
  is_active: boolean;
}

// Définition des options de durée valides
const SLOT_DURATION_OPTIONS = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 20, label: "20 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" }
] as const;

// Composant pour la gestion de la durée des créneaux
const SlotDurationSelector = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="defaultSlotDurationMinutes"
      render={({ field }) => {
        // Transforme la valeur en string, et fallback sur "15" si pas valide
        let currentValue = field.value;
        if (
          currentValue === undefined ||
          currentValue === null ||
          currentValue === "" ||
          !SLOT_DURATION_OPTIONS.some(opt => opt.value === Number(currentValue))
        ) {
          currentValue = 15;
        }
        const stringValue = String(currentValue);

        return (
          <FormItem>
            <FormLabel>Durée par défaut d'un créneau (minutes)</FormLabel>
            <Select
              onValueChange={(value) => {
                // On ignore les valeurs vides
                if (value && value.trim() !== "") {
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue) && numValue >= 5 && numValue <= 60) {
                    field.onChange(numValue);
                  }
                }
              }}
              value={stringValue}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SLOT_DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export const ClinicSettingsForm = () => {
  const {
    settings,
    isLoading,
    updateSettings
  } = useClinicSettings();
  const {
    veterinarians,
    addVeterinarian,
    updateVeterinarian,
    deleteVeterinarian
  } = useClinicVeterinarians();
  const { toast } = useToast();
  const [isVetDialogOpen, setIsVetDialogOpen] = useState(false);
  const [newVeterinarian, setNewVeterinarian] = useState<NewVeterinarian>({
    name: '',
    specialty: '',
    is_active: true
  });
  const [editingVeterinarian, setEditingVeterinarian] = useState<Veterinarian | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicName: defaultSettings.clinic_name,
      clinicPhone: defaultSettings.clinic_phone,
      clinicEmail: defaultSettings.clinic_email,
      clinicAddressStreet: defaultSettings.clinic_address_street,
      clinicAddressCity: defaultSettings.clinic_address_city,
      clinicAddressPostalCode: defaultSettings.clinic_address_postal_code,
      clinicAddressCountry: defaultSettings.clinic_address_country,
      asvEnabled: defaultSettings.asv_enabled,
      defaultSlotDurationMinutes: defaultSettings.default_slot_duration_minutes
    }
  });

  useEffect(() => {
    if (settings && !isLoading) {
      // Ensure we have a valid slot duration value
      const slotDuration = settings.default_slot_duration_minutes &&
        typeof settings.default_slot_duration_minutes === 'number' &&
        settings.default_slot_duration_minutes >= 5 &&
        settings.default_slot_duration_minutes <= 60
        ? settings.default_slot_duration_minutes
        : 15;

      form.reset({
        clinicName: settings.clinic_name || defaultSettings.clinic_name,
        clinicPhone: settings.clinic_phone || defaultSettings.clinic_phone,
        clinicEmail: settings.clinic_email || defaultSettings.clinic_email,
        clinicAddressStreet: settings.clinic_address_street || defaultSettings.clinic_address_street,
        clinicAddressCity: settings.clinic_address_city || defaultSettings.clinic_address_city,
        clinicAddressPostalCode: settings.clinic_address_postal_code || defaultSettings.clinic_address_postal_code,
        clinicAddressCountry: settings.clinic_address_country || defaultSettings.clinic_address_country,
        asvEnabled: settings.asv_enabled ?? defaultSettings.asv_enabled,
        defaultSlotDurationMinutes: slotDuration
      });
    }
  }, [settings, isLoading, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await updateSettings({
      clinic_name: values.clinicName,
      clinic_phone: values.clinicPhone || '',
      clinic_email: values.clinicEmail || '',
      clinic_address_street: values.clinicAddressStreet || '',
      clinic_address_city: values.clinicAddressCity || '',
      clinic_address_postal_code: values.clinicAddressPostalCode || '',
      clinic_address_country: values.clinicAddressCountry || 'France',
      asv_enabled: values.asvEnabled,
      default_slot_duration_minutes: values.defaultSlotDurationMinutes
    });

    if (success) {
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de la clinique ont été mis à jour avec succès"
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres de la clinique",
        variant: "destructive"
      });
    }
  };

  const handleVeterinarianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVeterinarian.name.trim() || !newVeterinarian.specialty.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const success = await (editingVeterinarian ? updateVeterinarian(editingVeterinarian.id, {
      name: newVeterinarian.name,
      specialty: newVeterinarian.specialty,
      is_active: newVeterinarian.is_active
    }) : addVeterinarian({
      name: newVeterinarian.name,
      specialty: newVeterinarian.specialty,
      is_active: newVeterinarian.is_active
    }));

    if (success) {
      setIsVetDialogOpen(false);
      setNewVeterinarian({
        name: '',
        specialty: '',
        is_active: true
      });
      setEditingVeterinarian(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vet-blue mx-auto mb-4"></div>
          <p className="text-vet-brown">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Informations générales */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Informations générales
          </CardTitle>
          <CardDescription>
            Informations de base de votre clinique vétérinaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clinicName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la clinique *</FormLabel>
                      <FormControl>
                        <Input placeholder="Clinique Vétérinaire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clinicPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="01 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clinicEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@clinique.fr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="clinicAddressStreet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse (rue)</FormLabel>
                      <FormControl>
                        <Input placeholder="123 rue de la République" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clinicAddressCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clinicAddressPostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code Postal</FormLabel>
                      <FormControl>
                        <Input placeholder="75001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clinicAddressCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="bg-vet-blue hover:bg-vet-blue/90 text-white">
                Enregistrer les modifications
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Configuration du planning */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configuration du planning
          </CardTitle>
          <CardDescription>
            Paramètres de configuration pour votre planning de consultation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <SlotDurationSelector form={form} />

              <FormField
                control={form.control}
                name="asvEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ajouter la colonne ASV dans votre planning</FormLabel>
                      <FormDescription>
                        Activez cette option pour créer une colonne dédiée uniquement aux ASV et fermée à la prise de rendez-vous en ligne.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="bg-vet-blue hover:bg-vet-blue/90 text-white">
                Enregistrer les modifications
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Équipe vétérinaire */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Équipe vétérinaire
          </CardTitle>
          <CardDescription>
            Gérez votre équipe de vétérinaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-vet-navy">Vétérinaires</h3>
            <Dialog open={isVetDialogOpen} onOpenChange={setIsVetDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingVeterinarian(null);
                    setNewVeterinarian({
                      name: '',
                      specialty: '',
                      is_active: true
                    });
                  }}
                  className="bg-vet-blue hover:bg-vet-blue/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un vétérinaire
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-vet-navy">
                    {editingVeterinarian ? 'Modifier le vétérinaire' : 'Ajouter un vétérinaire'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingVeterinarian ? 'Modifiez les informations du vétérinaire.' : 'Ajoutez un nouveau vétérinaire à votre équipe.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVeterinarianSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="vet-name">Nom complet *</Label>
                      <Input
                        id="vet-name"
                        value={newVeterinarian.name}
                        onChange={(e) => setNewVeterinarian(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        placeholder="Dr. Martin Dupont"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vet-specialty">Spécialité *</Label>
                      <Input
                        id="vet-specialty"
                        value={newVeterinarian.specialty}
                        onChange={(e) => setNewVeterinarian(prev => ({
                          ...prev,
                          specialty: e.target.value
                        }))}
                        placeholder="Médecine générale, Chirurgie, etc."
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="vet-active"
                        checked={newVeterinarian.is_active}
                        onCheckedChange={(checked) => setNewVeterinarian(prev => ({
                          ...prev,
                          is_active: checked
                        }))}
                      />
                      <Label htmlFor="vet-active">Vétérinaire actif</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsVetDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-vet-blue hover:bg-vet-blue/90 text-white">
                      {editingVeterinarian ? 'Enregistrer les modifications' : 'Ajouter'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {veterinarians.map(vet => (
              <div key={vet.id} className="flex items-center justify-between p-4 bg-vet-beige/20 rounded-lg border border-vet-blue/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-vet-navy">{vet.name}</h4>
                    <Badge variant={vet.is_active ? "default" : "secondary"} className={vet.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                      {vet.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-vet-brown">{vet.specialty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingVeterinarian(vet);
                      setNewVeterinarian({
                        name: vet.name,
                        specialty: vet.specialty || '',
                        is_active: vet.is_active
                      });
                      setIsVetDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer {vet.name} ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteVeterinarian(vet.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
            
            {veterinarians.length === 0 && (
              <div className="text-center py-8 text-vet-brown bg-vet-beige/10 rounded-lg border border-vet-blue/20">
                <Users className="h-8 w-8 mx-auto mb-2 text-vet-blue/60" />
                <p>Aucun vétérinaire ajouté</p>
                <p className="text-sm">Commencez par ajouter votre premier vétérinaire</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Manager */}
      <VeterinarianScheduleManager />
    </div>
  );
};