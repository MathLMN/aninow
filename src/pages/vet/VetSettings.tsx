
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Building2, Settings } from "lucide-react";
import { ClinicSettingsForm } from "@/components/settings/ClinicSettingsForm";
import { ClinicSelector } from "@/components/clinic/ClinicSelector";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIsMobile } from "@/hooks/use-mobile";

const VetSettings = () => {
  const { isAdmin: isGlobalAdmin } = useAdminAuth();
  const isMobile = useIsMobile();

  console.log('🔍 VetSettings - Global admin status:', isGlobalAdmin);

  return (
    <div className="container mx-auto py-4 sm:py-6 pt-6 sm:pt-10 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-vet-sage" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy">Paramètres</h1>
          <p className="text-sm sm:text-base text-vet-brown">Gérez les paramètres de votre clinique et de votre compte</p>
        </div>
      </div>

      {/* Sélecteur de clinique */}
      <ClinicSelector />

      <Tabs defaultValue={isGlobalAdmin ? "admin" : "clinic"} className="space-y-4 sm:space-y-6">
        <TabsList className={`grid w-full ${isGlobalAdmin ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} gap-1 h-auto ${isMobile ? 'flex-col' : ''}`}>
          <TabsTrigger value="clinic" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isMobile ? "text-xs" : ""}>Configuration clinique</span>
          </TabsTrigger>
          {isGlobalAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className={isMobile ? "text-xs" : ""}>Administration globale</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="advanced" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isMobile ? "text-xs" : ""}>Paramètres avancés</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinic" className="space-y-4 sm:space-y-6">
          <ClinicSettingsForm />
        </TabsContent>

        {isGlobalAdmin && (
          <TabsContent value="admin" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl text-vet-navy">
                  Administration globale
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-vet-brown">
                  Tableau de bord pour la gestion globale des comptes cliniques (AniNow)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <AdminDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="advanced" className="space-y-4 sm:space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-vet-navy">
                Paramètres avancés
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-vet-brown">
                Accédez aux fonctionnalités avancées de sécurité et de gestion de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-vet-blue/30 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-vet-navy text-sm sm:text-base">Sécurité du compte</h3>
                    <p className="text-xs sm:text-sm text-vet-brown">
                      Changer votre mot de passe et gérer la sécurité de votre compte
                    </p>
                  </div>
                  <Link to="/vet/advanced-settings" className="w-full sm:w-auto">
                    <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white w-full sm:w-auto text-sm">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
