
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Settings, Heart, Bell, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import VetLayout from "@/components/layout/VetLayout";

const VetDashboard = () => {
  // Données temporaires pour le dashboard
  const stats = {
    appointmentsToday: 12,
    appointmentsWeek: 45,
    totalPatients: 248,
    avgWaitTime: 15
  };

  const upcomingAppointments = [
    { id: 1, time: "09:00", pet: "Max", owner: "M. Dupont", type: "Consultation" },
    { id: 2, time: "09:30", pet: "Luna", owner: "Mme Martin", type: "Vaccination" },
    { id: 3, time: "10:00", pet: "Rex", owner: "M. Bernard", type: "Urgence" },
  ];

  return (
    <VetLayout>
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
              <div className="text-2xl font-bold text-vet-navy">{stats.appointmentsToday}</div>
              <p className="text-xs text-vet-brown">+2 par rapport à hier</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-vet-brown">RDV cette semaine</CardTitle>
              <TrendingUp className="h-4 w-4 text-vet-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vet-navy">{stats.appointmentsWeek}</div>
              <p className="text-xs text-vet-brown">+12% par rapport à la semaine dernière</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-vet-brown">Patients total</CardTitle>
              <Users className="h-4 w-4 text-vet-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vet-navy">{stats.totalPatients}</div>
              <p className="text-xs text-vet-brown">Animaux suivis régulièrement</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-vet-brown">Temps d'attente moyen</CardTitle>
              <Clock className="h-4 w-4 text-vet-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vet-navy">{stats.avgWaitTime} min</div>
              <p className="text-xs text-vet-brown">Dans les normes acceptables</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Prochains rendez-vous */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center text-vet-navy">
                <Clock className="h-5 w-5 mr-2 text-vet-sage" />
                Prochains rendez-vous
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Planning d'aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-vet-beige/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-vet-sage text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {appointment.time.split(':')[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-vet-navy">{appointment.pet}</p>
                        <p className="text-sm text-vet-brown">{appointment.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-vet-navy">{appointment.time}</p>
                      <p className="text-xs text-vet-brown">{appointment.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/vet/appointments">
                  <Button variant="outline" className="w-full border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                    Voir tous les rendez-vous
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
                    Patients
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
    </VetLayout>
  );
};

export default VetDashboard;
