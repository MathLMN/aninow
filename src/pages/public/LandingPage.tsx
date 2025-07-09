
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
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[500px] lg:min-h-[600px]">
          {/* Background avec forme de vague */}
          <div className="absolute inset-0 bg-gradient-to-r from-vet-sage/20 to-vet-blue/10">
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 1200 600" 
              preserveAspectRatio="xMidYMid slice"
            >
              <path 
                d="M0,100 C300,200 600,0 1200,150 L1200,600 L0,600 Z" 
                fill="url(#waveGradient)" 
                opacity="0.8"
              />
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--vet-sage))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--vet-blue))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative container mx-auto px-3 sm:px-6 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[400px]">
              {/* Text Content - Left Side */}
              <div className="animate-fade-in text-center lg:text-left z-10">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-vet-navy mb-6 leading-tight">
                  Votre rendez-vous vétérinaire
                  <span className="block text-white text-2xl sm:text-4xl lg:text-5xl mt-2">
                    en quelques clics !
                  </span>
                </h1>
                
                {/* Badge circulaire comme dans l'exemple */}
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full mb-8 shadow-lg">
                  <div className="text-center text-white">
                    <div className="text-xs sm:text-sm font-semibold leading-tight">
                      Simple, rapide et gratuit
                    </div>
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mt-1" />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <Link to="/booking">
                    <Button 
                      size="lg"
                      className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 w-full sm:w-auto"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Prendre rendez-vous
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <div className="flex items-center text-vet-brown text-base">
                    <Smartphone className="h-4 w-4 mr-2" />
                    <span>Gratuit et sans inscription</span>
                  </div>
                </div>
              </div>

              {/* Image Content - Right Side */}
              <div className="animate-fade-in flex justify-center lg:justify-end relative z-10">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/7e29ac48-920b-4324-b6a4-2c37572a1ef1.png"
                    alt="Chien et chat - Nos compagnons fidèles"
                    className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] object-cover rounded-full shadow-2xl border-4 border-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vet-sage/20 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white py-8 sm:py-16">
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
                <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-200 border-vet-blue/20">
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
        <section className="py-8 sm:py-16 bg-gray-50">
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
