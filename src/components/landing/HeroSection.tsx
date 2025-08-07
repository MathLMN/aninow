
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36% py-6 sm:py-10 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#1B1B3A] leading-tight text-left">
              Prenez rendez-vous chez votre vétérinaire{" "}
              <span className="text-[#96C3CE]">en quelques clics</span>
            </h1>
            
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl max-w-3xl text-left text-[#1b1b3a] font-bold">
              Notre système de prise de rendez-vous en ligne simplifie vos démarches 
              et améliore le suivi de la santé de vos animaux.
            </p>
            
            <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-600 max-w-3xl text-left space-y-3">
              <span className="flex items-start gap-2">
                <Calendar className="w-5 h-5 mt-1 flex-shrink-0 text-[#4D9380]" />
                <span>Prise de rendez-vous 24h/24 et 7j/7</span>
              </span>
              
              <span className="flex items-start gap-2">
                <Smartphone className="w-5 h-5 mt-1 flex-shrink-0 text-[#4D9380]" />
                <span>Interface simple et intuitive</span>
              </span>
              
              <span className="flex items-start gap-2">
                <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0 text-[#4D9380]" />
                <span>Confirmation immédiate de votre rendez-vous</span>
              </span>
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col items-start">
              <ClinicAppointmentButton />
            </div>
          </div>

          <div className="hidden lg:flex items-end justify-center pt-15">
            <img src="/lovable-uploads/7e29ac48-920b-4324-b6a4-2c37572a1ef1.png" alt="Chien et chat - Nos compagnons fidèles" className="w-full h-auto object-contain mt-12 animate-fade-in" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
