
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, Calendar } from "lucide-react";
import VetLayout from "@/components/layout/VetLayout";

const VetAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Données temporaires pour les rendez-vous
  const appointments = [
    { 
      id: 1, 
      date: "2024-01-15", 
      time: "09:00", 
      pet: "Max", 
      owner: "M. Dupont", 
      phone: "06.12.34.56.78",
      type: "Consultation", 
      status: "Confirmé" 
    },
    { 
      id: 2, 
      date: "2024-01-15", 
      time: "09:30", 
      pet: "Luna", 
      owner: "Mme Martin", 
      phone: "06.87.65.43.21",
      type: "Vaccination", 
      status: "En attente" 
    },
    { 
      id: 3, 
      date: "2024-01-15", 
      time: "10:30", 
      pet: "Rex", 
      owner: "M. Bernard", 
      phone: "06.11.22.33.44",
      type: "Chirurgie", 
      status: "Confirmé" 
    },
    { 
      id: 4, 
      date: "2024-01-16", 
      time: "14:00", 
      pet: "Bella", 
      owner: "Mme Leroy", 
      phone: "06.55.66.77.88",
      type: "Consultation", 
      status: "En attente" 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-vet-sage/20 text-vet-sage border-vet-sage/30";
      case "En attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Annulé":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <VetLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-vet-navy">Rendez-vous</h1>
            <p className="text-vet-brown">Gestion de tous vos rendez-vous</p>
          </div>
          <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                <Input
                  placeholder="Rechercher par nom d'animal ou propriétaire..."
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

        {/* Liste des rendez-vous */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader>
            <CardTitle className="flex items-center text-vet-navy">
              <Users className="h-5 w-5 mr-2 text-vet-sage" />
              Liste des rendez-vous
            </CardTitle>
            <CardDescription className="text-vet-brown">
              {filteredAppointments.length} rendez-vous trouvés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-vet-blue/20 rounded-lg bg-vet-beige/10 hover:bg-vet-beige/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-vet-sage text-white rounded-lg px-3 py-2 text-sm font-semibold">
                        {new Date(appointment.date).toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })}
                        <br />
                        {appointment.time}
                      </div>
                      <div>
                        <h3 className="font-semibold text-vet-navy text-lg">{appointment.pet}</h3>
                        <p className="text-vet-brown">{appointment.owner}</p>
                        <p className="text-sm text-vet-brown">{appointment.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-vet-navy">{appointment.type}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="space-x-2">
                        <Button size="sm" variant="outline" className="border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white">
                          Voir
                        </Button>
                        <Button size="sm" variant="outline" className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white">
                          Modifier
                        </Button>
                        {appointment.status === "En attente" && (
                          <Button size="sm" className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                            Confirmer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-vet-blue mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-vet-navy mb-2">Aucun rendez-vous trouvé</h3>
                <p className="text-vet-brown">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VetLayout>
  );
};

export default VetAppointments;
