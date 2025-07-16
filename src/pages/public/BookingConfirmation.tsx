
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Mail, Phone, Heart, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { AnalysisDisplay } from "@/components/booking/AnalysisDisplay";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { submitBooking, isSubmitting } = useBookingSubmission();
  const { bookingData, resetBookingData } = useBookingFormData();
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  console.log('BookingConfirmation - bookingData:', bookingData);

  useEffect(() => {
    // Vérifier si on a les données minimales requises
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

  // Redirection seulement si vraiment aucune donnée ET pas en cours de soumission ET pas de résultat
  useEffect(() => {
    if (!bookingData.animalSpecies && !isSubmitting && !submissionResult && !hasSubmitted) {
      console.log('BookingConfirmation - Redirecting to booking start');
      navigate('/booking');
    }
  }, [bookingData, navigate, isSubmitting, submissionResult, hasSubmitted]);

  // Affichage pendant le chargement
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
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
        <div className="max-w-4xl mx-auto">
          {/* Confirmation */}
          <div className="text-center mb-8 animate-fade-in">
            <CheckCircle className="h-24 w-24 text-vet-sage mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-vet-navy mb-4">
              Rendez-vous confirmé !
            </h1>
            <p className="text-vet-brown text-xl">
              Votre demande de rendez-vous a été enregistrée et analysée avec succès
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Détails du rendez-vous */}
            <Card className="bg-white/90 backdrop-blur-sm border-vet-sage/30 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-vet-sage/10 to-vet-blue/10">
                <CardTitle className="text-vet-navy">Détails de votre rendez-vous</CardTitle>
                <CardDescription className="text-vet-brown">
                  Numéro de confirmation: <span className="font-mono">#{booking?.id?.slice(-8) || 'RDV-2024-001'}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-vet-sage mt-1" />
                    <div>
                      <p className="font-semibold text-vet-navy">Animal</p>
                      <p className="text-vet-brown">
                        {bookingData.animalName} ({bookingData.animalSpecies})
                      </p>
                      {bookingData.animalBreed && (
                        <p className="text-sm text-vet-brown/70">Race: {bookingData.animalBreed}</p>
                      )}
                    </div>
                  </div>
                  {bookingData.appointmentDate && bookingData.appointmentTime && (
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-vet-sage mt-1" />
                      <div>
                        <p className="font-semibold text-vet-navy">Rendez-vous</p>
                        <p className="text-vet-brown">
                          Le {new Date(bookingData.appointmentDate).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} à {bookingData.appointmentTime}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-vet-sage mt-1" />
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

            {/* Instructions */}
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-vet-navy">Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-vet-brown">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-vet-sage mt-1" />
                    <div>
                      <p className="font-semibold text-vet-navy">Confirmation par email</p>
                      <p className="text-sm">Vous recevrez un email de confirmation avec tous les détails dans quelques minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-vet-sage mt-1" />
                    <div>
                      <p className="font-semibold text-vet-navy">Contact par notre équipe</p>
                      <p className="text-sm">Nous vous contacterons pour confirmer le créneau de rendez-vous.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-vet-sage mt-1" />
                    <div>
                      <p className="font-semibold text-vet-navy">Préparation</p>
                      <p className="text-sm">Pensez à apporter le carnet de santé de votre animal et la liste de ses traitements actuels.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyse IA */}
          {aiAnalysis && (
            <div className="mb-8">
              <AnalysisDisplay aiAnalysis={aiAnalysis} />
            </div>
          )}

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button variant="outline" className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                  Prendre un autre RDV
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
            <p className="text-sm text-vet-brown/70 mt-4">
              En cas d'urgence immédiate, contactez-nous directement au téléphone
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
