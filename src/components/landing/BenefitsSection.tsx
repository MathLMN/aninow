
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
    <section className="py-8 sm:py-16 bg-gradient-to-br from-background via-background to-vet-sage/5 relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Pourquoi choisir notre système ?
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Un accompagnement complet pour le bien-être de votre compagnon
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Benefits grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-vet-sage/20 hover:border-vet-sage/40 bg-card/80 backdrop-blur-sm">
                  <div className="flex flex-col items-start space-y-3 sm:space-y-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-vet-sage/10">
                      <benefit.icon className="h-5 w-5 sm:h-6 sm:w-6 text-vet-sage" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Cat image with decorative frame */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-vet-sage/10 to-transparent z-10"></div>
                <img 
                  src={catPortrait} 
                  alt="Portrait de chat attentif" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-vet-beige/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
