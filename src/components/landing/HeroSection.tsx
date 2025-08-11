
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36% px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center animate-fade-in">
          {/* Contenu textuel - 7 colonnes pour laisser plus de place au visuel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-[#1B1B3A] leading-tight">
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

          {/* Image - 5 colonnes pour un visuel plus grand et impactant */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-full">
              <img 
                src="/lovable-uploads/0a562930-d37b-48fc-8aa4-81a73f2a8978.png" 
                alt="Deux lévriers - Nos compagnons fidèles" 
                className="w-full h-auto object-contain animate-fade-in max-h-[400px] lg:max-h-[450px] xl:max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
