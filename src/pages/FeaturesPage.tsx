
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Brain, Clock, Users, Shield, BarChart3 } from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: Calendar,
      title: "Prise de rendez-vous intelligente",
      description: "Système de réservation automatisé avec questionnaire pré-consultation pour optimiser vos consultations."
    },
    {
      icon: Brain,
      title: "Intelligence artificielle",
      description: "Analyse automatique des symptômes et suggestions de diagnostic pour une meilleure préparation."
    },
    {
      icon: Clock,
      title: "Gestion de planning",
      description: "Planning intuitif avec gestion des urgences et optimisation automatique des créneaux."
    },
    {
      icon: Users,
      title: "Multi-vétérinaire",
      description: "Gestion complète d'équipes avec attribution automatique selon les spécialités."
    },
    {
      icon: Shield,
      title: "Sécurité des données",
      description: "Conformité RGPD et sécurisation maximale des données médicales de vos patients."
    },
    {
      icon: BarChart3,
      title: "Analyses et rapports",
      description: "Tableaux de bord complets avec statistiques de performance et indicateurs clés."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-vet-navy mb-4">Fonctionnalités</h1>
            <p className="text-xl text-vet-brown">Découvrez tous les outils pour optimiser votre clinique vétérinaire</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-vet-blue/30 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-vet-sage mb-4" />
                  <CardTitle className="text-xl text-vet-navy">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-vet-brown">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Card className="border-vet-blue/30 shadow-lg bg-gradient-to-br from-vet-sage/10 to-vet-blue/10">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-vet-navy mb-4">Prêt à commencer ?</h2>
                <p className="text-xl text-vet-brown mb-8">Transformez votre clinique avec nos solutions innovantes</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Essai gratuit
                  </button>
                  <button className="border border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Demander une démo
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
