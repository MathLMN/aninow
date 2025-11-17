import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Smartphone, FileText, AlertTriangle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36% py-6 sm:py-10 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Contenu textuel */}
          <div>
            <div className="h-10 mt-24"></div>
            
            <h1 className="text-xl sm:text-2xl xl:text-4xl text-[#1B1B3A] leading-tight text-left font-bold lg:text-2xl">
              Prenez rendez-vous chez votre<br />
              vétérinaire{" "}
              <span className="text-[#96C3CE]">en quelques clics</span>
            </h1>
            
            <p className="mt-4 sm:mt-6 text-lg max-w-3xl text-left text-[#1b1b3a] font-medium sm:text-lg">
              Décrivez les symptômes de votre animal en ligne et bénéficiez d'une prise en charge adaptée par votre équipe vétérinaire, disponible 24h/24.
            </p>
            
            <div className="mt-6 sm:mt-8 max-w-3xl space-y-4">
              <div className="group bg-white rounded-xl p-4 border-2 border-vet-blue/10 hover:border-vet-blue/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-vet-blue to-vet-sage rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-vet-navy font-medium pt-3">Détaillez l'état et les symptômes de votre compagnon</span>
                </div>
              </div>
              
              <div className="group bg-white rounded-xl p-4 border-2 border-vet-blue/10 hover:border-vet-blue/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-vet-blue to-vet-sage rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-vet-navy font-medium pt-3">L'équipe priorise selon l'urgence de chaque situation</span>
                </div>
              </div>
              
              <div className="group bg-white rounded-xl p-4 border-2 border-vet-blue/10 hover:border-vet-blue/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-vet-blue to-vet-sage rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-vet-navy font-medium pt-3">Recevez des conseils adaptés en attendant votre rendez-vous</span>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-start">
              <ClinicAppointmentButton />
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="transform translate-y-16">
              <img 
                src="/lovable-uploads/0a562930-d37b-48fc-8aa4-81a73f2a8978.png" 
                alt="Deux lévriers - Nos compagnons fidèles" 
                className="w-full max-w-none scale-110 h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
