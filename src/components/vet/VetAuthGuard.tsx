
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVetAuth } from "@/hooks/useVetAuth";
import { Loader2 } from "lucide-react";

interface VetAuthGuardProps {
  children: React.ReactNode;
}

export const VetAuthGuard = ({ children }: VetAuthGuardProps) => {
  const { isAuthenticated, isLoading, veterinarian } = useVetAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !veterinarian)) {
      console.log('🚫 Access denied, redirecting to login');
      navigate('/vet/login');
    }
  }, [isAuthenticated, isLoading, veterinarian, navigate]);

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

  if (!isAuthenticated || !veterinarian) {
    return null; // Will be redirected by useEffect
  }

  return <>{children}</>;
};
