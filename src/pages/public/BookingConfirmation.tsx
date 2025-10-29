import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { AnalysisDisplay } from "@/components/booking/AnalysisDisplay";
import { UrgencyAlert } from "@/components/booking/UrgencyAlert";
import { BookingReferenceCard } from "@/components/booking/BookingReferenceCard";
import { ClinicDetailsCard } from "@/components/booking/ClinicDetailsCard";
import { ValidationProcessTimeline } from "@/components/booking/ValidationProcessTimeline";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { supabase } from "@/integrations/supabase/client";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { submitBooking, isSubmitting } = useBookingSubmission();
  const { bookingData } = useBookingFormData();
  const { settings } = useClinicSettings();
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [veterinarianName, setVeterinarianName] = useState<string | null>(null);

  console.log('BookingConfirmation - bookingData:', bookingData);

  // Récupérer depuis localStorage si pas de submissionResult
  useEffect(() => {
    if (!submissionResult && !isSubmitting) {
      const savedConfirmation = localStorage.getItem('lastBookingConfirmation');
      if (savedConfirmation) {
        try {
          const { booking, aiAnalysis, timestamp } = JSON.parse(savedConfirmation);
          // Vérifier que la confirmation date de moins de 24h
          const confirmationAge = Date.now() - new Date(timestamp).getTime();
          if (confirmationAge < 24 * 60 * 60 * 1000) {
            setSubmissionResult({ booking, aiAnalysis, error: null });
            setHasSubmitted(true);
          }
        } catch (error) {
          console.error('Error parsing saved confirmation:', error);
        }
      }
    }
  }, [submissionResult, isSubmitting]);

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
          // Sauvegarder la confirmation dans localStorage
          localStorage.setItem('lastBookingConfirmation', JSON.stringify({
            bookingId: result.booking.id,
            booking: result.booking,
            aiAnalysis: result.aiAnalysis,
            timestamp: new Date().toISOString()
          }));
        }
      }
    };

    submitData();
  }, [bookingData, submitBooking, hasSubmitted]);

  // Récupérer le nom du vétérinaire si assigné
  useEffect(() => {
    const fetchVeterinarian = async () => {
      const booking = submissionResult?.booking;
      if (booking?.veterinarian_id) {
        const { data } = await supabase
          .from('clinic_veterinarians')
          .select('name')
          .eq('id', booking.veterinarian_id)
          .single();
        
        if (data) {
          setVeterinarianName(data.name);
        }
      }
    };
    fetchVeterinarian();
  }, [submissionResult]);

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

  // Construire l'adresse complète de la clinique
  const clinicAddress = settings ? [
    settings.clinic_address_street,
    settings.clinic_address_postal_code,
    settings.clinic_address_city
  ].filter(Boolean).join(', ') : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero - Confirmation visuelle */}
          <div className="text-center mb-6 animate-fade-in">
            <CheckCircle className="h-16 sm:h-20 w-16 sm:w-20 text-vet-sage mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-vet-navy mb-2">
              C'est confirmé ! ✓
            </h1>
            <p className="text-vet-brown text-sm sm:text-base">
              On s'occupe de tout. Vous recevrez un email de confirmation dans quelques minutes.
            </p>
          </div>

          {/* Numéro de référence */}
          {booking?.id && bookingData.appointmentDate && bookingData.appointmentTime && (
            <BookingReferenceCard
              bookingId={booking.id}
              appointmentDate={bookingData.appointmentDate}
              appointmentTime={bookingData.appointmentTime}
            />
          )}

          {/* Détails du RDV (clinique, vétérinaire, animal) */}
          {settings && (
            <ClinicDetailsCard
              clinicName={settings.clinic_name}
              clinicAddress={clinicAddress}
              clinicPhone={settings.clinic_phone}
              veterinarianName={veterinarianName || undefined}
              animalName={bookingData.animalName || ''}
              animalSpecies={bookingData.animalSpecies || ''}
            />
          )}

          {/* Analyse IA - Résumé de la situation */}
          {aiAnalysis && (
            <div className="mb-6">
              <AnalysisDisplay aiAnalysis={aiAnalysis} />
            </div>
          )}

          {/* Alerte d'urgence (si applicable) */}
          {aiAnalysis && (
            <UrgencyAlert 
              urgencyScore={aiAnalysis.urgency_score}
              priorityLevel={aiAnalysis.priority_level}
              clinicPhone={settings?.clinic_phone}
            />
          )}

          {/* Prochaines étapes - Timeline */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-lg mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-vet-navy">Comment ça se passe maintenant ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ValidationProcessTimeline />
              
              <p className="text-sm text-vet-brown leading-relaxed">
                Notre équipe vétérinaire valide votre demande en fonction de l'urgence de la situation 
                et de nos disponibilités. Vous recevrez une confirmation définitive par email dans les 
                plus brefs délais.
              </p>

              <div className="bg-vet-beige/20 p-4 rounded-lg">
                <p className="font-semibold text-vet-navy text-sm mb-2">Pensez à apporter :</p>
                <ul className="text-sm text-vet-brown space-y-1">
                  <li>• Carnet de santé de {bookingData.animalName || 'votre animal'}</li>
                  <li>• Liste des traitements en cours</li>
                  <li>• Résultats d'examens récents (si applicable)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions CTA */}
          <div className="text-center space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-vet-sage hover:bg-vet-sage/90 text-white">
                  Retour à l'accueil
                </Button>
              </Link>
              <Link to="/booking" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
                  onClick={() => localStorage.removeItem('lastBookingConfirmation')}
                >
                  Prendre un autre RDV
                </Button>
              </Link>
            </div>
            {settings?.clinic_phone && (
              <p className="text-xs sm:text-sm text-vet-brown/70">
                Besoin d'aide ? Appelez-nous au {settings.clinic_phone}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
