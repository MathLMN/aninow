
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Clinic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface ClinicContextType {
  currentClinic: Clinic | null;
  isLoading: boolean;
  error: string | null;
  setCurrentClinicBySlug: (slug: string) => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const useClinicContext = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinicContext must be used within a ClinicProvider');
  }
  return context;
};

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentClinic, setCurrentClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCurrentClinicBySlug = async (slug: string) => {
    console.log('Setting clinic by slug:', slug);
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .rpc('get_clinic_by_slug', { clinic_slug: slug });

      if (fetchError) {
        console.error('Error fetching clinic:', fetchError);
        throw fetchError;
      }

      if (!data || data.length === 0) {
        throw new Error(`Clinic with slug "${slug}" not found`);
      }

      const clinic = data[0];
      setCurrentClinic(clinic);
      console.log('Current clinic set to:', clinic);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error setting clinic:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClinicContext.Provider value={{
      currentClinic,
      isLoading,
      error,
      setCurrentClinicBySlug
    }}>
      {children}
    </ClinicContext.Provider>
  );
};
