
import { useState } from "react";
import { Bell, X, Calendar, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePendingBookings } from "@/hooks/usePendingBookings";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const PendingBookingsNotification = () => {
  const { pendingBookings, unreadCount, markAsRead, isLoading } = usePendingBookings();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      markAsRead();
    }
  };

  if (isLoading) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full bg-vet-sage/10 hover:bg-vet-sage/20 border-2 border-transparent hover:border-vet-sage/30 transition-all duration-200"
        >
          <Bell className="h-5 w-5 text-vet-sage" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 hover:bg-red-500 text-white text-xs flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-vet-navy">
            Demandes de rendez-vous en attente
          </SheetTitle>
          <SheetDescription>
            {pendingBookings.length === 0 
              ? "Aucune demande en attente" 
              : `${pendingBookings.length} demande${pendingBookings.length > 1 ? 's' : ''} à traiter`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
          {pendingBookings.length === 0 ? (
            <div className="text-center py-8 text-vet-brown/70">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune nouvelle demande de rendez-vous</p>
            </div>
          ) : (
            pendingBookings.map((booking) => (
              <Card key={booking.id} className="border-vet-blue/30 hover:border-vet-sage/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base text-vet-navy">
                        {booking.client_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <User className="h-3 w-3" />
                        {booking.animal_name} ({booking.animal_species})
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      En attente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {booking.appointment_date && booking.appointment_time && (
                      <div className="flex items-center gap-2 text-vet-brown">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.appointment_date).toLocaleDateString('fr-FR')} à {booking.appointment_time}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-vet-brown">
                      <Phone className="h-3 w-3" />
                      {booking.client_phone}
                    </div>
                    <div className="flex items-center gap-2 text-vet-brown">
                      <Mail className="h-3 w-3" />
                      {booking.client_email}
                    </div>
                    <div className="text-xs text-vet-brown/70 mt-2">
                      Demandé {formatDistanceToNow(new Date(booking.created_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                      Accepter
                    </Button>
                    <Button size="sm" variant="outline" className="border-vet-blue/30">
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
