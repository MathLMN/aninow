
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Veterinarian {
  id: string;
  name: string;
  specialty?: string;
  is_active: boolean;
}

export const useVeterinarianPreference = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchVeterinarians = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setVeterinarians(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des vétérinaires:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des vétérinaires",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  return {
    veterinarians,
    selectedVeterinarian,
    setSelectedVeterinarian,
    isLoading
  };
};
