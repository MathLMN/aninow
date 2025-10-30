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
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-4 border border-vet-blue/20 rounded-lg bg-vet-beige/10 hover:bg-vet-beige/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-lg px-3 py-2 text-sm font-semibold min-w-[60px] text-center ${
                      booking.urgency_score && booking.urgency_score >= 7 
                        ? 'bg-red-500 text-white' 
                        : booking.urgency_score && booking.urgency_score >= 4
                        ? 'bg-orange-500 text-white'
                        : 'bg-vet-sage text-white'
                    }`}>
                      {booking.urgency_score ? `${booking.urgency_score}/10` : 'N/A'}
                      <br />
                      <span className="text-xs">urgence</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-vet-navy text-lg flex items-center">
                        {booking.animal_name}
                        {booking.urgency_score && booking.urgency_score >= 7 && (
                          <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                        )}
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          En ligne
                        </span>
                      </h3>
                      <p className="text-vet-brown font-medium">{booking.client_name}</p>
                      <div className="flex items-center space-x-4 text-sm text-vet-brown">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.client_phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {booking.client_email}
                        </div>
                      </div>
                      <p className="text-xs text-vet-brown">
                        Espèce: {booking.animal_species}
                      </p>
                      {booking.ai_analysis && isValidAiAnalysis(booking.ai_analysis) ? (
                        <p className="text-sm text-vet-navy font-medium mt-1">
                          📋 {booking.ai_analysis.analysis_summary}
                        </p>
                      ) : (
                        <p className="text-xs text-vet-brown mt-1">
                          Motif: {booking.consultation_reason === 'consultation-convenance' ? 'Convenance' :
                                  booking.consultation_reason === 'symptomes-anomalie' ? 'Symptômes' :
                                  booking.consultation_reason === 'urgence' ? 'Urgence' : 'Consultation'}
                        </p>
                      )}
                      {booking.selected_symptoms && booking.selected_symptoms.length > 0 && (
                        <p className="text-xs text-vet-brown mt-1">
                          Symptômes: {booking.selected_symptoms.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-vet-brown">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(booking.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full border ${getStatusColor(booking.status || 'pending')}`}>
                        {getStatusText(booking.status || 'pending')}
                      </span>
                    </div>
                    
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" className="border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
                        Voir détails
                      </Button>
                      {booking.status === "pending" && (
                        <Button 
                          size="sm" 
                          className="bg-vet-sage hover:bg-vet-sage/90 text-white"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          Confirmer
                        </Button>
                      )}
                      {booking.status === "confirmed" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                        >
                          Marquer terminé
                        </Button>
                      )}
                      {booking.status !== "cancelled" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Analyse IA si disponible */}
                {booking.ai_analysis && isValidAiAnalysis(booking.ai_analysis) && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">🤖 Analyse IA</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      {booking.ai_analysis.analysis_summary}
                    </p>
                    {booking.recommended_actions && booking.recommended_actions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-blue-900">Actions recommandées:</p>
                        <ul className="text-xs text-blue-800 list-disc list-inside mt-1">
                          {booking.recommended_actions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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
