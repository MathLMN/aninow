import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar, Heart, CheckCircle, Users, Shield, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const LandingPage = () => {
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

  const steps = [
    {
      number: "1",
      title: "Informations de l'animal",
      description: "Renseignez l'espèce, le nom et les détails de votre compagnon"
    },
    {
      number: "2", 
      title: "Motif de consultation",
      description: "Décrivez les symptômes ou le type de consultation souhaité"
    },
    {
      number: "3",
      title: "Choix du créneau",
      description: "Sélectionnez l'heure qui vous convient le mieux"
    },
    {
      number: "4",
      title: "Confirmation",
      description: "Recevez votre confirmation par email et SMS"
    }
  ];

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-3 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end min-h-[500px] lg:min-h-[600px]">
              {/* Text Content */}
              <div className="animate-fade-in text-center lg:text-left z-10 pb-8 lg:pb-16">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-vet-navy mb-4 sm:mb-6 leading-tight">
                  Prenez rendez-vous chez votre vétérinaire
                  <span className="block text-vet-sage">en quelques clics</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-vet-brown mb-6 sm:mb-8 leading-relaxed">
                  Notre système de prise de rendez-vous en ligne simplifie vos démarches 
                  et améliore le suivi de la santé de vos animaux.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center">
                  <Link to="/booking">
                    <Button 
                      size="lg"
                      className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Prendre rendez-vous
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <div className="flex items-center text-vet-brown text-sm sm:text-base">
                    <Smartphone className="h-4 w-4 mr-2" />
                    <span>Gratuit et sans inscription</span>
                  </div>
                </div>
              </div>

              {/* Image Content - Large, no border, aligned to bottom */}
              <div className="animate-fade-in relative lg:absolute lg:right-0 lg:bottom-0 lg:w-1/2 lg:h-full flex items-end">
                <img 
                  src="/lovable-uploads/7e29ac48-920b-4324-b6a4-2c37572a1ef1.png"
                  alt="Chien et chat - Nos compagnons fidèles"
                  className="w-full h-auto max-h-full object-cover object-bottom"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
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

        {/* How it works Section */}
        <section className="py-8 sm:py-16">
          <div className="container mx-auto px-3 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-3xl font-bold text-vet-navy mb-3 sm:mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-vet-brown text-sm sm:text-lg max-w-2xl mx-auto">
                Seulement 4 étapes pour prendre votre rendez-vous
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {steps.map((step, index) => (
                  <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="bg-vet-sage text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-base sm:text-lg">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-vet-navy mb-2 text-sm sm:text-base">
                      {step.title}
                    </h3>
                    <p className="text-vet-brown text-xs sm:text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-vet-navy py-8 sm:py-16">
          <div className="container mx-auto px-3 sm:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Prêt à prendre rendez-vous ?
              </h2>
              <p className="text-vet-beige text-sm sm:text-lg mb-6 sm:mb-8">
                Votre vétérinaire vous attend. Commencez dès maintenant et obtenez 
                votre créneau en moins de 3 minutes.
              </p>
              
              <Link to="/booking">
                <Button 
                  size="lg"
                  className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
