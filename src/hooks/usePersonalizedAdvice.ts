import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingData {
  animal_name?: string;
  animal_species?: string;
  consultation_reason?: string;
  selected_symptoms?: string[];
  custom_symptom?: string;
  symptom_duration?: string;
  convenience_options?: string[];
  client_comment?: string;
  additional_points?: string[];
  second_animal_name?: string;
  second_animal_species?: string;
  second_animal_different_reason?: boolean;
  second_animal_consultation_reason?: string;
  second_animal_selected_symptoms?: string[];
  second_animal_custom_symptom?: string;
  second_animal_convenience_options?: string[];
  [key: string]: any;
}

export const usePersonalizedAdvice = () => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAdvice = async (bookingData: BookingData) => {
    // Ne régénérer que si pas déjà en cache
    if (advice) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating personalized advice...');
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-advice', {
        body: { booking_data: bookingData }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.advice) {
        setAdvice(data.advice);
      } else {
        throw new Error('Aucun conseil reçu');
      }

    } catch (err: any) {
      console.error('Error generating advice:', err);
      setError(err.message || 'Erreur lors de la génération des conseils');
      
      toast({
        title: "Erreur",
        description: "Impossible de charger les conseils pour le moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    advice,
    isLoading,
    error,
    generateAdvice
  };
};
