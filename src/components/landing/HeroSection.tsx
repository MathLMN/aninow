
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const HeroSection = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36% px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center animate-fade-in">
          {/* Contenu textuel - 50% de l'espace */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1B1B3A] leading-tight">
                Prenez rendez-vous chez votre vétérinaire{" "}
                <span className="text-[#96C3CE]">en quelques clics</span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-2xl text-[#1b1b3a] font-medium max-w-2xl leading-relaxed">
                Notre système de prise de rendez-vous en ligne simplifie vos démarches 
                et améliore le suivi de la santé de vos animaux.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4 text-lg lg:text-xl text-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#4D9380]/10 rounded-full flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#4D9380]" />
                  </div>
                  <span className="font-medium">Prise de rendez-vous 24h/24 et 7j/7</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#4D9380]/10 rounded-full flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-[#4D9380]" />
                  </div>
                  <span className="font-medium">Interface simple et intuitive</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#4D9380]/10 rounded-full flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-[#4D9380]" />
                  </div>
                  <span className="font-medium">Confirmation immédiate de votre rendez-vous</span>
                </div>
              </div>

              <div className="pt-4">
                <ClinicAppointmentButton />
              </div>
            </div>
          </div>

          {/* Image - 50% de l'espace avec hauteur optimisée */}
          <div className="flex items-center justify-center lg:justify-end order-first lg:order-last">
            <div className="relative w-full max-w-2xl">
              <img 
                src="/lovable-uploads/56917d06-32af-4ca5-8fc7-ff88ec2733d6.png" 
                alt="Deux lévriers - Nos compagnons fidèles" 
                className="w-full h-auto object-contain animate-fade-in max-h-[50vh] lg:max-h-[70vh]"
                loading="eager"
                fetchpriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
