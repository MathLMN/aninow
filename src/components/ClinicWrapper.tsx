
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useClinicContext } from '@/contexts/ClinicContext';
import { Loader2 } from 'lucide-react';

interface ClinicWrapperProps {
  children: React.ReactNode;
}

export const ClinicWrapper: React.FC<ClinicWrapperProps> = ({ children }) => {
  const { clinicSlug } = useParams<{ clinicSlug: string }>();
  const { currentClinic, isLoading, error, setCurrentClinicBySlug } = useClinicContext();

  useEffect(() => {
    if (clinicSlug && (!currentClinic || currentClinic.slug !== clinicSlug)) {
      console.log('🔄 Loading clinic from slug:', clinicSlug);
      setCurrentClinicBySlug(clinicSlug);
    }
  }, [clinicSlug, currentClinic, setCurrentClinicBySlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-vet-blue" />
          <p className="text-vet-brown">Chargement de la clinique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vet-navy mb-4">Clinique introuvable</h1>
          <p className="text-vet-brown mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-vet-sage text-white px-4 py-2 rounded-lg hover:bg-vet-sage/90"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!currentClinic) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
