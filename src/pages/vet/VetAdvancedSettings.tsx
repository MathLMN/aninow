
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, Settings } from "lucide-react";
import AdvancedPasswordChangeForm from "@/components/vet/AdvancedPasswordChangeForm";

const VetAdvancedSettings = () => {
  return (
    <div className="container mx-auto py-6 pt-10 space-y-6">
      <div className="flex items-center space-x-4">
        <Settings className="h-8 w-8 text-vet-sage" />
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Paramètres avancés</h1>
          <p className="text-vet-brown">Gestion avancée de votre compte vétérinaire</p>
        </div>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gestion du compte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <Alert className="border-vet-blue/30 bg-vet-blue/10">
            <Shield className="h-4 w-4 text-vet-blue" />
            <AlertDescription className="text-vet-navy">
              <strong>Système hybride:</strong> Vous utilisez Supabase Auth avec des fonctionnalités avancées.
              Votre mot de passe est géré de manière sécurisée.
            </AlertDescription>
          </Alert>
          
          <AdvancedPasswordChangeForm />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-vet-navy">
                Gestion du compte
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Informations et actions sur votre compte vétérinaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-amber-300 bg-amber-50">
                <AlertDescription className="text-amber-800">
                  <strong>Migration Supabase Auth:</strong> Votre compte utilise maintenant l'authentification Supabase.
                  Pour des modifications avancées, contactez l'administrateur de la clinique.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VetAdvancedSettings;
