import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FormQuestion {
  id: string;
  question_type: 
    | 'booking_start' 
    | 'animal_info' 
    | 'consultation_reason' 
    | 'conditional_questions' 
    | 'symptom_duration' 
    | 'additional_points' 
    | 'client_comment' 
    | 'contact_info' 
    | 'appointment_slots';
  question_key: string;
  question_text: string;
  options: any[];
  order_index: number;
  is_active: boolean;
  parent_question_key?: string;
  trigger_conditions?: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useFormQuestions = () => {
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['form-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_questions')
        .select('*')
        .order('order_index');

      if (error) throw error;
      return data as FormQuestion[];
    },
  });

  const createQuestion = useMutation({
    mutationFn: async (question: Partial<FormQuestion>) => {
      const { data, error } = await supabase
        .from('form_questions')
        .insert([question as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-questions'] });
      toast.success('Question créée avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la création : ' + error.message);
    },
  });

  const updateQuestion = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FormQuestion> & { id: string }) => {
      const { data, error } = await supabase
        .from('form_questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-questions'] });
      toast.success('Question mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la mise à jour : ' + error.message);
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-questions'] });
      toast.success('Question supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la suppression : ' + error.message);
    },
  });

  const reorderQuestions = useMutation({
    mutationFn: async (reorderedQuestions: { id: string; order_index: number }[]) => {
      const promises = reorderedQuestions.map(({ id, order_index }) =>
        supabase
          .from('form_questions')
          .update({ order_index })
          .eq('id', id)
      );

      const results = await Promise.all(promises);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-questions'] });
      toast.success('Ordre mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error('Erreur lors du réordonnancement : ' + error.message);
    },
  });

  return {
    questions: questions || [],
    isLoading,
    createQuestion: createQuestion.mutate,
    updateQuestion: updateQuestion.mutate,
    deleteQuestion: deleteQuestion.mutate,
    reorderQuestions: reorderQuestions.mutate,
  };
};
