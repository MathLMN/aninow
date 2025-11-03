import { Clock, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WaitingListProps {
  bookings: any[];
}

export const WaitingList = ({ bookings }: WaitingListProps) => {
  // Filtrer les bookings avec arrival_time pour aujourd'hui
  const today = new Date().toDateString();
  const arrivedClients = bookings.filter(booking => {
    if (!booking.arrival_time) return false;
    const bookingDate = new Date(booking.appointment_date).toDateString();
    return bookingDate === today && booking.status !== 'completed' && booking.status !== 'cancelled';
  });

  if (arrivedClients.length === 0) {
    return (
      <div className="mt-2 bg-white/50 backdrop-blur-sm border border-vet-blue/20 rounded-lg p-3">
        <h3 className="text-xs font-semibold text-vet-blue mb-2 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Salle d'attente
        </h3>
        <p className="text-xs text-muted-foreground text-center py-2">
          Aucun client en attente
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 bg-white/50 backdrop-blur-sm border border-vet-blue/20 rounded-lg p-3">
      <h3 className="text-xs font-semibold text-vet-blue mb-2 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Salle d'attente ({arrivedClients.length})
      </h3>
      <ScrollArea className="max-h-32">
        <div className="space-y-2">
          {arrivedClients.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start gap-2 p-2 bg-white/80 rounded border border-vet-blue/10 hover:border-vet-blue/30 transition-colors"
            >
              <User className="h-3 w-3 text-vet-blue mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {booking.client_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {booking.animal_name} - {booking.animal_species}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-vet-blue font-medium">
                    Arrivé: {booking.arrival_time}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    RDV: {booking.appointment_time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
