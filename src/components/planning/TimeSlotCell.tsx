
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

  return (
    <div
      className={cn(
        "p-1 border-l border-vet-blue/10 relative transition-colors",
        canBook ? "group hover:bg-vet-sage/5 cursor-pointer" : "cursor-not-allowed",
        !isOpen && "bg-gray-50/50"
      )}
      onClick={() => {
        if (canBook) {
          onCreateAppointment({
            date: selectedDate.toISOString().split('T')[0],
            time: time,
            veterinarian: columnId !== 'asv' ? columnId : undefined
          });
        }
      }}
    >
      {bookings.map((booking) => (
        <div
          key={booking.id}
          onClick={(e) => {
            e.stopPropagation();
            onAppointmentClick(booking);
          }}
          className={`mb-1 p-2 rounded-md border cursor-pointer hover:shadow-md transition-shadow text-xs ${getStatusColor(booking.status)}`}
        >
          <div className="font-medium truncate">
            {booking.client_name}
          </div>
          <div className="truncate">
            {booking.animal_name}
          </div>
        </div>
      ))}
      
      {/* Bouton d'ajout au survol - seulement si ouvert */}
      {canBook && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-vet-sage/10 hover:bg-vet-sage/20">
          <Plus className="h-4 w-4 text-vet-sage" />
        </div>
      )}
      
      {/* Overlay pour les périodes fermées */}
      {!isOpen && (
        <div className="absolute inset-0 bg-gray-200/30 flex items-center justify-center">
          <div className="w-full h-px bg-gray-300/50"></div>
        </div>
      )}
    </div>
  );
};
