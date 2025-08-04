
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
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-sage mx-auto"></div>
          <p className="text-vet-brown mt-4">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Dashboard</h1>
          <p className="text-vet-brown">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Link to="/vet/schedule">
            <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Voir le planning
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-brown">RDV Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{stats.todayBookings}</div>
            <p className="text-xs text-vet-brown">Rendez-vous programmés</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-brown">Total réservations</CardTitle>
            <TrendingUp className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{stats.total}</div>
            <p className="text-xs text-vet-brown">Toutes les réservations</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-brown">En attente</CardTitle>
            <Users className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{stats.pending}</div>
            <p className="text-xs text-vet-brown">À confirmer</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-brown">Urgences</CardTitle>
            <AlertTriangle className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{stats.highUrgency}</div>
            <p className="text-xs text-vet-brown">Score ≥ 7/10</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prochains rendez-vous */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader>
            <CardTitle className="flex items-center text-vet-navy">
              <Clock className="h-5 w-5 mr-2 text-vet-sage" />
              Réservations récentes
            </CardTitle>
            <CardDescription className="text-vet-brown">
              Dernières demandes de rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayBookings.length > 0 ? (
                todayBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-vet-beige/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold ${
                        booking.urgency_score && booking.urgency_score >= 7 
                          ? 'bg-red-500 text-white' 
                          : 'bg-vet-sage text-white'
                      }`}>
                        {booking.urgency_score || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-vet-navy">{booking.animal_name}</p>
                        <p className="text-sm text-vet-brown">{booking.client_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
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
              <Link to="/vet/appointments">
                <Button variant="outline" className="w-full border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                  Voir toutes les réservations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader>
            <CardTitle className="flex items-center text-vet-navy">
              <Heart className="h-5 w-5 mr-2 text-vet-sage" />
              Actions rapides
            </CardTitle>
            <CardDescription className="text-vet-brown">
              Raccourcis vers les fonctions principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/vet/schedule">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white">
                  <Calendar className="h-6 w-6 mb-2" />
                  Planning
                </Button>
              </Link>
              <Link to="/vet/appointments">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
                  <Users className="h-6 w-6 mb-2" />
                  Réservations
                </Button>
              </Link>
              <Link to="/vet/settings">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-vet-brown text-vet-brown hover:bg-vet-brown hover:text-white">
                  <Settings className="h-6 w-6 mb-2" />
                  Paramètres
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                <Bell className="h-6 w-6 mb-2" />
                Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VetDashboard;
