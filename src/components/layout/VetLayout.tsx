import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Calendar, Users, Settings, BarChart3, LogOut, CalendarDays } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface VetLayoutProps {
  children: React.ReactNode;
}

const VetLayout = ({ children }: VetLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/vet/dashboard" },
    { icon: CalendarDays, label: "Planning", path: "/vet/planning" },
    { icon: Calendar, label: "Créneaux", path: "/vet/schedule" },
    { icon: Users, label: "Rendez-vous", path: "/vet/appointments" },
    { icon: Settings, label: "Paramètres", path: "/vet/settings" },
  ];

  const handleLogout = () => {
    navigate('/vet/login');
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header */}
      <header className="bg-vet-navy text-vet-beige shadow-lg relative z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo et toggle mobile */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-vet-beige hover:bg-white/10"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link to="/vet/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <Heart className="h-6 w-6 text-vet-sage" />
                <span className="text-xl font-bold">AniNow</span>
              </Link>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`text-vet-beige hover:bg-white/10 ${
                      isActivePath(item.path) ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <span className="hidden md:block text-vet-blue text-sm">
                Clinique Vétérinaire du Centre
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-vet-beige hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="p-6 border-b border-vet-blue/20">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-vet-sage" />
                <span className="text-xl font-bold text-vet-navy">AniNow</span>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-vet-navy hover:bg-vet-beige/50 ${
                      isActivePath(item.path) ? 'bg-vet-sage/10 text-vet-sage' : ''
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default VetLayout;
