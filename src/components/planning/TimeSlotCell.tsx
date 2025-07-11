
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotCellProps {
  time: string;
  columnId: string;
  bookings: any[];
  isOpen: boolean;
  canBook: boolean;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
  selectedDate: Date;
}

export const TimeSlotCell = ({
  time,
  columnId,
  bookings,
  isOpen,
  canBook,
  onCreateAppointment,
  onAppointmentClick,
  selectedDate
}: TimeSlotCellProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Calculer la hauteur du rendez-vous en fonction de sa durée
  const getAppointmentHeight = (booking: any) => {
    const duration = booking.duration_minutes || 15;
    // Chaque tranche de 15 minutes = 30px de hauteur
    const slotsNeeded = Math.ceil(duration / 15);
    return slotsNeeded * 30;
  };

  return (
    <div
      className={cn(
        "border-l border-gray-200/30 relative transition-colors cursor-pointer",
        "group hover:bg-blue-50/30",
        "h-[30px]",
        !isOpen && "bg-gray-50/30"
      )}
      onClick={() => {
        onCreateAppointment({
          date: selectedDate.toISOString().split('T')[0],
          time: time,
          veterinarian: columnId !== 'asv' ? columnId : undefined
        });
      }}
    >
      {bookings.map((booking) => (
        <div
          key={booking.id}
          onClick={(e) => {
            e.stopPropagation();
            onAppointmentClick(booking);
          }}
          className={`absolute inset-x-0 top-0 p-1 rounded-sm border cursor-pointer hover:shadow-sm transition-shadow text-[10px] leading-tight ${getStatusColor(booking.status)}`}
          style={{ 
            height: `${getAppointmentHeight(booking)}px`,
            zIndex: 10
          }}
        >
          <div className="font-medium truncate text-[10px]">
            {booking.client_name}
          </div>
          <div className="truncate text-[9px] opacity-80">
            {booking.animal_name}
          </div>
          {booking.duration_minutes && booking.duration_minutes > 15 && (
            <div className="text-[8px] opacity-70 mt-1">
              {booking.duration_minutes} min
            </div>
          )}
        </div>
      ))}
      
      {/* Bouton d'ajout au survol */}
      {bookings.length === 0 && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-blue-50/20 hover:bg-blue-50/40">
          <Plus className="h-3 w-3 text-blue-600/70" />
        </div>
      )}
    </div>
  );
};
