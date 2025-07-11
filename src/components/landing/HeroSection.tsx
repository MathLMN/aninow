
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <div className="container mx-auto px-3 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="animate-fade-in text-center lg:text-left z-20 relative">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-vet-navy mb-4 sm:mb-6 leading-tight">
                Prenez rendez-vous chez votre vétérinaire
                <span className="block text-vet-sage">en quelques clics</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-vet-brown mb-6 sm:mb-8 leading-relaxed">
                Notre système de prise de rendez-vous en ligne simplifie vos démarches 
                et améliore le suivi de la santé de vos animaux.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center">
                <Link to="/booking">
                  <Button 
                    size="lg"
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex items-center text-vet-brown text-sm sm:text-base">
                  <Smartphone className="h-4 w-4 mr-2" />
                  <span>Gratuit et sans inscription</span>
                </div>
              </div>
            </div>

            {/* Image Content */}
            <div className="animate-fade-in relative flex items-center justify-center z-10">
              <img 
                src="/lovable-uploads/7e29ac48-920b-4324-b6a4-2c37572a1ef1.png"
                alt="Chien et chat - Nos compagnons fidèles"
                className="w-full h-auto max-w-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
