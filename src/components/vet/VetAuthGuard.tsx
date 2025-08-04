import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVetAuth } from "@/hooks/useVetAuth";
import { Loader2, Settings } from "lucide-react";
import { isConfigModeEnabled, getRemainingConfigTime } from "@/lib/configMode";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VetAuthGuardProps {
  children: React.ReactNode;
}

export const VetAuthGuard = ({ children }: VetAuthGuardProps) => {
  const { isAuthenticated, isLoading, veterinarian, adminProfile } = useVetAuth();
  const navigate = useNavigate();

  // Check if configuration mode is enabled
  const configModeEnabled = isConfigModeEnabled();
  const remainingConfigTime = getRemainingConfigTime();

  useEffect(() => {
    // If config mode is enabled, allow access without authentication
    if (configModeEnabled) {
      console.log('🔧 Configuration mode active - bypassing authentication');
      return;
    }

    // Otherwise, enforce authentication as usual
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Access denied, redirecting to login', { 
        isAuthenticated, 
        veterinarian: !!veterinarian, 
        adminProfile: !!adminProfile 
      });
      navigate('/vet/login');
    }
  }, [isAuthenticated, isLoading, veterinarian, adminProfile, navigate, configModeEnabled]);

  if (isLoading && !configModeEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-vet-sage mx-auto mb-4" />
          <p className="text-vet-brown">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Show config mode warning if active
  if (configModeEnabled) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Configuration Mode Warning Banner */}
        <Alert className="m-4 border-amber-300 bg-amber-50">
          <Settings className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Mode Configuration Actif:</strong> Authentification contournée. 
            {remainingConfigTime > 0 && `Expire dans ${remainingConfigTime} minutes.`}
            {" "}Désactivez ce mode une fois la configuration terminée.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return <>{children}</>;
};
