
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle, Activity, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { useVetBookings } from "@/hooks/useVetBookings";
import { PendingBookingsNotification } from "@/components/planning/PendingBookingsNotification";

const VetDashboard = () => {
  const { bookings, isLoading, stats } = useVetBookings();

  // Filtrer les rendez-vous d'aujourd'hui
  const todayBookings = bookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.appointment_date === today || booking.created_at.split('T')[0] === today;
  }).slice(0, 5);

  // Calculer des statistiques avancées
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const noShowBookings = bookings.filter(b => b.status === 'no-show').length;
  
  // Répartition par type de consultation
  const convenienceBookings = bookings.filter(b => b.consultation_reason === 'consultation-convenance').length;
  const symptomsBookings = bookings.filter(b => b.consultation_reason === 'symptomes-anomalie').length;
  const emergencyBookings = bookings.filter(b => b.consultation_reason === 'urgence').length;
  
  // Taux de confirmation (bookings confirmés / total non-cancelled)
  const confirmationRate = stats.total > 0 
    ? Math.round((confirmedBookings / (stats.total - cancelledBookings)) * 100) 
    : 0;
  
  // Score d'urgence moyen
  const avgUrgencyScore = bookings.length > 0
    ? Math.round(bookings.reduce((sum, b) => sum + (b.urgency_score || 0), 0) / bookings.length)
    : 0;

  // Taux de présence et d'absentéisme
  const totalAttendable = confirmedBookings + noShowBookings + completedBookings;
  const presenceRate = totalAttendable > 0
    ? Math.round(((confirmedBookings + completedBookings) / totalAttendable) * 100)
    : 0;
  const absenteeismRate = totalAttendable > 0
    ? Math.round((noShowBookings / totalAttendable) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-sage mx-auto"></div>
          <p className="text-vet-brown mt-4">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vet-navy">Dashboard</h1>
          <p className="text-vet-brown">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex space-x-3">
          <PendingBookingsNotification />
          <Link to="/vet/schedule">
            <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Voir le planning
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            <CardTitle className="text-sm font-medium text-vet-brown">En attente</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{stats.pending}</div>
            <p className="text-xs text-vet-brown">À confirmer</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-brown">Absents</CardTitle>
            <UserX className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{noShowBookings}</div>
            <p className="text-xs text-vet-brown">Non présentés</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-brown">Urgences</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{stats.highUrgency}</div>
            <p className="text-xs text-vet-brown">Score ≥ 7/10</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vet-brown">Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-vet-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-vet-navy">{stats.total}</div>
            <p className="text-xs text-vet-brown">Toutes réservations</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="flex items-center text-vet-navy">
            <Activity className="h-5 w-5 mr-2 text-vet-sage" />
            Statistiques détaillées des rendez-vous
          </CardTitle>
          <CardDescription className="text-vet-brown">
            Analyse complète de l'activité de réservation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Statuts des rendez-vous */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-vet-navy uppercase tracking-wider">Statut des RDV</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-vet-brown">Confirmés</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{confirmedBookings}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-vet-brown">En attente</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-vet-brown">Terminés</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{completedBookings}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <UserX className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-vet-brown">Non présentés</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{noShowBookings}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-vet-brown">Annulés</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{cancelledBookings}</span>
                </div>
              </div>
            </div>

            {/* Types de consultation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-vet-navy uppercase tracking-wider">Types de consultation</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <span className="text-sm text-vet-brown">Convenance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-vet-sage h-2 rounded-full" 
                        style={{ width: `${stats.total > 0 ? (convenienceBookings / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-vet-navy w-8 text-right">{convenienceBookings}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <span className="text-sm text-vet-brown">Symptômes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${stats.total > 0 ? (symptomsBookings / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-vet-navy w-8 text-right">{symptomsBookings}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <span className="text-sm text-vet-brown">Urgences</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${stats.total > 0 ? (emergencyBookings / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-vet-navy w-8 text-right">{emergencyBookings}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicateurs clés */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-vet-navy uppercase tracking-wider">Indicateurs clés</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="text-xs text-green-700 font-medium">Taux de confirmation</div>
                  <div className="text-2xl font-bold text-green-800 mt-1">{confirmationRate}%</div>
                  <div className="text-xs text-green-600 mt-1">
                    {confirmedBookings} / {stats.total - cancelledBookings} RDV
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-700 font-medium">Urgence moyenne</div>
                  <div className="text-2xl font-bold text-blue-800 mt-1">{avgUrgencyScore}/10</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Score moyen sur {bookings.length} RDV
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="text-xs text-purple-700 font-medium">Urgences élevées</div>
                  <div className="text-2xl font-bold text-purple-800 mt-1">
                    {stats.total > 0 ? Math.round((stats.highUrgency / stats.total) * 100) : 0}%
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {stats.highUrgency} RDV avec score ≥ 7
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <div className="text-xs text-emerald-700 font-medium">Taux de présence</div>
                  <div className="text-2xl font-bold text-emerald-800 mt-1">{presenceRate}%</div>
                  <div className="text-xs text-emerald-600 mt-1">
                    {confirmedBookings + completedBookings} présents / {totalAttendable} RDV
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="text-xs text-orange-700 font-medium">Taux d'absentéisme</div>
                  <div className="text-2xl font-bold text-orange-800 mt-1">{absenteeismRate}%</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {noShowBookings} absents / {totalAttendable} RDV
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Réservations récentes */}
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
          <div className="space-y-3">
            {todayBookings.length > 0 ? (
              todayBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-vet-beige/30 rounded-lg hover:bg-vet-beige/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold ${
                      booking.urgency_score && booking.urgency_score >= 8 
                        ? 'bg-red-500 text-white' 
                        : booking.urgency_score && booking.urgency_score >= 6
                        ? 'bg-amber-500 text-white'
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
                    <p className={`text-sm font-medium capitalize px-2 py-1 rounded ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'no-show' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status === 'no-show' ? 'absent' : booking.status}
                    </p>
                    <p className="text-xs text-vet-brown mt-1">
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
    </div>
  );
};

export default VetDashboard;
