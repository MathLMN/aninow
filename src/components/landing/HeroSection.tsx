
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36% pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center animate-fade-in">
          {/* Contenu textuel - 7 colonnes */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#1B1B3A] leading-tight">
                Prenez rendez-vous chez votre vétérinaire{" "}
                <span className="text-[#96C3CE]">en quelques clics</span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-2xl text-[#1b1b3a] font-semibold max-w-2xl">
                Notre système de prise de rendez-vous en ligne simplifie vos démarches 
                et améliore le suivi de la santé de vos animaux.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 text-lg text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4D9380]/10 rounded-full">
                    <Calendar className="w-6 h-6 text-[#4D9380]" />
                  </div>
                  <span>Prise de rendez-vous 24h/24 et 7j/7</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4D9380]/10 rounded-full">
                    <Smartphone className="w-6 h-6 text-[#4D9380]" />
                  </div>
                  <span>Interface simple et intuitive</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4D9380]/10 rounded-full">
                    <ArrowRight className="w-6 h-6 text-[#4D9380]" />
                  </div>
                  <span>Confirmation immédiate de votre rendez-vous</span>
                </div>
              </div>

              <div className="pt-4">
                <ClinicAppointmentButton />
              </div>
            </div>
          </div>

          {/* Image - 5 colonnes */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <img 
                src="/lovable-uploads/7e29ac48-920b-4324-b6a4-2c37572a1ef1.png" 
                alt="Chien et chat - Nos compagnons fidèles" 
                className="w-full h-auto object-contain animate-fade-in"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
