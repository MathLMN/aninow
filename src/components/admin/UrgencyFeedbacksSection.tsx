import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, AlertCircle, TrendingUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UrgencyFeedback {
  id: string;
  booking_id: string;
  clinic_id: string;
  original_score: number;
  original_level: string;
  is_correct: boolean;
  suggested_level: string | null;
  feedback_reason: string | null;
  created_at: string;
  bookings: {
    animal_name: string;
    client_name: string;
    consultation_reason: string;
  };
  clinics: {
    name: string;
  };
}

export const UrgencyFeedbacksSection = () => {
  const [feedbacks, setFeedbacks] = useState<UrgencyFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    correctPercentage: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('urgency_feedbacks')
        .select(`
          *,
          bookings (
            animal_name,
            client_name,
            consultation_reason
          ),
          clinics (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setFeedbacks(data || []);

      // Calculer les statistiques
      const total = data?.length || 0;
      const correct = data?.filter(f => f.is_correct).length || 0;
      const incorrect = total - correct;
      const correctPercentage = total > 0 ? Math.round((correct / total) * 100) : 0;

      setStats({ total, correct, incorrect, correctPercentage });
    } catch (error) {
      console.error('Erreur lors du chargement des feedbacks:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les feedbacks d'urgence",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyIcon = (level: string) => {
    if (level === 'critical') return <AlertTriangle className="h-4 w-4 text-red-600" />;
    if (level === 'moderate') return <AlertCircle className="h-4 w-4 text-orange-600" />;
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  };

  const getUrgencyLabel = (level: string) => {
    if (level === 'critical') return 'Critique';
    if (level === 'moderate') return 'Modérée';
    return 'Faible';
  };

  const getUrgencyColor = (level: string) => {
    if (level === 'critical') return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'moderate') return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/20">
        <CardHeader>
          <CardTitle className="text-vet-navy">Feedbacks d'urgence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-vet-brown">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/20">
      <CardHeader>
        <CardTitle className="text-vet-navy">Feedbacks d'urgence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-vet-beige/30 rounded-lg">
            <div className="text-2xl font-bold text-vet-navy">{stats.total}</div>
            <div className="text-sm text-vet-brown">Total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{stats.correct}</div>
            <div className="text-sm text-green-600">Corrects</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{stats.incorrect}</div>
            <div className="text-sm text-red-600">Incorrects</div>
          </div>
          <div className="text-center p-4 bg-vet-sage/20 rounded-lg">
            <div className="text-2xl font-bold text-vet-navy">{stats.correctPercentage}%</div>
            <div className="text-sm text-vet-brown">Précision</div>
          </div>
        </div>

        {/* Liste des feedbacks */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {feedbacks.length === 0 ? (
            <p className="text-center text-vet-brown py-8">Aucun feedback enregistré pour le moment</p>
          ) : (
            feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className="p-4 border border-vet-blue/20 rounded-lg hover:bg-vet-beige/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-vet-navy">
                        {feedback.bookings?.animal_name}
                      </span>
                      <span className="text-sm text-vet-brown">
                        ({feedback.bookings?.client_name})
                      </span>
                    </div>
                    <div className="text-sm text-vet-brown mb-2">
                      {feedback.clinics?.name}
                    </div>
                    <div className="text-xs text-vet-brown/70">
                      {format(new Date(feedback.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={feedback.is_correct ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                  >
                    {feedback.is_correct ? '✓ Correct' : '✗ Incorrect'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-vet-brown/70">IA:</span>
                    <Badge variant="outline" className={getUrgencyColor(feedback.original_level)}>
                      {getUrgencyIcon(feedback.original_level)}
                      <span className="ml-1">{getUrgencyLabel(feedback.original_level)}</span>
                      <span className="ml-1 text-xs">({feedback.original_score}/10)</span>
                    </Badge>
                  </div>

                  {!feedback.is_correct && feedback.suggested_level && (
                    <>
                      <span className="text-vet-brown/50">→</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-vet-brown/70">Suggéré:</span>
                        <Badge variant="outline" className={getUrgencyColor(feedback.suggested_level)}>
                          {getUrgencyIcon(feedback.suggested_level)}
                          <span className="ml-1">{getUrgencyLabel(feedback.suggested_level)}</span>
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                {feedback.feedback_reason && (
                  <div className="mt-3 p-3 bg-vet-beige/20 rounded border border-vet-blue/10">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-vet-sage mt-0.5" />
                      <p className="text-sm text-vet-brown italic">{feedback.feedback_reason}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
