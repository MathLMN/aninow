import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Calendar, AlertTriangle, Clock, Phone, Mail, Globe, ChevronLeft, ChevronRight, ArrowUpDown, Flame, Camera } from "lucide-react";
import { useVetBookings } from "@/hooks/useVetBookings";
import { format, addDays, subDays, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { PhotoGallery, PhotoGalleryRef } from "@/components/planning/appointment-details/PhotoGallery";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const VetAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'date'>('urgency');
  const [bookingToConfirm, setBookingToConfirm] = useState<string | null>(null);
  const { bookings, isLoading, updateBookingStatus } = useVetBookings();
  const photoGalleryRefs = useRef<{ [key: string]: PhotoGalleryRef | null }>({});

  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

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

  // Filtrer par date de création sans filtre d'urgence pour calculer les compteurs
  const bookingsForSelectedDateNoUrgencyFilter = onlineBookings.filter((booking) => {
    if (!booking.created_at) return false;
    
    try {
      const createdDate = new Date(booking.created_at);
      const matchesDate = isSameDay(createdDate, selectedDate);
      const matchesSearch = 
        booking.animal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_phone.includes(searchTerm);
      
      return matchesDate && matchesSearch;
    } catch (error) {
      return false;
    }
  });

  // Calculer les compteurs par niveau d'urgence (uniquement les demandes à confirmer)
  const pendingBookingsForCount = bookingsForSelectedDateNoUrgencyFilter.filter(b => b.status === 'pending');
  const criticalCount = pendingBookingsForCount.filter(b => (b.urgency_score || 0) >= 8).length;
  const highCount = pendingBookingsForCount.filter(b => {
    const score = b.urgency_score || 0;
    return score >= 6 && score < 8;
  }).length;
  const mediumCount = pendingBookingsForCount.filter(b => {
    const score = b.urgency_score || 0;
    return score >= 4 && score < 6;
  }).length;
  const lowCount = pendingBookingsForCount.filter(b => (b.urgency_score || 0) < 4).length;

  // Filtrer par date de création (created_at), recherche et urgence
  const bookingsForSelectedDate = onlineBookings.filter((booking) => {
    if (!booking.created_at) return false;
    
    try {
      const createdDate = new Date(booking.created_at);
      const matchesDate = isSameDay(createdDate, selectedDate);
      const matchesSearch = 
        booking.animal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_phone.includes(searchTerm);
      
      // Filtrer par niveau d'urgence
      let matchesUrgency = true;
      const urgencyScore = booking.urgency_score || 0;
      
      if (urgencyFilter === 'critical') {
        matchesUrgency = urgencyScore >= 8;
      } else if (urgencyFilter === 'high') {
        matchesUrgency = urgencyScore >= 6 && urgencyScore < 8;
      } else if (urgencyFilter === 'medium') {
        matchesUrgency = urgencyScore >= 4 && urgencyScore < 6;
      } else if (urgencyFilter === 'low') {
        matchesUrgency = urgencyScore < 4;
      }
      
      return matchesDate && matchesSearch && matchesUrgency;
    } catch (error) {
      return false;
    }
  });

  // Fonction de tri
  const sortBookings = (bookingsList: typeof bookingsForSelectedDate) => {
    return [...bookingsList].sort((a, b) => {
      if (sortBy === 'urgency') {
        // Tri par urgence décroissante (plus urgent en premier)
        const urgencyA = a.urgency_score || 0;
        const urgencyB = b.urgency_score || 0;
        if (urgencyB !== urgencyA) {
          return urgencyB - urgencyA;
        }
        // Si même urgence, trier par date (plus ancien en premier)
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        // Tri par date de création (plus ancien en premier)
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });
  };

  // Séparer les réservations à confirmer et confirmées avec tri
  const pendingBookings = sortBookings(
    bookingsForSelectedDate.filter((booking) => booking.status === 'pending')
  );

  const confirmedBookings = sortBookings(
    bookingsForSelectedDate.filter((booking) => booking.status === 'confirmed')
  );

  const handleStatusChange = (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (newStatus === 'confirmed') {
      setBookingToConfirm(bookingId);
    } else {
      updateBookingStatus({ id: bookingId, status: newStatus });
    }
  };

  const handleConfirmConfirmation = () => {
    if (bookingToConfirm) {
      updateBookingStatus({ id: bookingToConfirm, status: 'confirmed' });
      setBookingToConfirm(null);
    }
  };

  const handleCancelConfirmation = () => {
    setBookingToConfirm(null);
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

  const renderBookingsList = (bookingsList: typeof bookingsForSelectedDate, emptyMessage: string) => {
    return (
      <div className="space-y-3">
        {bookingsList.map((booking) => {
          // Détecter les photos dans conditional_answers pour ce booking
          const photoKeys = booking.conditional_answers ? Object.keys(booking.conditional_answers).filter((key) => 
            key.startsWith('photo_') && booking.conditional_answers[key] && typeof booking.conditional_answers[key] === 'string'
          ) : [];
          const hasPhotos = photoKeys.length > 0;

          return (
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
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      booking.client_status === 'new' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      <Users className="h-3 w-3" />
                      {booking.client_status === 'new' ? 'Nouveau client' : 'Déjà client'}
                    </span>
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

                {/* Symptômes et commentaire */}
                <div className="flex flex-col gap-2">
                  {booking.selected_symptoms && booking.selected_symptoms.length > 0 && (
                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-2">
                      <p className="text-xs font-bold text-amber-900 mb-1">Symptômes signalés</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.selected_symptoms.map((symptom, idx) => (
                          <span key={idx} className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bouton pour voir les photos jointes */}
                  {hasPhotos && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => photoGalleryRefs.current[booking.id]?.openFirstPhoto()}
                      className="relative bg-vet-sage/10 border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white transition-colors"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Voir les photos jointes
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-vet-sage text-white px-2 py-0.5 rounded-full animate-pulse"
                      >
                        {photoKeys.length}
                      </Badge>
                    </Button>
                  )}

                  {booking.client_comment && (
                    <div className="bg-slate-50/50 border border-slate-200/50 rounded-lg p-2">
                      <p className="text-xs font-bold text-slate-900 mb-1">Commentaire client</p>
                      <p className="text-xs text-slate-700 italic">"{booking.client_comment}"</p>
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
              {booking.status === "pending" && (
                <Button 
                  size="sm" 
                  className="bg-vet-sage hover:bg-vet-sage/90 text-white"
                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                >
                  ✓ Confirmer
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
          
          {/* Galerie de photos - invisible jusqu'au clic */}
          {booking.conditional_answers && (
            <PhotoGallery 
              ref={(ref) => {
                if (ref) photoGalleryRefs.current[booking.id] = ref;
              }} 
              conditionalAnswers={booking.conditional_answers} 
            />
          )}
        </div>
          );
        })}

        {bookingsList.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-16 w-16 text-vet-blue mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-vet-navy mb-2">{emptyMessage}</h3>
          <p className="text-vet-brown">
            {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Aucune réservation pour cette date'}
          </p>
        </div>
        )}
      </div>
    );
  };

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
      </div>

      {/* Navigation par jour */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousDay}
              className="border-vet-navy/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col items-center gap-1">
              <div className="text-xl font-bold text-vet-navy">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="text-xs text-vet-sage hover:text-vet-sage/80"
              >
                Aujourd'hui
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextDay}
              className="border-vet-navy/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Barre de recherche et filtres */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4 space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
            <Input
              placeholder="Rechercher par nom d'animal, propriétaire ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
            />
          </div>

          {/* Filtres par urgence et tri */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filtres d'urgence */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-vet-brown flex items-center gap-1">
                <Flame className="h-4 w-4" />
                Niveau d'urgence:
              </span>
              <Button
                size="sm"
                variant={urgencyFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setUrgencyFilter('all')}
                className={urgencyFilter === 'all' ? 'bg-vet-sage hover:bg-vet-sage/90' : ''}
              >
                Tous
                {pendingBookingsForCount.length > 0 && (
                  <Badge className="ml-2 bg-vet-navy hover:bg-vet-navy text-white px-1.5 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {pendingBookingsForCount.length}
                  </Badge>
                )}
              </Button>
              <Button
                size="sm"
                variant={urgencyFilter === 'critical' ? 'default' : 'outline'}
                onClick={() => setUrgencyFilter('critical')}
                className={`relative ${urgencyFilter === 'critical' ? 'bg-red-500 hover:bg-red-600' : 'border-red-300 text-red-600 hover:bg-red-50'}`}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Critique (≥8)
                {criticalCount > 0 && (
                  <Badge className="ml-2 bg-red-700 hover:bg-red-700 text-white px-1.5 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center animate-pulse">
                    {criticalCount}
                  </Badge>
                )}
              </Button>
              <Button
                size="sm"
                variant={urgencyFilter === 'high' ? 'default' : 'outline'}
                onClick={() => setUrgencyFilter('high')}
                className={urgencyFilter === 'high' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-300 text-orange-600 hover:bg-orange-50'}
              >
                Élevée (6-7)
                {highCount > 0 && (
                  <Badge className="ml-2 bg-orange-700 hover:bg-orange-700 text-white px-1.5 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {highCount}
                  </Badge>
                )}
              </Button>
              <Button
                size="sm"
                variant={urgencyFilter === 'medium' ? 'default' : 'outline'}
                onClick={() => setUrgencyFilter('medium')}
                className={urgencyFilter === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : 'border-yellow-300 text-yellow-600 hover:bg-yellow-50'}
              >
                Moyenne (4-5)
                {mediumCount > 0 && (
                  <Badge className="ml-2 bg-yellow-700 hover:bg-yellow-700 text-white px-1.5 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {mediumCount}
                  </Badge>
                )}
              </Button>
              <Button
                size="sm"
                variant={urgencyFilter === 'low' ? 'default' : 'outline'}
                onClick={() => setUrgencyFilter('low')}
                className={urgencyFilter === 'low' ? 'bg-green-500 hover:bg-green-600' : 'border-green-300 text-green-600 hover:bg-green-50'}
              >
                Faible (&lt;4)
                {lowCount > 0 && (
                  <Badge className="ml-2 bg-green-700 hover:bg-green-700 text-white px-1.5 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {lowCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Sélecteur de tri */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-vet-brown flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Trier par:
              </span>
              <Button
                size="sm"
                variant={sortBy === 'urgency' ? 'default' : 'outline'}
                onClick={() => setSortBy('urgency')}
                className={sortBy === 'urgency' ? 'bg-vet-sage hover:bg-vet-sage/90' : ''}
              >
                Urgence
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'date' ? 'default' : 'outline'}
                onClick={() => setSortBy('date')}
                className={sortBy === 'date' ? 'bg-vet-sage hover:bg-vet-sage/90' : ''}
              >
                Date
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets des réservations */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-0">
          <Tabs defaultValue="pending" className="w-full">
            <div className="border-b border-vet-blue/20 px-6">
              <TabsList className="bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="pending" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-vet-sage rounded-none px-6 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>À confirmer</span>
                    {pendingBookings.length > 0 && (
                      <span className="ml-2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {pendingBookings.length}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="confirmed" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-vet-sage rounded-none px-6 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Confirmés</span>
                    {confirmedBookings.length > 0 && (
                      <span className="ml-2 bg-vet-sage text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {confirmedBookings.length}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="p-6 m-0">
              {renderBookingsList(pendingBookings, "Aucune réservation à confirmer pour cette date")}
            </TabsContent>

            <TabsContent value="confirmed" className="p-6 m-0">
              {renderBookingsList(confirmedBookings, "Aucune réservation confirmée pour cette date")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={bookingToConfirm !== null} onOpenChange={(open) => !open && setBookingToConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le rendez-vous</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmez-vous ce rendez-vous en ligne ? Un email de confirmation sera automatiquement envoyé au client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelConfirmation}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmConfirmation}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Valider la confirmation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VetAppointments;
