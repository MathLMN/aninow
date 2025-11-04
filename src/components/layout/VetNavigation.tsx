

import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Settings, 
  LogOut, 
  Clock,
  BarChart3
} from "lucide-react";
import { useVetAuth } from "@/hooks/useVetAuth";
import logoAninow from "@/assets/logo-aninow.png";

export const VetNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, veterinarian } = useVetAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/vet/login');
  };

  const navigationItems = [
    {
      path: "/vet/dashboard",
      label: "Dashboard",
      icon: BarChart3
    },
    {
      path: "/vet/appointments",
      label: "Rendez-vous",
      icon: Calendar
    },
    {
      path: "/vet/planning",
      label: "Planning",
      icon: Clock
    },
    {
      path: "/vet/settings",
      label: "Paramètres",
      icon: Settings
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Logo - Toujours fixe à gauche */}
          <Link to="/vet/dashboard" className="flex items-center space-x-3 flex-shrink-0">
            <img src={logoAninow} alt="AniNow Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-vet-navy whitespace-nowrap">AniNow Pro</span>
          </Link>

          {/* Navigation Links - Bien répartis dans l'espace */}
          <div className="hidden md:flex md:flex-1 md:justify-center md:items-center">
            <div className="flex space-x-1 lg:space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 lg:px-4 py-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "border-vet-sage text-vet-sage"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu - Fixé à droite */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {veterinarian && (
              <div className="hidden lg:flex lg:items-center lg:space-x-3">
                <span className="text-sm text-gray-700 font-medium">
                  Dr. {veterinarian.name}
                </span>
                {veterinarian.specialty && (
                  <span className="text-xs text-gray-500">
                    {veterinarian.specialty}
                  </span>
                )}
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 whitespace-nowrap"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  isActive
                    ? "border-vet-sage text-vet-sage bg-vet-sage/10"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

