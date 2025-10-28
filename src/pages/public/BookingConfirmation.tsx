import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Heart, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { AnalysisDisplay } from "@/components/booking/AnalysisDisplay";
import { UrgencyAlert } from "@/components/booking/UrgencyAlert";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { submitBooking, isSubmitting } = useBookingSubmission();
  const { bookingData, resetBookingData } = useBookingFormData();
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  console.log('BookingConfirmation - bookingData:', bookingData);

  useEffect(() => {
    // Vérifier si on a les données minimales requises pour la soumission
    if (!bookingData.animalSpecies || !bookingData.clientName || hasSubmitted) {
      console.log('BookingConfirmation - Missing data or already submitted:', {
        animalSpecies: bookingData.animalSpecies,
        clientName: bookingData.clientName,
        hasSubmitted
      });
      return;
    }

    const submitData = async () => {
      console.log('BookingConfirmation - Starting submission...');
      setHasSubmitted(true);
      
      if (bookingData.animalSpecies && bookingData.clientName && bookingData.clientEmail && 
          bookingData.clientPhone && bookingData.consultationReason && bookingData.preferredContactMethod) {
        
        const completeBookingData = {
          ...bookingData,
          animalSpecies: bookingData.animalSpecies,
          clientName: bookingData.clientName,
          clientEmail: bookingData.clientEmail,
          clientPhone: bookingData.clientPhone,
          consultationReason: bookingData.consultationReason,
          preferredContactMethod: bookingData.preferredContactMethod
        };

        console.log('BookingConfirmation - Submitting data:', completeBookingData);
        const result = await submitBooking(completeBookingData);
        console.log('BookingConfirmation - Submission result:', result);
        setSubmissionResult(result);
        
        if (result.booking) {
          resetBookingData();
        }
      }
    };

    submitData();
  }, [bookingData, submitBooking, hasSubmitted, resetBookingData]);

  // Redirection seulement si vraiment aucune donnée ET tentative de soumission échouée
  useEffect(() => {
    // Délai pour permettre au localStorage de se charger
    const timeoutId = setTimeout(() => {
      if (!bookingData.animalSpecies && !bookingData.animalName && !isSubmitting && !submissionResult && !hasSubmitted) {
        console.log('BookingConfirmation - Redirecting to booking start after timeout');
        navigate('/booking');
      }
    }, 1000); // Attendre 1 seconde

    return () => clearTimeout(timeoutId);
  }, [bookingData, navigate, isSubmitting, submissionResult, hasSubmitted]);

  // Affichage pendant le chargement
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative mb-8">
              <Loader2 className="h-20 w-20 text-vet-sage mx-auto mb-6 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-vet-navy mb-4">
              Analyse en cours...
            </h1>
            <p className="text-vet-brown mb-4 text-lg">
              Notre système d'intelligence artificielle analyse votre demande pour vous offrir le meilleur service possible.
            </p>
            <div className="bg-white/80 p-6 rounded-lg shadow-lg max-w-md mx-auto">
              <p className="text-sm text-vet-brown/70 mb-2">
                Cette analyse nous permet de :
              </p>
              <ul className="text-sm text-vet-brown/70 space-y-1 text-left">
                <li>• Évaluer l'urgence de la situation</li>
                <li>• Prioriser votre rendez-vous</li>
                <li>• Préparer la consultation</li>
                <li>• Vous donner des conseils personnalisés</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (submissionResult?.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
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
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Confirmation */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <CheckCircle className="h-16 sm:h-24 w-16 sm:w-24 text-vet-sage mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold text-vet-navy mb-3 sm:mb-4">
              Rendez-vous confirmé !
            </h1>
            <p className="text-vet-brown text-base sm:text-xl">
              Votre demande de rendez-vous a été enregistrée avec succès
            </p>
          </div>

          {/* Alerte d'urgence */}
          {aiAnalysis && (
            <UrgencyAlert 
              urgencyScore={aiAnalysis.urgency_score}
              priorityLevel={aiAnalysis.priority_level}
            />
          )}

          {/* Analyse IA - Remontée en priorité */}
          {aiAnalysis && (
            <div className="mb-4 sm:mb-6">
              <AnalysisDisplay aiAnalysis={aiAnalysis} />
            </div>
          )}

          {/* Détails du rendez-vous - Simplifié */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-sage/30 shadow-lg mb-4 sm:mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-vet-navy">Votre rendez-vous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-vet-sage mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-vet-navy text-sm">Animal</p>
                  <p className="text-vet-brown text-sm">
                    {bookingData.animalName} • {bookingData.animalSpecies}
                  </p>
                </div>
              </div>
              {bookingData.appointmentDate && bookingData.appointmentTime && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-vet-sage mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-vet-navy text-sm">Date et heure</p>
                    <p className="text-vet-brown text-sm">
                      {new Date(bookingData.appointmentDate).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })} à {bookingData.appointmentTime}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prochaines étapes - Condensé */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-lg mb-6 sm:mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-vet-navy">Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <p className="text-vet-brown text-sm mb-3 leading-relaxed">
                Nous vous confirmons votre rendez-vous par email et nous vous contacterons pour finaliser les détails.
              </p>
              <div className="bg-vet-beige/20 p-3 rounded-lg">
                <p className="font-semibold text-vet-navy text-sm mb-2">Pensez à apporter :</p>
                <ul className="text-sm text-vet-brown space-y-1">
                  <li>• Le carnet de santé de votre animal</li>
                  <li>• La liste de ses traitements actuels</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/booking" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                  Prendre un autre RDV
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-vet-sage hover:bg-vet-sage/90 text-white">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-vet-brown/70">
              En cas d'urgence immédiate, contactez-nous directement
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
