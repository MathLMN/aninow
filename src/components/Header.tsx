
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-vet-navy text-vet-beige shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-3 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/44fb068f-1799-4a6c-9ad1-1308c67a7645.png" alt="AniNow" className="h-6 w-auto sm:h-8" />
          </div>
          <Link to="/vet/login">
            <Button variant="ghost" className="bg-vet-blue text-white hover:bg-vet-blue/90 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
              <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Espace </span>Clinique
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
