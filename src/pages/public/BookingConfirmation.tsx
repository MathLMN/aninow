import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hourglass, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { AnalysisDisplay } from "@/components/booking/AnalysisDisplay";
import { UrgencyAlert } from "@/components/booking/UrgencyAlert";
import { BookingSummaryCard } from "@/components/booking/BookingSummaryCard";
import { ValidationProcessTimeline } from "@/components/booking/ValidationProcessTimeline";
import { usePublicClinicSettings } from "@/hooks/usePublicClinicSettings";
import { supabase } from "@/integrations/supabase/client";
import { useClinicContext } from "@/contexts/ClinicContext";
const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { currentClinic } = useClinicContext();
  const {
    submitBooking,
    isSubmitting
  } = useBookingSubmission();
  const {
    bookingData,
    resetBookingData
  } = useBookingFormData();
  const {
    settings,
    isLoading: isLoadingSettings
  } = usePublicClinicSettings();
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [veterinarianName, setVeterinarianName] = useState<string | null>(
    bookingData.veterinarianName || null
  );
  const [showAdvice, setShowAdvice] = useState(false);
  console.log('BookingConfirmation - bookingData:', bookingData);

  // Récupérer depuis localStorage si pas de submissionResult
  useEffect(() => {
    if (!submissionResult && !isSubmitting) {
      const savedConfirmation = localStorage.getItem('lastBookingConfirmation');
      if (savedConfirmation) {
        try {
          const {
            booking,
            aiAnalysis,
            timestamp
          } = JSON.parse(savedConfirmation);
          // Vérifier que la confirmation date de moins de 24h
          const confirmationAge = Date.now() - new Date(timestamp).getTime();
          if (confirmationAge < 24 * 60 * 60 * 1000) {
            setSubmissionResult({
              booking,
              aiAnalysis,
              error: null
            });
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
      if (bookingData.animalSpecies && bookingData.clientName && bookingData.clientEmail && bookingData.clientPhone && bookingData.consultationReason && bookingData.preferredContactMethod) {
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
      // Si on a déjà le nom du vétérinaire dans bookingData, l'utiliser
      if (bookingData.veterinarianName) {
        setVeterinarianName(bookingData.veterinarianName);
        return;
      }
      
      // Sinon, récupérer depuis la base de données si un vétérinaire est assigné
      const booking = submissionResult?.booking;
      if (booking?.veterinarian_id) {
        const { data } = await supabase
          .from('clinic_veterinarians')
          .select('name')
          .eq('id', booking.veterinarian_id)
          .maybeSingle();
        
        if (data) {
          setVeterinarianName(data.name);
        }
      }
    };
    fetchVeterinarian();
  }, [submissionResult, bookingData.veterinarianName]);

  // Affichage pendant le chargement
  if (isSubmitting) {
    return <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
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
      </div>;
  }

  // Affichage en cas d'erreur
  if (submissionResult?.error) {
    return <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
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
      </div>;
  }

  // Affichage de confirmation
  const booking = submissionResult?.booking;
  const aiAnalysis = submissionResult?.aiAnalysis;

  // Données fictives pour la démo (clinique de test)
  const demoSettings = {
    clinic_name: 'Clinique Vétérinaire Démo',
    clinic_phone: '01 23 45 67 89',
    clinic_address_street: '123 Avenue des Animaux',
    clinic_address_city: 'Paris',
    clinic_address_postal_code: '75001'
  };

  // Utiliser les vraies settings ou les données de démo
  const displaySettings = settings || demoSettings;

  // Construire l'adresse complète de la clinique
  const clinicAddress = [
    displaySettings.clinic_address_street, 
    displaySettings.clinic_address_postal_code, 
    displaySettings.clinic_address_city
  ].filter(Boolean).join(', ');
  return <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-2 sm:py-3 pb-3">
        <div className="max-w-3xl mx-auto">
          {/* Hero - En attente de validation */}
          <div className="text-center mb-2 mt-4 sm:mt-6 animate-fade-in">
            <Hourglass className="h-10 sm:h-12 w-10 sm:w-12 text-amber-500 mx-auto mb-1.5 animate-pulse" strokeWidth={1.5} />
            <h1 className="text-lg sm:text-xl font-bold text-vet-navy">Demande en cours de validation</h1>
          </div>

          {/* Bandeau explicatif - Validation humaine */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-md mb-1.5">
            <CardContent className="pt-1.5 pb-1.5">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold text-vet-navy mb-0.5">
                    Pourquoi une validation est nécessaire ?
                  </h3>
                  <p className="text-[10px] text-vet-brown leading-tight">
                    Notre équipe vétérinaire analyse chaque demande pour <strong>évaluer le degré d'urgence</strong> et vous proposer le créneau le plus adapté à l'état de santé de votre animal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prochaines étapes - Timeline */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-lg mb-1.5">
            <CardHeader className="pb-1 pt-1.5">
              <CardTitle className="text-xs text-vet-navy">Attendez notre confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 pb-1.5">
              <ValidationProcessTimeline />
              
              <p className="text-[10px] text-vet-brown leading-tight">
                Vous recevrez une confirmation définitive par email.
              </p>
            </CardContent>
          </Card>

          {/* Récapitulatif complet */}
          {bookingData.appointmentDate && bookingData.appointmentTime && (
            <BookingSummaryCard 
              appointmentDate={bookingData.appointmentDate}
              appointmentTime={bookingData.appointmentTime}
              clinicName={displaySettings.clinic_name}
              clinicAddress={clinicAddress}
              clinicPhone={displaySettings.clinic_phone}
              veterinarianName={veterinarianName || undefined}
              animalName={bookingData.animalName || ''}
              animalSpecies={bookingData.animalSpecies || ''}
            />
          )}

          {/* Bouton pour afficher les conseils */}
          <div className="text-center mb-1.5 mt-1.5">
            <Button
              onClick={() => setShowAdvice(!showAdvice)}
              variant="outline"
              size="sm"
              className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white transition-all text-[11px] py-1 px-3 h-auto"
            >
              {showAdvice ? "Masquer les conseils" : "Voir nos conseils"}
            </Button>
          </div>

          {/* Contenu additionnel (masqué par défaut) */}
          {showAdvice && (
            <div className="space-y-4 animate-fade-in">
              {/* Analyse IA - Résumé de la situation */}
              {aiAnalysis && <div className="mb-4">
                  <AnalysisDisplay aiAnalysis={aiAnalysis} bookingData={bookingData} />
                </div>}

              {/* Alerte d'urgence (si applicable) */}
              {aiAnalysis && <UrgencyAlert urgencyScore={aiAnalysis.urgency_score} priorityLevel={aiAnalysis.priority_level} clinicPhone={displaySettings.clinic_phone} />}
            </div>
          )}

          {/* Actions CTA */}
          <div className="text-center space-y-1.5 pb-3">
            <div className="flex flex-col sm:flex-row gap-1.5 justify-center">
              <Link to="/" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto bg-vet-sage hover:bg-vet-sage/90 text-white text-[11px] py-1.5 px-4 h-auto">
                  Retour à l'accueil
                </Button>
              </Link>
              <Link to="/booking" className="w-full sm:w-auto">
                <Button size="sm" variant="outline" className="w-full sm:w-auto border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white text-[11px] py-1.5 px-4 h-auto" onClick={() => {
                  localStorage.removeItem('lastBookingConfirmation');
                  resetBookingData();
                }}>
                  Prendre un autre RDV
                </Button>
              </Link>
            </div>
            {displaySettings.clinic_phone && <p className="text-[10px] text-vet-brown/70 mt-1">
                Besoin d'aide ? Appelez-nous au {displaySettings.clinic_phone}
              </p>}
          </div>
        </div>
      </main>
    </div>;
};
export default BookingConfirmation;