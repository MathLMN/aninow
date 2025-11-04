
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Heart, CheckCircle, Users, Shield, AlertTriangle } from "lucide-react";
import catPortrait from "@/assets/cat-portrait.png";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Détaillez les symptômes de votre animal", 
      description: "Décrivez précisément l'état et les symptômes de votre compagnon directement en ligne"
    },
    {
      icon: AlertTriangle,
      title: "Une équipe qui priorise selon l'urgence",
      description: "L'équipe vétérinaire prend connaissance des symptômes et adapte la prise en charge"
    },
    {
      icon: Users,
      title: "L'expertise des auxiliaires vétérinaires",
      description: "Bénéficiez de la même qualité de service qu'un appel téléphonique, disponible à tout moment"
    },
    {
      icon: CheckCircle,
      title: "Des conseils en attendant votre rendez-vous",
      description: "Recevez des recommandations adaptées à la situation de votre animal"
    },
    {
      icon: Clock,
      title: "Disponible 24h/24, 7j/7",
      description: "Prenez rendez-vous quand vous le souhaitez, sans attendre l'ouverture de la clinique"
    },
    {
      icon: Calendar,
      title: "Une meilleure organisation pour votre clinique",
      description: "Aidez votre établissement vétérinaire à mieux gérer les rendez-vous et les urgences"
    }
  ];

  return (
    <section className="bg-white/80 py-8 sm:py-16">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-vet-navy mb-3 sm:mb-4">
            Pourquoi choisir notre système ?
          </h2>
          <p className="text-vet-brown text-sm sm:text-lg max-w-2xl mx-auto">
            Découvrez tous les avantages de la prise de rendez-vous en ligne
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
          {/* Grille des bénéfices */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white/90 hover:shadow-lg transition-shadow duration-200 border-vet-blue/20">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="bg-vet-sage/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <benefit.icon className="h-6 w-6 sm:h-8 sm:w-8 text-vet-sage" />
                  </div>
                  <h3 className="font-semibold text-vet-navy mb-2 text-sm sm:text-base">
                    {benefit.title}
                  </h3>
                  <p className="text-vet-brown text-xs sm:text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Image du chat */}
          <div className="hidden lg:flex justify-center items-center">
            <img 
              src={catPortrait} 
              alt="Chat tigré heureux" 
              className="w-full max-w-sm h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
