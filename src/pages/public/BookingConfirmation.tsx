
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Mail, Phone, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const BookingConfirmation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Confirmation */}
          <div className="text-center mb-8 animate-fade-in">
            <CheckCircle className="h-20 w-20 text-vet-sage mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-vet-navy mb-2">
              Rendez-vous confirmé !
            </h1>
            <p className="text-vet-brown text-lg">
              Votre demande de rendez-vous a été enregistrée avec succès
            </p>
          </div>

          {/* Détails du rendez-vous */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-sage/30 shadow-xl mb-8">
            <CardHeader className="bg-vet-sage/10">
              <CardTitle className="text-vet-navy">Détails de votre rendez-vous</CardTitle>
              <CardDescription className="text-vet-brown">
                Numéro de confirmation: #RDV-2024-001
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-vet-sage" />
                  <div>
                    <p className="font-semibold text-vet-navy">Date</p>
                    <p className="text-vet-brown">Lundi 15 janvier 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-vet-sage" />
                  <div>
                    <p className="font-semibold text-vet-navy">Heure</p>
                    <p className="text-vet-brown">14:30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-vet-sage" />
                  <div>
                    <p className="font-semibold text-vet-navy">Animal</p>
                    <p className="text-vet-brown">Max (Chien)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-vet-navy">Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-vet-brown">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-vet-sage mt-0.5" />
                  <div>
                    <p className="font-semibold text-vet-navy">Confirmation par email</p>
                    <p>Vous recevrez un email de confirmation avec tous les détails dans quelques minutes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-vet-sage mt-0.5" />
                  <div>
                    <p className="font-semibold text-vet-navy">Rappel par SMS</p>
                    <p>Un SMS de rappel vous sera envoyé 24h avant votre rendez-vous.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-vet-sage mt-0.5" />
                  <div>
                    <p className="font-semibold text-vet-navy">Préparation</p>
                    <p>Pensez à apporter le carnet de santé de votre animal et la liste de ses traitements actuels.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-y-4">
            <Link to="/booking">
              <Button variant="outline" className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white mr-4">
                Prendre un autre RDV
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
