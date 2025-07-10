
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, Heart, CheckCircle, Users, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Gain de temps", 
      description: "Prenez rendez-vous 24h/24, 7j/7 sans attendre au téléphone"
    },
    {
      icon: Calendar,
      title: "Planning optimisé",
      description: "Visualisez les créneaux disponibles en temps réel"
    },
    {
      icon: Heart,
      title: "Suivi personnalisé",
      description: "Un questionnaire adapté aux besoins de votre animal"
    },
    {
      icon: CheckCircle,
      title: "Confirmation immédiate",
      description: "Recevez instantanément votre confirmation de RDV"
    },
    {
      icon: Users,
      title: "Simplicité",
      description: "Interface intuitive pour tous les propriétaires d'animaux"
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Vos données sont protégées et confidentielles"
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
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
      </div>
    </section>
  );
};

export default BenefitsSection;
