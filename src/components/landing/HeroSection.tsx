
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const HeroSection = () => {
  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36% px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center animate-fade-in">
          {/* Contenu textuel - 8 colonnes pour plus d'espace au titre */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1B1B3A] leading-tight">
                Prenez rendez-vous chez votre vétérinaire{" "}
                <span className="text-[#96C3CE]">en quelques clics</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-xl text-[#1b1b3a] font-semibold max-w-2xl">
                Notre système de prise de rendez-vous en ligne simplifie vos démarches 
                et améliore le suivi de la santé de vos animaux.
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 text-base lg:text-lg text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4D9380]/10 rounded-full">
                    <Calendar className="w-5 h-5 text-[#4D9380]" />
                  </div>
                  <span>Prise de rendez-vous 24h/24 et 7j/7</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4D9380]/10 rounded-full">
                    <Smartphone className="w-5 h-5 text-[#4D9380]" />
                  </div>
                  <span>Interface simple et intuitive</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4D9380]/10 rounded-full">
                    <ArrowRight className="w-5 h-5 text-[#4D9380]" />
                  </div>
                  <span>Confirmation immédiate de votre rendez-vous</span>
                </div>
              </div>

              <div className="pt-3">
                <ClinicAppointmentButton />
              </div>
            </div>
          </div>

          {/* Image - 4 colonnes pour plus d'impact visuel */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-full">
              <img 
                src="/lovable-uploads/92924b51-6e30-4905-8315-50e8b2d9b9cf.png" 
                alt="Chien et chat - Nos compagnons fidèles" 
                className="w-full h-auto object-contain animate-fade-in max-h-[400px] lg:max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
