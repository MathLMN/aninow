import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, Calendar, AlertTriangle, Clock, Phone, Mail, Globe } from "lucide-react";
import { useVetBookings } from "@/hooks/useVetBookings";

const VetAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { bookings, isLoading, updateBookingStatus } = useVetBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-vet-sage/20 text-vet-sage border-vet-sage/30";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      case "completed":
        return "Terminé";
      default:
        return status;
    }
  };

  // Filtrer pour n'afficher que les réservations en ligne (exclure manuels et blocages)
  const onlineBookings = bookings.filter(
    (booking) => booking.booking_source === "online" && booking?.is_blocked !== true
  );

  // Appliquer la recherche uniquement sur les réservations en ligne
  const filteredBookings = onlineBookings
    .filter((booking) =>
      booking.animal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client_phone.includes(searchTerm)
    )
    // Trier par date de création décroissante (les plus récentes en premier)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleStatusChange = (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    updateBookingStatus({ id: bookingId, status: newStatus });
  };

  // Type guard to check if ai_analysis has the expected structure
  const isValidAiAnalysis = (analysis: any): analysis is { analysis_summary: string } => {
    return analysis && typeof analysis === 'object' && typeof analysis.analysis_summary === 'string';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-sage mx-auto"></div>
          <p className="text-vet-brown mt-4">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Réservations en ligne</h1>
          <p className="text-vet-brown flex items-center mt-2">
            <Globe className="h-4 w-4 mr-2" />
            Rendez-vous pris en ligne par les clients
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-vet-brown">
            Total: {onlineBookings.length} réservations en ligne
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
              <Input
                placeholder="Rechercher par nom d'animal, propriétaire ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
              />
            </div>
            <Button variant="outline" className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des réservations */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="flex items-center text-vet-navy">
            <Users className="h-5 w-5 mr-2 text-vet-sage" />
            Réservations en ligne
          </CardTitle>
          <CardDescription className="text-vet-brown">
            {filteredBookings.length} réservation(s) en ligne trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border border-vet-blue/20 rounded-lg bg-white hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header avec urgence et statut */}
                <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-vet-beige/30 to-transparent border-b border-vet-blue/10">
                  <div className="flex items-center gap-3">
                    {/* Badge d'urgence */}
                    <div className={`rounded-md px-3 py-1.5 text-xs font-bold min-w-[55px] text-center flex flex-col items-center shadow-sm ${
                      booking.urgency_score && booking.urgency_score >= 8 
                        ? 'bg-red-500 text-white' 
                        : booking.urgency_score && booking.urgency_score >= 6
                        ? 'bg-orange-500 text-white'
                        : booking.urgency_score && booking.urgency_score >= 4
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      <span className="text-lg font-bold">{booking.urgency_score || 'N/A'}</span>
                      <span className="text-[9px] opacity-90">URGENCE</span>
                    </div>
                    
                    {/* Date de réservation */}
                    <div className="text-xs text-vet-brown/70 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Réservé le {new Date(booking.created_at).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    
                    {booking.urgency_score && booking.urgency_score >= 8 && (
                      <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  
                  {/* Statut */}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status || 'pending')}`}>
                    {getStatusText(booking.status || 'pending')}
                  </span>
                </div>

                {/* Contenu principal */}
                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Colonne 1: Animal & Propriétaire */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-vet-brown/60 uppercase tracking-wide">Animal</p>
                        <h3 className="font-bold text-vet-navy text-lg">{booking.animal_name}</h3>
                        <p className="text-sm text-vet-brown capitalize">{booking.animal_species}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-vet-blue/10">
                        <p className="text-xs font-medium text-vet-brown/60 uppercase tracking-wide">Propriétaire</p>
                        <p className="font-semibold text-vet-navy">{booking.client_name}</p>
                        <div className="flex flex-col gap-0.5 mt-1 text-xs text-vet-brown">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {booking.client_phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {booking.client_email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Colonne 2: Analyse & Symptômes */}
                    <div className="lg:col-span-2 space-y-3">
                      {/* Résumé de l'analyse IA */}
                      {booking.ai_analysis && isValidAiAnalysis(booking.ai_analysis) ? (
                        <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <div className="text-lg">🤖</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-blue-900 mb-1">Analyse IA</h4>
                              <p className="text-sm text-blue-800 leading-relaxed">
                                {booking.ai_analysis.analysis_summary}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-vet-beige/30 rounded-lg p-3">
                          <p className="text-sm text-vet-brown">
                            <span className="font-medium">Motif:</span> {
                              booking.consultation_reason === 'consultation-convenance' ? 'Consultation de convenance' :
                              booking.consultation_reason === 'symptomes-anomalie' ? 'Symptômes ou anomalie' :
                              booking.consultation_reason === 'urgence' ? 'Urgence' : 'Consultation'
                            }
                          </p>
                        </div>
                      )}

                      {/* Symptômes et actions recommandées */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {booking.selected_symptoms && booking.selected_symptoms.length > 0 && (
                          <div className="flex-1 bg-amber-50/50 border border-amber-200/50 rounded-lg p-2.5">
                            <p className="text-xs font-bold text-amber-900 mb-1">Symptômes signalés</p>
                            <div className="flex flex-wrap gap-1">
                              {booking.selected_symptoms.map((symptom, idx) => (
                                <span key={idx} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {booking.recommended_actions && booking.recommended_actions.length > 0 && (
                          <div className="flex-1 bg-green-50/50 border border-green-200/50 rounded-lg p-2.5">
                            <p className="text-xs font-bold text-green-900 mb-1">Actions recommandées</p>
                            <ul className="text-xs text-green-800 space-y-0.5">
                              {booking.recommended_actions.slice(0, 2).map((action, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-green-600">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer avec actions */}
                <div className="px-4 py-3 bg-vet-beige/10 border-t border-vet-blue/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-vet-brown/60" />
                    <span className="text-sm text-vet-brown">
                      {booking.appointment_date ? (
                        <>RDV prévu le {new Date(booking.appointment_date).toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: 'long'
                        })} à {booking.appointment_time}</>
                      ) : (
                        'Date à définir'
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-vet-navy/30 text-vet-navy hover:bg-vet-navy hover:text-white"
                    >
                      Détails
                    </Button>
                    
                    {booking.status === "pending" && (
                      <Button 
                        size="sm" 
                        className="bg-vet-sage hover:bg-vet-sage/90 text-white"
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      >
                        ✓ Confirmer
                      </Button>
                    )}
                    
                    {booking.status === "confirmed" && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                      >
                        ✓ Terminé
                      </Button>
                    )}
                    
                    {booking.status !== "cancelled" && booking.status !== "completed" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      >
                        ✕ Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-vet-blue mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-vet-navy mb-2">Aucune réservation en ligne trouvée</h3>
              <p className="text-vet-brown">
                {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Aucune réservation en ligne enregistrée pour le moment'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VetAppointments;
