
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Building2, Settings, Users, Calendar } from "lucide-react";
import { ClinicSettingsForm } from "@/components/settings/ClinicSettingsForm";

const VetSettings = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Settings className="h-8 w-8 text-vet-sage" />
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Paramètres</h1>
          <p className="text-vet-brown">Gérez les paramètres de votre clinique et de votre compte</p>
        </div>
      </div>

      <Tabs defaultValue="clinic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clinic" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Configuration de la clinique
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Paramètres avancés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinic" className="space-y-6">
          <ClinicSettingsForm />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-vet-navy">
                Paramètres avancés
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Accédez aux fonctionnalités avancées de sécurité et de gestion de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border border-vet-blue/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-vet-navy">Sécurité du compte</h3>
                    <p className="text-sm text-vet-brown">
                      Changer votre mot de passe et gérer la sécurité de votre compte
                    </p>
                  </div>
                  <Link to="/vet/advanced-settings">
                    <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Accéder
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VetSettings;
