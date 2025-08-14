
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useClinicContext } from '@/contexts/ClinicContext';

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
  const { currentClinic } = useClinicContext();

  const fetchVeterinarians = async () => {
    try {
      setIsLoading(true);
      
      if (!currentClinic?.id) {
        console.log('❌ No clinic ID available in context');
        setVeterinarians([]);
        return;
      }

      console.log('🔄 Fetching veterinarians for clinic:', currentClinic.id);
      console.log('🔄 Clinic context:', currentClinic);

      const { data, error } = await supabase
        .from('clinic_veterinarians')
        .select('id, name, specialty, is_active, clinic_id')
        .eq('clinic_id', currentClinic.id)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('❌ Error fetching veterinarians:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Veterinarians fetched successfully:', data);
      console.log('✅ Number of veterinarians:', data?.length || 0);
      
      // Log chaque vétérinaire pour debug
      if (data && data.length > 0) {
        data.forEach((vet, index) => {
          console.log(`🏥 Veterinarian ${index + 1}:`, {
            id: vet.id,
            name: vet.name,
            specialty: vet.specialty,
            is_active: vet.is_active,
            clinic_id: vet.clinic_id
          });
        });
      } else {
        console.log('⚠️ No veterinarians found for clinic:', currentClinic.id);
      }

      setVeterinarians(data || []);
    } catch (err) {
      console.error('❌ Error in fetchVeterinarians:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des vétérinaires",
        variant: "destructive"
      });
      setVeterinarians([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentClinic?.id) {
      fetchVeterinarians();
    } else {
      console.log('⚠️ No clinic ID available, skipping veterinarians fetch');
      setIsLoading(false);
      setVeterinarians([]);
    }
  }, [currentClinic?.id]);

  return {
    veterinarians,
    selectedVeterinarian,
    setSelectedVeterinarian,
    isLoading,
    refetch: fetchVeterinarians
  };
};
