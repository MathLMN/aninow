
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePromptManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [rules, setRules] = useState([]);
  const [performanceLogs, setPerformanceLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates de prompts",
        variant: "destructive"
      });
    }
  };

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_rules')
        .select(`
          *,
          prompt_templates:template_id (
            id,
            name
          )
        `)
        .order('priority', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des règles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les règles de sélection",
        variant: "destructive"
      });
    }
  };

  const fetchPerformanceLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_performance_logs')
        .select(`
          *,
          prompt_templates:template_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setPerformanceLogs(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de performance",
        variant: "destructive"
      });
    }
  };

  const createTemplate = async (templateData: any) => {
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .insert(templateData)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Template de prompt créé avec succès"
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le template",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      toast({
        title: "Succès",
        description: "Template mis à jour avec succès"
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le template",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Succès",
        description: "Template supprimé avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le template",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createRule = async (ruleData: any) => {
    try {
      const { data, error } = await supabase
        .from('prompt_rules')
        .insert(ruleData)
        .select(`
          *,
          prompt_templates:template_id (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      setRules(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Règle créée avec succès"
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la règle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la règle",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateRule = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('prompt_rules')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          prompt_templates:template_id (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      setRules(prev => prev.map(r => r.id === id ? data : r));
      toast({
        title: "Succès",
        description: "Règle mise à jour avec succès"
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la règle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la règle",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompt_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRules(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Succès",
        description: "Règle supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la règle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la règle",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchTemplates(),
        fetchRules(),
        fetchPerformanceLogs()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    templates,
    rules,
    performanceLogs,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createRule,
    updateRule,
    deleteRule,
    refetch: async () => {
      await Promise.all([
        fetchTemplates(),
        fetchRules(),
        fetchPerformanceLogs()
      ]);
    }
  };
};
