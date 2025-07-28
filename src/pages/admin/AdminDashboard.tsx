
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVeterinaryPracticeRequests } from "@/hooks/useVeterinaryPracticeRequests";
import { useVetBookings } from "@/hooks/useVetBookings";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react";

const AdminDashboard = () => {
  const { stats: requestStats, isLoading: requestsLoading } = useVeterinaryPracticeRequests();
  const { stats: bookingStats, isLoading: bookingsLoading } = useVetBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord administrateur
        </h1>
      </div>

      {/* Statistiques des demandes de cabinets */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Demandes d'inscription des cabinets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requestsLoading ? '...' : requestStats.total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requestsLoading ? '...' : requestStats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requestsLoading ? '...' : requestStats.approved}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requestsLoading ? '...' : requestStats.rejected}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistiques des réservations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Réservations globales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookingsLoading ? '...' : bookingStats.total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookingsLoading ? '...' : bookingStats.todayBookings}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookingsLoading ? '...' : bookingStats.confirmed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Urgences</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookingsLoading ? '...' : bookingStats.highUrgency}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gérer les demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Approuver ou rejeter les demandes d'inscription des cabinets vétérinaires
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Voir les réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consulter toutes les réservations et leur statut
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
