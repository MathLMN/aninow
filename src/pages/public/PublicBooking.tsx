
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PublicBooking = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header */}
      <header className="bg-vet-navy text-vet-beige shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Heart className="h-6 w-6 text-vet-sage" />
              <span className="text-xl font-bold">VetBooking</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-vet-beige hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Titre */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-vet-navy mb-2">
              Prendre un rendez-vous
            </h1>
            <p className="text-vet-brown text-lg">
              Remplissez le formulaire ci-dessous pour planifier votre visite
            </p>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vet-navy">
                Informations sur votre animal
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Cette section sera remplacée par le formulaire Tally que vous fournirez
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {/* Placeholder pour le formulaire Tally */}
              <div className="bg-vet-beige/50 border-2 border-dashed border-vet-blue rounded-lg p-12 text-center">
                <Heart className="h-16 w-16 text-vet-sage mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-vet-navy mb-2">
                  Formulaire en cours d'intégration
                </h3>
                <p className="text-vet-brown mb-6">
                  Le formulaire Tally avec logique conditionnelle sera intégré ici
                  selon vos captures d'écran.
                </p>
                <div className="space-y-3 text-vet-brown text-left max-w-md mx-auto">
                  <p>• Informations sur l'animal (nom, espèce, race, âge)</p>
                  <p>• Motif de la consultation</p>
                  <p>• Questions conditionnelles selon le type de visite</p>
                  <p>• Informations du propriétaire</p>
                  <p>• Préférences de créneaux</p>
                </div>
              </div>

              {/* Bouton temporaire pour tester la navigation */}
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => navigate('/booking/slots')}
                  className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 py-3"
                >
                  Continuer vers la sélection de créneaux
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicBooking;
