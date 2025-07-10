
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";

const AppointmentSlots = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Données temporaires pour les créneaux
  const availableDates = [
    "2024-01-15",
    "2024-01-16", 
    "2024-01-17",
    "2024-01-18",
    "2024-01-19"
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      navigate('/booking/confirmation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <ProgressBar value={100} />
          
          {/* Titre */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-vet-navy mb-2">
              Choisissez votre créneau
            </h1>
            <p className="text-vet-brown text-lg">
              Sélectionnez la date et l'heure qui vous conviennent le mieux
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sélection de date */}
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-vet-navy">
                  <Calendar className="h-5 w-5 mr-2 text-vet-sage" />
                  Choisir une date
                </CardTitle>
                <CardDescription className="text-vet-brown">
                  Dates disponibles pour votre rendez-vous
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {availableDates.map((date) => (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      className={`justify-start h-auto p-4 ${
                        selectedDate === date 
                          ? "bg-vet-sage hover:bg-vet-sage/90 text-white" 
                          : "border-vet-blue/30 hover:bg-vet-blue/10"
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="text-left">
                        <div className="font-semibold">
                          {new Date(date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </div>
                        <div className="text-sm opacity-80">
                          {new Date(date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sélection d'heure */}
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-vet-navy">
                  <Clock className="h-5 w-5 mr-2 text-vet-sage" />
                  Choisir une heure
                </CardTitle>
                <CardDescription className="text-vet-brown">
                  {selectedDate 
                    ? `Créneaux disponibles le ${new Date(selectedDate).toLocaleDateString('fr-FR')}`
                    : "Sélectionnez d'abord une date"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={selectedTime === time 
                          ? "bg-vet-sage hover:bg-vet-sage/90 text-white" 
                          : "border-vet-blue/30 hover:bg-vet-blue/10"
                        }
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-vet-brown">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Veuillez d'abord sélectionner une date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif et validation */}
          {selectedDate && selectedTime && (
            <Card className="mt-8 bg-vet-sage/10 backdrop-blur-sm border-vet-sage/30 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-vet-navy mb-1">
                      Votre rendez-vous
                    </h3>
                    <p className="text-vet-brown">
                      {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })} à {selectedTime}
                    </p>
                  </div>
                  <Button 
                    onClick={handleBooking}
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8"
                  >
                    Confirmer le rendez-vous
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentSlots;
