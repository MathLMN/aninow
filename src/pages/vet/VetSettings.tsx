
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Clock, Bell, Shield } from "lucide-react";
import VetLayout from "@/components/layout/VetLayout";

const VetSettings = () => {
  const [clinicName, setClinicName] = useState("Clinique Vétérinaire du Centre");
  const [email, setEmail] = useState("contact@clinique-centre.fr");
  const [phone, setPhone] = useState("01.23.45.67.89");
  const [address, setAddress] = useState("123 Rue de la Paix, 75001 Paris");

  return (
    <VetLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Paramètres</h1>
          <p className="text-vet-brown">Configuration de votre clinique et de votre compte</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Informations de la clinique */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center text-vet-navy">
                <User className="h-5 w-5 mr-2 text-vet-sage" />
                Informations de la clinique
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Gérez les informations principales de votre établissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName" className="text-vet-navy">Nom de la clinique</Label>
                <Input
                  id="clinicName"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-vet-navy">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-vet-navy">Téléphone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-vet-navy">Adresse</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                />
              </div>
              
              <Button className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white">
                Sauvegarder les informations
              </Button>
            </CardContent>
          </Card>

          {/* Horaires de travail */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center text-vet-navy">
                <Clock className="h-5 w-5 mr-2 text-vet-sage" />
                Horaires de travail
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Définissez vos créneaux de disponibilité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-vet-beige/30 border-2 border-dashed border-vet-blue rounded-lg p-6 text-center">
                <Clock className="h-12 w-12 text-vet-sage mx-auto mb-3 opacity-50" />
                <h3 className="font-semibold text-vet-navy mb-2">Configuration des horaires</h3>
                <p className="text-vet-brown text-sm mb-4">
                  Interface de gestion des créneaux à développer
                </p>
                <div className="space-y-2 text-vet-brown text-left max-w-sm mx-auto text-sm">
                  <p>• Horaires par jour de la semaine</p>
                  <p>• Pauses et fermetures</p>
                  <p>• Durée des consultations</p>
                  <p>• Créneaux d'urgence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center text-vet-navy">
                <Bell className="h-5 w-5 mr-2 text-vet-sage" />
                Notifications
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-vet-navy">Nouveaux rendez-vous</p>
                  <p className="text-sm text-vet-brown">Recevoir un email pour chaque nouveau RDV</p>
                </div>
                <Button variant="outline" size="sm" className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white">
                  Activé
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-vet-navy">Rappels de RDV</p>
                  <p className="text-sm text-vet-brown">Notifications 24h avant les consultations</p>
                </div>
                <Button variant="outline" size="sm" className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white">
                  Activé
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-vet-navy">Annulations</p>
                  <p className="text-sm text-vet-brown">Notification immédiate d'annulation</p>
                </div>
                <Button variant="outline" size="sm" className="border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
                  Désactivé
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center text-vet-navy">
                <Shield className="h-5 w-5 mr-2 text-vet-sage" />
                Sécurité
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Gérez votre mot de passe et la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                Changer le mot de passe
              </Button>
              
              <Button variant="outline" className="w-full border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
                Authentification à deux facteurs
              </Button>
              
              <Separator />
              
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                Déconnecter tous les appareils
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </VetLayout>
  );
};

export default VetSettings;
