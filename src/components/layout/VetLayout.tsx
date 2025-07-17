
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VetLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Simple logout - in a real app, you'd handle authentication properly
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    // Redirect to login or public page
    window.location.href = "/vet/login";
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/vet/dashboard", icon: Home, label: "Tableau de bord" },
    { path: "/vet/planning", icon: Calendar, label: "Planning" },
    { path: "/vet/appointments", icon: Users, label: "Rendez-vous" },
    { path: "/vet/schedule", icon: Clock, label: "Créneaux" },
    { path: "/vet/settings", icon: Settings, label: "Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Navigation principale */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-vet-blue/30 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Titre */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-vet-navy">
                AniNow - Interface Vétérinaire
              </h1>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive(item.path) 
                        ? "bg-vet-sage text-white" 
                        : "text-vet-navy hover:bg-vet-sage/10"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Navigation mobile */}
          <div className="md:hidden py-3">
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-1 ${
                      isActive(item.path) 
                        ? "bg-vet-sage text-white" 
                        : "text-vet-navy hover:bg-vet-sage/10"
                    }`}
                  >
                    <item.icon className="h-3 w-3" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal avec espacement adapté */}
      <main className="container mx-auto px-6 pt-6 pb-8">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default VetLayout;
