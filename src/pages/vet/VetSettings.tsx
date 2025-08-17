
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
    <div className="w-full max-w-none mx-auto py-2 sm:py-4 lg:py-6 space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Settings className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-vet-sage flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-vet-navy">Paramètres</h1>
            <p className="text-sm sm:text-base text-vet-brown">Gérez les paramètres de votre clinique et de votre compte</p>
          </div>
        </div>

        {/* Sélecteur de clinique */}
        <div className="w-full">
          <ClinicSelector />
        </div>
      </div>

      <Tabs defaultValue={isGlobalAdmin ? "admin" : "clinic"} className="w-full space-y-4 sm:space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className={`
            grid w-full min-w-max
            ${isGlobalAdmin ? 'grid-cols-3' : 'grid-cols-2'} 
            gap-1 h-auto bg-muted/50 p-1 rounded-lg
          `}>
            <TabsTrigger value="clinic" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-3 data-[state=active]:bg-white">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Configuration clinique</span>
            </TabsTrigger>
            {isGlobalAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-3 data-[state=active]:bg-white">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Administration globale</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="advanced" className="flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-3 data-[state=active]:bg-white">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Paramètres avancés</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="clinic" className="space-y-4 sm:space-y-6 w-full">
          <ClinicSettingsForm />
        </TabsContent>

        {isGlobalAdmin && (
          <TabsContent value="admin" className="space-y-4 sm:space-y-6 w-full">
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl w-full">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-vet-navy">
                  Administration globale
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-vet-brown">
                  Tableau de bord pour la gestion globale des comptes cliniques (AniNow)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <AdminDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="advanced" className="space-y-4 sm:space-y-6 w-full">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl w-full">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-vet-navy">
                Paramètres avancés
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-vet-brown">
                Accédez aux fonctionnalités avancées de sécurité et de gestion de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-3 sm:p-4 lg:p-6">
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-vet-blue/30 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-vet-navy text-sm sm:text-base">Sécurité du compte</h3>
                    <p className="text-xs sm:text-sm text-vet-brown">
                      Changer votre mot de passe et gérer la sécurité de votre compte
                    </p>
                  </div>
                  <Link to="/vet/advanced-settings" className="w-full sm:w-auto flex-shrink-0">
                    <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white w-full sm:w-auto text-xs sm:text-sm">
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
