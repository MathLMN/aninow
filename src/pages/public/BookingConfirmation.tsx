
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Mail, Phone, Heart, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";
import { useBookingFormData } from "@/hooks/useBookingFormData";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { submitBooking, isSubmitting } = useBookingSubmission();
  const { bookingData, resetBookingData } = useBookingFormData();
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Vérifier si on a les données nécessaires
    if (!bookingData.animalSpecies || !bookingData.clientName || hasSubmitted) {
      return;
    }

    // Soumettre la réservation
    const submitData = async () => {
      setHasSubmitted(true);
      const result = await submitBooking(bookingData);
      setSubmissionResult(result);
      
      if (result.booking) {
        // Réinitialiser les données du formulaire après succès
        resetBookingData();
      }
    };

    submitData();
  }, [bookingData, submitBooking, hasSubmitted, resetBookingData]);

  // Rediriger si pas de données
  useEffect(() => {
    if (!bookingData.animalSpecies && !isSubmitting && !submissionResult) {
      navigate('/booking');
    }
  }, [bookingData, navigate, isSubmitting, submissionResult]);

  // Affichage pendant le chargement
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Loader2 className="h-16 w-16 text-vet-sage mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold text-vet-navy mb-4">
              Traitement de votre demande...
            </h1>
            <p className="text-vet-brown">
              Nous analysons votre demande avec notre IA pour vous offrir le meilleur service possible.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (submissionResult?.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-vet-navy mb-4">
              Erreur lors de la réservation
            </h1>
            <p className="text-vet-brown mb-6">
              {submissionResult.error}
            </p>
            <Link to="/booking">
              <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                Réessayer
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Affichage de confirmation
  const booking = submissionResult?.booking;
  const aiAnalysis = submissionResult?.aiAnalysis;

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      <Header />

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
                Numéro de confirmation: #{booking?.id?.slice(-8) || 'RDV-2024-001'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-vet-sage" />
                  <div>
                    <p className="font-semibold text-vet-navy">Animal</p>
                    <p className="text-vet-brown">
                      {bookingData.animalName} ({bookingData.animalSpecies})
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-vet-sage" />
                  <div>
                    <p className="font-semibold text-vet-navy">Statut</p>
                    <p className="text-vet-brown">En attente de confirmation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-vet-sage" />
                  <div>
                    <p className="font-semibold text-vet-navy">Motif</p>
                    <p className="text-vet-brown">
                      {bookingData.consultationReason === 'consultation-convenance' ? 'Consultation de convenance' :
                       bookingData.consultationReason === 'symptomes-anomalie' ? 'Symptômes/Anomalie' :
                       bookingData.consultationReason === 'urgence' ? 'Urgence' : 'Consultation'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analyse IA si disponible */}
          {aiAnalysis && (
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="text-vet-navy">Analyse automatique</CardTitle>
                <CardDescription className="text-vet-brown">
                  Score d'urgence: {aiAnalysis.urgency_score}/10
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-vet-brown">
                    {aiAnalysis.analysis_summary}
                  </p>
                  {aiAnalysis.recommended_actions && aiAnalysis.recommended_actions.length > 0 && (
                    <div>
                      <p className="font-semibold text-vet-navy mb-2">Actions recommandées:</p>
                      <ul className="list-disc list-inside text-vet-brown space-y-1">
                        {aiAnalysis.recommended_actions.map((action: string, index: number) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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
                    <p className="font-semibold text-vet-navy">Contact par téléphone</p>
                    <p>Notre équipe vous contactera pour fixer un créneau de rendez-vous adapté.</p>
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
