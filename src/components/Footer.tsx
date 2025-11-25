import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-vet-navy text-white py-8 mt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/44fb068f-1799-4a6c-9ad1-1308c67a7645.png" 
              alt="AniNow" 
              className="h-8 w-auto brightness-0 invert"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link 
              to="/mentions-legales" 
              className="hover:text-vet-beige transition-colors"
            >
              Mentions légales
            </Link>
            <Link 
              to="/cgu" 
              className="hover:text-vet-beige transition-colors"
            >
              CGU
            </Link>
            <Link 
              to="/politique-confidentialite" 
              className="hover:text-vet-beige transition-colors"
            >
              Politique de confidentialité
            </Link>
          </div>
          
          <div className="text-sm text-gray-300">
            © {new Date().getFullYear()} AniNow. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
