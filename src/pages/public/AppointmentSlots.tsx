
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";

interface TimeSlotGroup {
  period: string;
  slots: string[];
}

interface DateSlot {
  date: string;
  availability: number;
  timeGroups: TimeSlotGroup[];
}

const AppointmentSlots = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [openDate, setOpenDate] = useState<string>("");

  // Enhanced data structure with grouped time slots
  const availableDates: DateSlot[] = [
    {
      date: "2024-01-15",
      availability: 8,
      timeGroups: [
        { period: "Matin", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
        { period: "Après-midi", slots: ["14:00", "14:30", "15:00", "15:30"] }
      ]
    },
    {
      date: "2024-01-16", 
      availability: 6,
      timeGroups: [
        { period: "Matin", slots: ["09:00", "09:30", "10:30"] },
        { period: "Après-midi", slots: ["14:00", "15:00", "16:00"] }
      ]
    },
    {
      date: "2024-01-17",
      availability: 10,
      timeGroups: [
        { period: "Matin", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
        { period: "Après-midi", slots: ["14:00", "14:30", "15:00", "16:00"] }
      ]
    },
    {
      date: "2024-01-18",
      availability: 4,
      timeGroups: [
        { period: "Matin", slots: ["10:00", "11:00"] },
        { period: "Après-midi", slots: ["15:00", "16:00"] }
      ]
    },
    {
      date: "2024-01-19",
      availability: 7,
      timeGroups: [
        { period: "Matin", slots: ["09:00", "09:30", "10:30", "11:30"] },
        { period: "Après-midi", slots: ["14:30", "15:30", "16:30"] }
      ]
    }
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      navigate('/booking/confirmation');
    }
  };

  const handleBack = () => {
    navigate('/booking/contact-info');
  };

  const handleDateSelect = (date: string) => {
    if (selectedDate === date) {
      // If clicking the same date, toggle accordion
      setOpenDate(openDate === date ? "" : date);
    } else {
      // If selecting a new date, set it as selected and open
      setSelectedDate(date);
      setOpenDate(date);
      setSelectedTime(""); // Reset time selection
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'long' })
    };
  };

  const getAvailabilityColor = (count: number) => {
    if (count >= 8) return "bg-green-100 text-green-800";
    if (count >= 4) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <ProgressBar value={100} />
          
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-vet-navy mb-2 leading-tight">
              Choisissez votre créneau
            </h1>
            <p className="text-sm sm:text-base text-vet-brown/80 px-2">
              Sélectionnez la date et l'heure qui vous conviennent le mieux
            </p>
          </div>

          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBack} className="text-vet-navy hover:bg-vet-beige/20 p-2 text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          {/* Date selection with accordion */}
          <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-vet-navy">
                <Calendar className="h-5 w-5 mr-2 text-vet-sage" />
                Dates disponibles
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Cliquez sur une date pour voir les créneaux disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {availableDates.map((dateSlot) => {
                const { dayName, dayNumber, month } = formatDate(dateSlot.date);
                const isSelected = selectedDate === dateSlot.date;
                const isOpen = openDate === dateSlot.date;
                
                return (
                  <Collapsible key={dateSlot.date} open={isOpen} onOpenChange={() => handleDateSelect(dateSlot.date)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between h-auto p-4 border rounded-lg transition-all ${
                          isSelected 
                            ? "border-vet-sage bg-vet-sage/10 hover:bg-vet-sage/15" 
                            : "border-vet-blue/30 hover:bg-vet-blue/5"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <div className="font-semibold text-vet-navy capitalize">
                              {dayName} {dayNumber} {month}
                            </div>
                            <div className="text-sm text-vet-brown/70">
                              {new Date(dateSlot.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <Badge className={getAvailabilityColor(dateSlot.availability)}>
                            {dateSlot.availability} créneaux
                          </Badge>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-vet-brown transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="mt-4 space-y-4">
                        {dateSlot.timeGroups.map((group) => (
                          <div key={group.period}>
                            <h4 className="text-sm font-medium text-vet-navy mb-2 flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-vet-sage" />
                              {group.period}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {group.slots.map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  className={`rounded-full px-4 py-2 ${
                                    selectedTime === time
                                      ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage"
                                      : "border-vet-blue/30 hover:bg-vet-blue/10 hover:border-vet-sage/50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTime(time);
                                  }}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>

          {/* Summary and confirmation */}
          {selectedDate && selectedTime && (
            <Card className="bg-vet-sage/10 backdrop-blur-sm border-vet-sage/30 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-vet-navy mb-1">
                      Votre rendez-vous
                    </h3>
                    <p className="text-vet-brown">
                      {(() => {
                        const { dayName, dayNumber, month } = formatDate(selectedDate);
                        return `${dayName} ${dayNumber} ${month} ${new Date(selectedDate).getFullYear()} à ${selectedTime}`;
                      })()}
                    </p>
                  </div>
                  <Button 
                    onClick={handleBooking}
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 rounded-full"
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
