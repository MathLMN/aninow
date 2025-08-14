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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Clock, MapPin, Phone, Mail, Users, Plus, Edit, Trash2, Building2, Calendar, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { VeterinarianAbsenceManager } from "./VeterinarianAbsenceManager";
import { VeterinarianWeeklySchedule } from "./VeterinarianWeeklySchedule";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

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
  }).optional(),
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

const SPECIALTY_OPTIONS = [
  "Médecine générale",
  "Ophtalmologie", 
  "Dermatologie",
  "Chirurgie",
  "Imagerie médicale"
];

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
  const { schedules } = useVeterinarianSchedules();
  const {
    toast
  } = useToast();
  const [isVetDialogOpen, setIsVetDialogOpen] = useState(false);
  const [newVeterinarian, setNewVeterinarian] = useState<NewVeterinarian>({
    name: 'Dr. ',
    specialty: '',
    is_active: true
  });
  const [editingVeterinarian, setEditingVeterinarian] = useState<Veterinarian | null>(null);
  const [openVeterinarianSchedules, setOpenVeterinarianSchedules] = useState<Set<string>>(new Set());
  const [isClinicScheduleOpen, setIsClinicScheduleOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicName: settings?.clinic_name || defaultSettings.clinic_name,
      clinicPhone: settings?.clinic_phone || defaultSettings.clinic_phone,
      clinicEmail: settings?.clinic_email || defaultSettings.clinic_email,
      clinicAddressStreet: settings?.clinic_address_street || defaultSettings.clinic_address_street,
      clinicAddressCity: settings?.clinic_address_city || defaultSettings.clinic_address_city,
      clinicAddressPostalCode: settings?.clinic_address_postal_code || defaultSettings.clinic_address_postal_code,
      clinicAddressCountry: settings?.clinic_address_country || defaultSettings.clinic_address_country,
      asvEnabled: settings?.asv_enabled || defaultSettings.asv_enabled,
      defaultSlotDurationMinutes: settings?.default_slot_duration_minutes || defaultSettings.default_slot_duration_minutes
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        clinicName: settings.clinic_name,
        clinicPhone: settings.clinic_phone,
        clinicEmail: settings.clinic_email,
        clinicAddressStreet: settings.clinic_address_street,
        clinicAddressCity: settings.clinic_address_city,
        clinicAddressPostalCode: settings.clinic_address_postal_code,
        clinicAddressCountry: settings.clinic_address_country,
        asvEnabled: settings.asv_enabled,
        defaultSlotDurationMinutes: settings.default_slot_duration_minutes
      });
    }
  }, [settings, form]);

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

  const handleScheduleUpdate = async (updatedSchedules: any) => {
    const success = await updateSettings({
      daily_schedules: updatedSchedules
    });

    if (success) {
      toast({
        title: "Horaires mis à jour",
        description: "Les horaires d'ouverture ont été mis à jour avec succès"
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les horaires",
        variant: "destructive"
      });
    }
  };

  const handleVeterinarianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVeterinarian.name.trim() || newVeterinarian.name.trim() === 'Dr.' || !newVeterinarian.specialty.trim()) {
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
        name: 'Dr. ',
        specialty: '',
        is_active: true
      });
      setEditingVeterinarian(null);
    }
  };

  const toggleVeterinarianSchedule = (vetId: string) => {
    const newOpenVets = new Set(openVeterinarianSchedules);
    if (newOpenVets.has(vetId)) {
      newOpenVets.delete(vetId);
    } else {
      newOpenVets.add(vetId);
    }
    setOpenVeterinarianSchedules(newOpenVets);
  };

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
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="defaultSlotDurationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée par défaut d'un créneau (minutes)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la durée" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[5, 10, 15, 20, 30, 45, 60].map(duration => (
                          <SelectItem key={duration} value={duration.toString()}>
                            {duration} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

          <Separator />

          {/* Horaires d'ouverture - Section améliorée */}
          <div className="border border-vet-blue/30 rounded-lg bg-gradient-to-r from-vet-beige/5 to-vet-sage/5">
            <Collapsible open={isClinicScheduleOpen} onOpenChange={setIsClinicScheduleOpen}>
              <CollapsibleTrigger asChild>
                <div className="w-full p-4 hover:bg-vet-beige/10 transition-colors duration-200 cursor-pointer border-b border-vet-blue/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-vet-sage/20 rounded-full">
                        <Clock className="h-5 w-5 text-vet-sage" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-vet-navy">
                          Horaires d'ouverture de votre clinique
                        </h3>
                        <p className="text-sm text-vet-brown/80">
                          {isClinicScheduleOpen 
                            ? "Configurez les créneaux disponibles pour la prise de rendez-vous" 
                            : "Cliquez pour configurer vos horaires d'ouverture"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="bg-vet-sage/10 text-vet-sage border-vet-sage/30"
                      >
                        {isClinicScheduleOpen ? "Fermer" : "Configurer"}
                      </Badge>
                      <div className="p-1 rounded-full bg-vet-blue/10 transition-transform duration-200">
                        {isClinicScheduleOpen ? (
                          <ChevronDown className="h-5 w-5 text-vet-blue" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-vet-blue" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 space-y-4">
                  <div className="bg-vet-beige/20 p-3 rounded-md border-l-4 border-vet-sage">
                    <p className="text-sm text-vet-brown">
                      <strong>Important :</strong> Configurez les horaires d'ouverture de votre clinique. 
                      Les clients pourront prendre rendez-vous uniquement pendant ces créneaux.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {DAYS_OF_WEEK.map(day => {
                      const daySchedule = settings?.daily_schedules?.[day.key] || {
                        isOpen: day.key !== 'saturday' && day.key !== 'sunday',
                        morning: { start: '08:00', end: '12:00' },
                        afternoon: { start: '14:00', end: '18:00' }
                      };

                      return (
                        <div key={day.key} className="flex items-center gap-4 p-3 border border-vet-blue/20 rounded-lg bg-white/50">
                          <div className="w-20 text-sm font-medium text-vet-navy">
                            {day.label}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={daySchedule.isOpen}
                              onCheckedChange={(checked) => {
                                const updatedSchedules = {
                                  ...settings?.daily_schedules,
                                  [day.key]: {
                                    ...daySchedule,
                                    isOpen: checked
                                  }
                                };
                                handleScheduleUpdate(updatedSchedules);
                              }}
                            />
                            <span className="text-xs text-vet-brown w-16">
                              {daySchedule.isOpen ? 'Ouvert' : 'Fermé'}
                            </span>
                          </div>

                          {daySchedule.isOpen && (
                            <div className="flex items-center gap-2 flex-1">
                              <div className="flex items-center gap-1">
                                <Input
                                  type="time"
                                  value={daySchedule.morning.start}
                                  onChange={(e) => {
                                    const updatedSchedules = {
                                      ...settings?.daily_schedules,
                                      [day.key]: {
                                        ...daySchedule,
                                        morning: { ...daySchedule.morning, start: e.target.value }
                                      }
                                    };
                                    handleScheduleUpdate(updatedSchedules);
                                  }}
                                  className="w-20 text-xs"
                                />
                                <span className="text-xs text-vet-brown">-</span>
                                <Input
                                  type="time"
                                  value={daySchedule.morning.end}
                                  onChange={(e) => {
                                    const updatedSchedules = {
                                      ...settings?.daily_schedules,
                                      [day.key]: {
                                        ...daySchedule,
                                        morning: { ...daySchedule.morning, end: e.target.value }
                                      }
                                    };
                                    handleScheduleUpdate(updatedSchedules);
                                  }}
                                  className="w-20 text-xs"
                                />
                              </div>
                              
                              <span className="text-xs text-vet-brown px-2">/</span>
                              
                              <div className="flex items-center gap-1">
                                <Input
                                  type="time"
                                  value={daySchedule.afternoon.start}
                                  onChange={(e) => {
                                    const updatedSchedules = {
                                      ...settings?.daily_schedules,
                                      [day.key]: {
                                        ...daySchedule,
                                        afternoon: { ...daySchedule.afternoon, start: e.target.value }
                                      }
                                    };
                                    handleScheduleUpdate(updatedSchedules);
                                  }}
                                  className="w-20 text-xs"
                                />
                                <span className="text-xs text-vet-brown">-</span>
                                <Input
                                  type="time"
                                  value={daySchedule.afternoon.end}
                                  onChange={(e) => {
                                    const updatedSchedules = {
                                      ...settings?.daily_schedules,
                                      [day.key]: {
                                        ...daySchedule,
                                        afternoon: { ...daySchedule.afternoon, end: e.target.value }
                                      }
                                    };
                                    handleScheduleUpdate(updatedSchedules);
                                  }}
                                  className="w-20 text-xs"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
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
            Gérez votre équipe de vétérinaires et leurs horaires de travail
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
                      name: 'Dr. ',
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
                      <Select
                        value={newVeterinarian.specialty}
                        onValueChange={(value) => setNewVeterinarian(prev => ({
                          ...prev,
                          specialty: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                          {SPECIALTY_OPTIONS.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
            {veterinarians.map(vet => {
              const vetSchedules = schedules.filter(s => s.veterinarian_id === vet.id);
              const isScheduleOpen = openVeterinarianSchedules.has(vet.id);
              
              return (
                <div key={vet.id} className="border border-vet-blue/20 rounded-lg bg-vet-beige/10">
                  <div className="flex items-center justify-between p-4">
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
                      <Collapsible open={isScheduleOpen} onOpenChange={() => toggleVeterinarianSchedule(vet.id)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-4 w-4" />
                            {isScheduleOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="text-xs">Horaires</span>
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
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
                  
                  <Collapsible open={isScheduleOpen} onOpenChange={() => toggleVeterinarianSchedule(vet.id)}>
                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <Separator className="mb-4" />
                        <VeterinarianWeeklySchedule
                          veterinarian={vet}
                          schedules={vetSchedules}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
            
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

      {/* Gestion des absences */}
      <VeterinarianAbsenceManager veterinarians={veterinarians.filter(vet => vet.is_active)} />
    </div>
  );
};
