
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Settings, 
  LogOut, 
  Home,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    // Redirect to login or public page
    window.location.href = "/admin/login";
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/admin/dashboard", icon: Home, label: "Tableau de bord" },
    { path: "/admin/practice-requests", icon: FileText, label: "Demandes cabinets" },
    { path: "/admin/settings", icon: Settings, label: "Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-background to-gray-100">
      {/* Navigation principale */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Titre */}
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                AniNow - Administration
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
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
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
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
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

      {/* Contenu principal */}
      <main className="container mx-auto px-6 pt-6 pb-8">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
