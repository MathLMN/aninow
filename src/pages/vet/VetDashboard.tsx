import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Settings, Heart, Bell, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useVetBookings } from "@/hooks/useVetBookings";

const VetDashboard = () => {
  const { bookings, isLoading, stats } = useVetBookings();

  // Filtrer les rendez-vous d'aujourd'hui
  const todayBookings = bookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.appointment_date === today || booking.created_at.split('T')[0] === today;
  }).slice(0, 3); // Prendre les 3 premiers

  // Calculer le temps d'attente moyen (simulation)
  const avgWaitTime = Math.round(15 + Math.random() * 10);

  if (isLoading) {
    return (
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-sage mx-auto"></div>
          <p className="text-vet-brown mt-4">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-none space-y-4 sm:space-y-6">
        {/* En-tête - pleine largeur */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy">Dashboard</h1>
            <p className="text-vet-brown">Vue d'ensemble de votre activité</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white w-full sm:w-auto">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Link to="/vet/schedule" className="w-full sm:w-auto">
              <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Voir le planning
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques - grille responsive pleine largeur */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-vet-brown">RDV Aujourd'hui</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-vet-sage" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-vet-navy">{stats.todayBookings}</div>
              <p className="text-xs text-vet-brown">Rendez-vous programmés</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-vet-brown">Total réservations</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-vet-sage" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-vet-navy">{stats.total}</div>
              <p className="text-xs text-vet-brown">Toutes les réservations</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-vet-brown">En attente</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-vet-sage" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-vet-navy">{stats.pending}</div>
              <p className="text-xs text-vet-brown">À confirmer</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-vet-brown">Urgences</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-vet-sage" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-vet-navy">{stats.highUrgency}</div>
              <p className="text-xs text-vet-brown">Score ≥ 7/10</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal - grille responsive pleine largeur */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 w-full">
          {/* Prochains rendez-vous - pleine largeur sur mobile */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-vet-navy text-lg sm:text-xl">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-vet-sage" />
                Réservations récentes
              </CardTitle>
              <CardDescription className="text-vet-brown text-sm">
                Dernières demandes de rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                {todayBookings.length > 0 ? (
                  todayBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-vet-beige/30 rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                          booking.urgency_score && booking.urgency_score >= 7 
                            ? 'bg-red-500 text-white' 
                            : 'bg-vet-sage text-white'
                        }`}>
                          {booking.urgency_score || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-vet-navy truncate">{booking.animal_name}</p>
                          <p className="text-sm text-vet-brown truncate">{booking.client_name}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-vet-navy capitalize">{booking.status}</p>
                        <p className="text-xs text-vet-brown">
                          {booking.consultation_reason === 'consultation-convenance' ? 'Convenance' :
                           booking.consultation_reason === 'symptomes-anomalie' ? 'Symptômes' :
                           booking.consultation_reason === 'urgence' ? 'Urgence' : 'Consultation'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-vet-brown">
                    <p>Aucune réservation récente</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Link to="/vet/appointments" className="block">
                  <Button variant="outline" className="w-full border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                    Voir toutes les réservations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides - pleine largeur sur mobile */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-vet-navy text-lg sm:text-xl">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-vet-sage" />
                Actions rapides
              </CardTitle>
              <CardDescription className="text-vet-brown text-sm">
                Raccourcis vers les fonctions principales
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Link to="/vet/schedule">
                  <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm">Planning</span>
                  </Button>
                </Link>
                <Link to="/vet/appointments">
                  <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm">Réservations</span>
                  </Button>
                </Link>
                <Link to="/vet/settings">
                  <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center border-vet-brown text-vet-brown hover:bg-vet-brown hover:text-white">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm">Paramètres</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-16 sm:h-20 flex flex-col items-center justify-center border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Notifications</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VetDashboard;
