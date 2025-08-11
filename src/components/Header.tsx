import { Button } from "@/components/ui/button";
import { Stethoscope, Home, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname === '/admin';
  return <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b shadow-lg">
      <div className="container mx-auto px-3 sm:px-6 sm:py-3 py-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/lovable-uploads/44fb068f-1799-4a6c-9ad1-1308c67a7645.png" alt="AniNow" className="h-8 w-auto sm:h-10 md:h-12" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isHomePage && <Link to="/">
                <Button variant="ghost" className="text-vet-navy hover:bg-vet-beige/20 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Accueil</span>
                </Button>
              </Link>}
            {isHomePage && <>
                <Link to="/vet/login">
                  <Button variant="ghost" className="bg-vet-blue text-white hover:bg-vet-blue/90 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                    <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Se connecter</span>
                    <span className="sm:hidden">Vétérinaire</span>
                  </Button>
                </Link>
                <Link to="/admin">
                  
                </Link>
              </>}
            {isAdminPage && <Link to="/vet/login">
                <Button variant="ghost" className="bg-vet-blue text-white hover:bg-vet-blue/90 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                  <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Espace vétérinaire</span>
                  <span className="sm:hidden">Vétérinaire</span>
                </Button>
              </Link>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;