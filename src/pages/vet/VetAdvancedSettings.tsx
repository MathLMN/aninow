
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, Settings } from "lucide-react";
import AdvancedPasswordChangeForm from "@/components/vet/AdvancedPasswordChangeForm";
import { useIsMobile } from "@/hooks/use-mobile";

const VetAdvancedSettings = () => {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-4 sm:py-6 pt-6 sm:pt-10 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-vet-sage" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy">Paramètres avancés</h1>
          <p className="text-sm sm:text-base text-vet-brown">Gestion avancée de votre compte vétérinaire</p>
        </div>
      </div>

      <Tabs defaultValue="security" className="space-y-4 sm:space-y-6">
        <TabsList className={`grid w-full grid-cols-1 sm:grid-cols-2 gap-1 h-auto ${isMobile ? 'flex-col' : ''}`}>
          <TabsTrigger value="security" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            Gestion du compte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <Alert className="border-vet-blue/30 bg-vet-blue/10 p-3 sm:p-4">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-vet-blue" />
            <AlertDescription className="text-vet-navy text-xs sm:text-sm">
              <strong>Système hybride:</strong> Vous utilisez Supabase Auth avec des fonctionnalités avancées.
              Votre mot de passe est géré de manière sécurisée.
            </AlertDescription>
          </Alert>
          
          <AdvancedPasswordChangeForm />
        </TabsContent>

        <TabsContent value="account" className="space-y-4 sm:space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-vet-navy">
                Gestion du compte
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-vet-brown">
                Informations et actions sur votre compte vétérinaire
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <Alert className="border-amber-300 bg-amber-50 p-3 sm:p-4">
                <AlertDescription className="text-amber-800 text-xs sm:text-sm">
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
