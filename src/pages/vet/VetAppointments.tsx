import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useVetBookings } from "@/hooks/useVetBookings";
import { formatDateLocal } from "@/utils/date";
import { AppointmentDetailsModal } from "@/components/planning/AppointmentDetailsModal";
import { useIsMobile } from "@/hooks/use-mobile";

const VetAppointments = () => {
  const { bookings, isLoading, stats } = useVetBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = searchTerm === "" || 
        booking.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.animal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      
      const today = new Date().toISOString().split('T')[0];
      const bookingDate = booking.appointment_date;
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = bookingDate === today;
      } else if (dateFilter === "week") {
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        matchesDate = new Date(bookingDate) <= weekFromNow;
      } else if (dateFilter === "past") {
        matchesDate = new Date(bookingDate) < new Date(today);
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleViewDetails = (booking: any) => {
    setSelectedAppointment(booking);
    setIsDetailsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vet-sage mx-auto"></div>
          <p className="text-vet-brown mt-4">Chargement des rendez-vous...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy">Rendez-vous</h1>
            <p className="text-vet-brown">Gestion de tous vos rendez-vous</p>
          </div>
        </div>

        {/* Statistiques rapides - grille responsive pleine largeur */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-vet-navy">{stats.total}</div>
                <div className="text-xs sm:text-sm text-vet-brown">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs sm:text-sm text-vet-brown">En attente</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.confirmed}</div>
                <div className="text-xs sm:text-sm text-vet-brown">Confirmés</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{stats.highUrgency}</div>
                <div className="text-xs sm:text-sm text-vet-brown">Urgences</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche - pleine largeur */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                  <Input
                    placeholder="Rechercher par nom du client, animal, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-vet-blue/30">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-vet-blue/30">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les dates</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="past">Passés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rendez-vous - pleine largeur */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 w-full">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-vet-navy">
              Rendez-vous ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-vet-blue/20">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-4 sm:p-6 hover:bg-vet-beige/20 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        {/* Indicateur d'urgence */}
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                          booking.urgency_score && booking.urgency_score >= 7 
                            ? 'bg-red-500 text-white' 
                            : 'bg-vet-sage text-white'
                        }`}>
                          {booking.urgency_score || '?'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                            <h3 className="font-semibold text-vet-navy truncate">
                              {booking.animal_name} - {booking.client_name}
                            </h3>
                            <Badge variant="outline" className={`w-fit ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1">{getStatusLabel(booking.status)}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-vet-brown space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(booking.appointment_date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {booking.appointment_time}
                            </div>
                            <div className="flex items-center truncate">
                              <User className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{booking.animal_species}</span>
                            </div>
                          </div>
                          
                          {!isMobile && (
                            <p className="text-sm text-vet-brown mt-1 truncate">
                              {booking.consultation_reason === 'consultation-convenance' ? 'Consultation de convenance' :
                               booking.consultation_reason === 'symptomes-anomalie' ? 'Symptômes/Anomalie' :
                               booking.consultation_reason === 'urgence' ? 'Urgence' : 'Consultation'}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                          className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {isMobile ? 'Voir' : 'Détails'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-vet-brown">Aucun rendez-vous trouvé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modale de détails */}
        {selectedAppointment && (
          <AppointmentDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
          />
        )}
      </div>
    </div>
  );
};

export default VetAppointments;
