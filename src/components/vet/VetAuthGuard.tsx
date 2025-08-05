
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVetAuth } from "@/hooks/useVetAuth";
import { Loader2 } from "lucide-react";

interface VetAuthGuardProps {
  children: React.ReactNode;
}

export const VetAuthGuard = ({ children }: VetAuthGuardProps) => {
  const { isAuthenticated, isLoading, veterinarian, adminProfile } = useVetAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Access denied, redirecting to login', { 
        isAuthenticated, 
        veterinarian: !!veterinarian, 
        adminProfile: !!adminProfile 
      });
      navigate('/vet/login');
    }
  }, [isAuthenticated, isLoading, veterinarian, adminProfile, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-vet-sage mx-auto mb-4" />
          <p className="text-vet-brown">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return <>{children}</>;
};
