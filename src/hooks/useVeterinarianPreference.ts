
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
      
      if (!currentClinic?.slug) {
        console.log('❌ No clinic slug available in context');
        setVeterinarians([]);
        return;
      }

      console.log('🔄 Fetching veterinarians for clinic:', currentClinic.slug);
      console.log('🔄 Clinic context:', currentClinic);

      // Use the secure function instead of direct table access for public booking
      const { data, error } = await supabase
        .rpc('get_clinic_veterinarians_for_booking', { 
          clinic_slug: currentClinic.slug 
        });

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
            is_active: vet.is_active
          });
        });
      } else {
        console.log('⚠️ No veterinarians found for clinic:', currentClinic.slug);
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
    if (currentClinic?.slug) {
      fetchVeterinarians();
    } else {
      console.log('⚠️ No clinic slug available, skipping veterinarians fetch');
      setIsLoading(false);
      setVeterinarians([]);
    }
  }, [currentClinic?.slug]);

  return {
    veterinarians,
    selectedVeterinarian,
    setSelectedVeterinarian,
    isLoading,
    refetch: fetchVeterinarians
  };
};
