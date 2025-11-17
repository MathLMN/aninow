import { Clock, Heart, AlertTriangle, Users, CheckCircle, Calendar } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Décrivez les symptômes",
      bgColor: "bg-vet-blue/20",
      iconBg: "bg-vet-blue",
      iconColor: "text-white"
    },
    {
      icon: AlertTriangle,
      title: "Priorité selon l'urgence",
      bgColor: "bg-vet-sage/20",
      iconBg: "bg-vet-sage",
      iconColor: "text-white"
    },
    {
      icon: Users,
      title: "Expertise vétérinaire",
      bgColor: "bg-vet-blue/20",
      iconBg: "bg-vet-blue",
      iconColor: "text-white"
    },
    {
      icon: CheckCircle,
      title: "Conseils personnalisés",
      bgColor: "bg-vet-sage/20",
      iconBg: "bg-vet-sage",
      iconColor: "text-white"
    },
    {
      icon: Clock,
      title: "Disponible 24/7",
      bgColor: "bg-vet-blue/20",
      iconBg: "bg-vet-blue",
      iconColor: "text-white"
    },
    {
      icon: Calendar,
      title: "Meilleure organisation",
      bgColor: "bg-vet-sage/20",
      iconBg: "bg-vet-sage",
      iconColor: "text-white"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white to-vet-blue/10 py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-vet-navy mb-3 sm:mb-4">
            Pourquoi réserver en ligne ?
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`${benefit.bgColor} rounded-2xl p-4 sm:p-8 text-center hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-vet-blue/30`}
            >
              <div className={`${benefit.iconBg} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-5 shadow-lg`}>
                <benefit.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${benefit.iconColor}`} />
              </div>
              <h3 className="font-bold text-vet-navy text-sm sm:text-lg leading-tight">
                {benefit.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
