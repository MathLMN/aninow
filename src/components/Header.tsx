
import { Button } from "@/components/ui/button";
import { Stethoscope, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white text-vet-navy shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/lovable-uploads/44fb068f-1799-4a6c-9ad1-1308c67a7645.png" alt="AniNow" className="h-8 w-auto sm:h-10 md:h-12" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isHomePage && (
              <Link to="/">
                <Button variant="ghost" className="text-vet-navy hover:bg-vet-beige/20 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Accueil</span>
                </Button>
              </Link>
            )}
            {isHomePage && (
              <Link to="/vet/login">
                <Button variant="ghost" className="bg-vet-blue text-white hover:bg-vet-blue/90 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                  <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden xs:inline">Espace équipes </span>vétérinaires
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
