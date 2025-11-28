import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createClinicSchema, updateClinicSchema } from '@/utils/validation';
import { z } from 'zod';

interface CreateClinicData {
  name: string;
  slug: string;
}

interface ClinicData {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export const useClinicManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const { toast } = useToast();

  const createClinic = async (clinicData: CreateClinicData) => {
    setIsLoading(true);
    
    try {
      // ✅ Validation stricte avec Zod
      const validated = createClinicSchema.parse(clinicData);
      
      const { data, error } = await supabase
        .from('clinics')
        .insert([validated])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Clinique créée",
        description: "La clinique a été créée avec succès",
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la clinique:', error);
      
      let errorMessage = "Impossible de créer la clinique";
      if (error instanceof z.ZodError) {
        errorMessage = `Validation échouée: ${error.issues.map(e => e.message).join(', ')}`;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClinics = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClinics(data || []);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des cliniques:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cliniques",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateClinic = async (id: string, updates: Partial<CreateClinicData>) => {
    setIsLoading(true);
    
    try {
      // ✅ Validation stricte avec Zod
      const validated = updateClinicSchema.parse(updates);
      
      const { data, error } = await supabase
        .from('clinics')
        .update(validated)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Clinique mise à jour",
        description: "Les informations de la clinique ont été mises à jour",
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la clinique:', error);
      
      let errorMessage = "Impossible de mettre à jour la clinique";
      if (error instanceof z.ZodError) {
        errorMessage = `Validation échouée: ${error.issues.map(e => e.message).join(', ')}`;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    clinics,
    createClinic,
    fetchClinics,
    updateClinic
  };
};
