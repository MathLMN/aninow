
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAFA] via-[#EDE3DA] to-[#F5F1ED] px-4 sm:px-6 lg:px-8 pt-0">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Contenu textuel - Version moderne */}
          <div className="space-y-8 lg:pr-8 order-2 lg:order-1">
            <div className="space-y-6">
              {/* Badge de confiance */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#96C3CE]/20 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-[#1B1B3A]">Plateforme de confiance</span>
              </div>

              {/* Titre principal avec design moderne */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none">
                <span className="text-[#1B1B3A] block">Soins vétérinaires</span>
                <span className="text-[#96C3CE] block">simplifiés</span>
              </h1>
              
              {/* Sous-titre attractif */}
              <p className="text-xl lg:text-2xl text-[#1b1b3a]/80 font-medium leading-relaxed max-w-lg">
                Prenez rendez-vous en ligne et offrez à vos compagnons les meilleurs soins
              </p>
            </div>
            
            {/* Points forts avec icônes modernes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
                <div className="p-2 bg-[#4D9380]/10 rounded-xl">
                  <Heart className="w-5 h-5 text-[#4D9380]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B1B3A] text-sm">Disponible 24h/24</h3>
                  <p className="text-sm text-[#1b1b3a]/70">Réservez quand vous voulez</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
                <div className="p-2 bg-[#4D9380]/10 rounded-xl">
                  <Shield className="w-5 h-5 text-[#4D9380]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B1B3A] text-sm">Vétérinaires qualifiés</h3>
                  <p className="text-sm text-[#1b1b3a]/70">Professionnels certifiés</p>
                </div>
              </div>
            </div>

            {/* CTA modernisé */}
            <div className="pt-4">
              <ClinicAppointmentButton />
              <p className="text-sm text-[#1b1b3a]/60 mt-3 text-center">
                ✨ Gratuit • Sans engagement • Confirmation immédiate
              </p>
            </div>
          </div>

          {/* Visuel - Plus grand et centré */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative">
              {/* Effet de fond décoratif */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#96C3CE]/20 to-[#4D9380]/20 rounded-3xl blur-xl"></div>
              
              {/* Image principale */}
              <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/60 shadow-2xl">
                <img 
                  src="/lovable-uploads/0a562930-d37b-48fc-8aa4-81a73f2a8978.png" 
                  alt="Deux lévriers - Nos compagnons fidèles" 
                  className="w-full h-auto object-contain max-h-[600px] lg:max-h-[700px] xl:max-h-[800px] rounded-2xl"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              
              {/* Éléments décoratifs flottants */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#96C3CE] rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-[#4D9380] rounded-full opacity-40 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
