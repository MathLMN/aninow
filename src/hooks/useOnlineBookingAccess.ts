import { usePublicClinicSettings } from './usePublicClinicSettings';

export const useOnlineBookingAccess = () => {
  const { settings, isLoading } = usePublicClinicSettings();

  const isOnlineBookingEnabled = settings?.online_booking_enabled ?? true;

  return {
    isOnlineBookingEnabled,
    isLoading,
    settings
  };
};
