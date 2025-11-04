
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePendingBookings } from "@/hooks/usePendingBookings";
import { useNavigate } from "react-router-dom";

export const PendingBookingsNotification = () => {
  const { unreadCount, isLoading } = usePendingBookings();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/vet/appointments');
  };

  if (isLoading) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="relative h-10 px-3 rounded-full bg-vet-sage/10 hover:bg-vet-sage/20 border-2 border-transparent hover:border-vet-sage/30 transition-all duration-200"
    >
      <Bell className="h-5 w-5 text-vet-sage mr-2" />
      <span className="text-vet-sage text-sm font-medium">Nouveau RDV</span>
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 hover:bg-red-500 text-white text-xs flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};
