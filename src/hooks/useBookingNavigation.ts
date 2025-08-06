
import { useMultiTenantBookingNavigation } from './useMultiTenantBookingNavigation'

// This hook now serves as a wrapper for the multi-tenant navigation hook
// to maintain backward compatibility with existing components
export const useBookingNavigation = () => {
  return useMultiTenantBookingNavigation()
}
