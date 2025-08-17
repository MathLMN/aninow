
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Heart, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Clock,
  BarChart3,
  Menu
} from "lucide-react";
import { useVetAuth } from "@/hooks/useVetAuth";
import { useIsMobile } from "@/hooks/use-mobile";

export const VetNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, veterinarian } = useVetAuth();
  const isMobile = useIsMobile();

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
      path: "/vet/schedule",
      label: "Horaires",
      icon: Users
    },
    {
      path: "/vet/settings",
      label: "Paramètres",
      icon: Settings
    }
  ];

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={`${
              mobile 
                ? `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-vet-sage/10 text-vet-sage border-l-4 border-vet-sage"
                      : "text-gray-600 hover:text-vet-sage hover:bg-gray-50"
                  }`
                : `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-vet-sage text-vet-sage"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`
            }`}
          >
            <Icon className={`${mobile ? "h-5 w-5" : "h-4 w-4 mr-2"}`} />
            <span className={mobile ? "" : "hidden lg:inline"}>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b shadow-sm">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center flex-1 min-w-0">
            {/* Logo */}
            <Link to="/vet/dashboard" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-vet-sage" />
              <span className="text-lg sm:text-xl font-bold text-vet-navy truncate">
                {isMobile ? "AniNow" : "AniNow Pro"}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-6 lg:ml-10 md:space-x-4 lg:space-x-8 flex-1 min-w-0">
              <NavItems />
            </div>
          </div>

          {/* User Menu & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* User Info - Hidden on mobile */}
            {veterinarian && !isMobile && (
              <div className="hidden lg:flex lg:items-center lg:space-x-3 text-right">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    Dr. {veterinarian.name}
                  </div>
                  {veterinarian.specialty && (
                    <div className="text-xs text-gray-500 truncate">
                      {veterinarian.specialty}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Logout */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="hidden md:flex text-gray-500 hover:text-gray-700 px-2 lg:px-3"
            >
              <LogOut className="h-4 w-4 mr-1 lg:mr-2" />
              <span className="hidden lg:inline">Déconnexion</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile User Info */}
                  {veterinarian && (
                    <div className="pb-4 mb-4 border-b">
                      <div className="text-base font-semibold text-vet-navy">
                        Dr. {veterinarian.name}
                      </div>
                      {veterinarian.specialty && (
                        <div className="text-sm text-vet-brown">
                          {veterinarian.specialty}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <div className="flex-1 space-y-2">
                    <NavItems mobile onItemClick={() => {}} />
                  </div>

                  {/* Mobile Logout */}
                  <div className="pt-4 mt-4 border-t">
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="w-full justify-start text-gray-500 hover:text-gray-700"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
