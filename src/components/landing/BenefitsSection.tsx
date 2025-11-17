import { Clock, FileText, AlertTriangle, MessageCircle, Calendar, Shield } from "lucide-react";
const BenefitsSection = () => {
  const benefits = [{
    icon: FileText,
    number: "01",
    title: "Détaillez les symptômes en ligne",
    description: "Décrivez l'état de votre animal en quelques clics"
  }, {
    icon: AlertTriangle,
    number: "02",
    title: "Priorisation automatique",
    description: "L'équipe adapte la prise en charge selon l'urgence"
  }, {
    icon: Shield,
    number: "03",
    title: "Expertise professionnelle",
    description: "Même qualité qu'un appel téléphonique"
  }, {
    icon: MessageCircle,
    number: "04",
    title: "Conseils personnalisés",
    description: "Recommandations adaptées à votre animal"
  }, {
    icon: Clock,
    number: "05",
    title: "Disponible 24/7",
    description: "Réservez à tout moment, jour et nuit"
  }, {
    icon: Calendar,
    number: "06",
    title: "Organisation optimale",
    description: "Meilleure gestion des rendez-vous"
  }];
  return <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-4 py-1.5 bg-vet-blue/20 rounded-full mb-4">
            <span className="text-vet-navy text-sm font-semibold">Pourquoi nous choisir</span>
          </div>
          <h2 className="text-3xl font-bold text-vet-navy mb-4 sm:text-4xl">
            Prenez rendez-vous<br />en toute simplicité
          </h2>
          <p className="text-vet-brown text-lg max-w-2xl mx-auto">
            Un service pensé pour le bien-être de votre animal
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => <div key={index} className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-vet-blue/10 hover:border-vet-blue/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-vet-blue to-vet-sage rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-5xl font-bold text-vet-blue/10 group-hover:text-vet-blue/20 transition-colors">
                  {benefit.number}
                </span>
              </div>
              <h3 className="font-bold text-vet-navy text-lg mb-2 leading-tight">
                {benefit.title}
              </h3>
              <p className="text-vet-brown text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default BenefitsSection;