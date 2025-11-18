-- Update trigger to fire AFTER delete instead of BEFORE delete
DROP TRIGGER IF EXISTS on_booking_deleted ON bookings;
CREATE TRIGGER on_booking_deleted
  AFTER DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_cancelled();