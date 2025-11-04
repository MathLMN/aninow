
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle, Activity, UserX, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useVetBookings } from "@/hooks/useVetBookings";
import { PendingBookingsNotification } from "@/components/planning/PendingBookingsNotification";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

const VetDashboard = () => {
  const { bookings, isLoading, stats } = useVetBookings();
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');

  // Filtrer uniquement les vrais rendez-vous (exclure les blocs récurrents)
  const realBookings = bookings.filter(b => !b.is_blocked);

  // Filtrer les rendez-vous d'aujourd'hui
  const todayBookings = realBookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.appointment_date === today || booking.created_at.split('T')[0] === today;
  }).slice(0, 5);

  // Calculer les statistiques du mois en cours
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const monthBookings = realBookings.filter(booking => {
    if (!booking.created_at) return false;
    try {
      const bookingDate = parseISO(booking.created_at);
      return isWithinInterval(bookingDate, { start: monthStart, end: monthEnd });
    } catch {
      return false;
    }
  });

  // Statistiques mensuelles
  const monthStats = {
    total: monthBookings.length,
    confirmed: monthBookings.filter(b => b.status === 'confirmed').length,
    pending: monthBookings.filter(b => b.status === 'pending').length,
    cancelled: monthBookings.filter(b => b.status === 'cancelled').length,
    completed: monthBookings.filter(b => b.status === 'completed').length,
    noShow: monthBookings.filter(b => b.status === 'no-show').length,
    highUrgency: monthBookings.filter(b => (b.urgency_score || 0) >= 7).length,
    convenienceBookings: monthBookings.filter(b => b.consultation_reason === 'consultation-convenance').length,
    symptomsBookings: monthBookings.filter(b => b.consultation_reason === 'symptomes-anomalie').length,
    emergencyBookings: monthBookings.filter(b => b.consultation_reason === 'urgence').length,
  };

  // Calculer des statistiques avancées pour la vue du jour
  const confirmedBookings = realBookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = realBookings.filter(b => b.status === 'cancelled').length;
  const completedBookings = realBookings.filter(b => b.status === 'completed').length;
  const noShowBookings = realBookings.filter(b => b.status === 'no-show').length;
  
  // Répartition par type de consultation pour la vue du jour
  const convenienceBookings = realBookings.filter(b => b.consultation_reason === 'consultation-convenance').length;
  const symptomsBookings = realBookings.filter(b => b.consultation_reason === 'symptomes-anomalie').length;
  const emergencyBookings = realBookings.filter(b => b.consultation_reason === 'urgence').length;
  
  // Taux de confirmation (bookings confirmés / total non-cancelled)
  const confirmationRate = stats.total > 0 
    ? Math.round((confirmedBookings / (stats.total - cancelledBookings)) * 100) 
    : 0;
  
  // Score d'urgence moyen
  const avgUrgencyScore = realBookings.length > 0
    ? Math.round(realBookings.reduce((sum, b) => sum + (b.urgency_score || 0), 0) / realBookings.length)
    : 0;

  // Taux de présence et d'absentéisme
  const totalAttendable = confirmedBookings + noShowBookings + completedBookings;
  const presenceRate = totalAttendable > 0
    ? Math.round(((confirmedBookings + completedBookings) / totalAttendable) * 100)
    : 0;
  const absenteeismRate = totalAttendable > 0
    ? Math.round((noShowBookings / totalAttendable) * 100)
    : 0;

  // Statistiques mensuelles calculées
  const monthConfirmationRate = monthStats.total > 0 
    ? Math.round((monthStats.confirmed / (monthStats.total - monthStats.cancelled)) * 100) 
    : 0;
  
  const monthAvgUrgencyScore = monthBookings.length > 0
    ? Math.round(monthBookings.reduce((sum, b) => sum + (b.urgency_score || 0), 0) / monthBookings.length)
    : 0;

  const monthTotalAttendable = monthStats.confirmed + monthStats.noShow + monthStats.completed;
  const monthPresenceRate = monthTotalAttendable > 0
    ? Math.round(((monthStats.confirmed + monthStats.completed) / monthTotalAttendable) * 100)
    : 0;
  const monthAbsenteeismRate = monthTotalAttendable > 0
    ? Math.round((monthStats.noShow / monthTotalAttendable) * 100)
    : 0;

  // Sélectionner les stats à afficher selon le mode
  const displayStats = viewMode === 'day' ? {
    todayBookings: stats.todayBookings,
    pending: stats.pending,
    highUrgency: stats.highUrgency,
    total: stats.total,
    noShow: noShowBookings,
    confirmed: confirmedBookings,
    cancelled: cancelledBookings,
    convenience: convenienceBookings,
    symptoms: symptomsBookings,
    emergency: emergencyBookings,
    confirmationRate,
    avgUrgencyScore,
    presenceRate,
    absenteeismRate
  } : {
    todayBookings: monthStats.total,
    pending: monthStats.pending,
    highUrgency: monthStats.highUrgency,
    total: monthStats.total,
    noShow: monthStats.noShow,
    confirmed: monthStats.confirmed,
    cancelled: monthStats.cancelled,
    convenience: monthStats.convenienceBookings,
    symptoms: monthStats.symptomsBookings,
    emergency: monthStats.emergencyBookings,
    confirmationRate: monthConfirmationRate,
    avgUrgencyScore: monthAvgUrgencyScore,
    presenceRate: monthPresenceRate,
    absenteeismRate: monthAbsenteeismRate
  };

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
          <Link to="/vet/planning">
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
                  <span className="font-semibold text-vet-navy">{displayStats.confirmed}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-vet-brown">En attente</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{displayStats.pending}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <UserX className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-vet-brown">Non présentés</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{displayStats.noShow}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-vet-brown">Annulés</span>
                  </div>
                  <span className="font-semibold text-vet-navy">{displayStats.cancelled}</span>
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
                        style={{ width: `${displayStats.total > 0 ? (displayStats.convenience / displayStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-vet-navy w-8 text-right">{displayStats.convenience}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <span className="text-sm text-vet-brown">Symptômes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${displayStats.total > 0 ? (displayStats.symptoms / displayStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-vet-navy w-8 text-right">{displayStats.symptoms}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-vet-beige/30 rounded">
                  <span className="text-sm text-vet-brown">Urgences</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${displayStats.total > 0 ? (displayStats.emergency / displayStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-vet-navy w-8 text-right">{displayStats.emergency}</span>
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
                  <div className="text-2xl font-bold text-green-800 mt-1">{displayStats.confirmationRate}%</div>
                  <div className="text-xs text-green-600 mt-1">
                    {displayStats.confirmed} / {displayStats.total - displayStats.cancelled} RDV
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-700 font-medium">Urgence moyenne</div>
                  <div className="text-2xl font-bold text-blue-800 mt-1">{displayStats.avgUrgencyScore}/10</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Score moyen sur {viewMode === 'day' ? bookings.length : monthBookings.length} RDV
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="text-xs text-purple-700 font-medium">Urgences élevées</div>
                  <div className="text-2xl font-bold text-purple-800 mt-1">
                    {displayStats.total > 0 ? Math.round((displayStats.highUrgency / displayStats.total) * 100) : 0}%
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {displayStats.highUrgency} RDV avec score ≥ 7
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <div className="text-xs text-emerald-700 font-medium">Taux de présence</div>
                  <div className="text-2xl font-bold text-emerald-800 mt-1">{displayStats.presenceRate}%</div>
                  <div className="text-xs text-emerald-600 mt-1">
                    {displayStats.confirmed + (viewMode === 'month' ? monthStats.completed : completedBookings)} présents / {viewMode === 'month' ? monthTotalAttendable : totalAttendable} RDV
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="text-xs text-orange-700 font-medium">Taux d'absentéisme</div>
                  <div className="text-2xl font-bold text-orange-800 mt-1">{displayStats.absenteeismRate}%</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {displayStats.noShow} absents / {viewMode === 'month' ? monthTotalAttendable : totalAttendable} RDV
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
