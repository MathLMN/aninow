
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface AnalysisDisplayProps {
  aiAnalysis: any;
}

export const AnalysisDisplay = ({ aiAnalysis }: AnalysisDisplayProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-blue-500 text-white'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Critique'
      case 'high': return 'Élevée'
      case 'medium': return 'Modérée'
      case 'low': return 'Faible'
      default: return 'Standard'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangle
      case 'high': return AlertTriangle
      case 'medium': return TrendingUp
      case 'low': return CheckCircle
      default: return TrendingUp
    }
  }

  const PriorityIcon = getPriorityIcon(aiAnalysis.priority_level)
  
  // Afficher le badge seulement si urgence >= 7 (haute urgence)
  const showPriorityBadge = aiAnalysis.urgency_score >= 7;

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/30 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg text-vet-navy">Votre situation</CardTitle>
          {showPriorityBadge && (
            <Badge className={`${getPriorityColor(aiAnalysis.priority_level)} flex items-center gap-1.5 text-sm px-3 py-1`}>
              <PriorityIcon className="h-4 w-4" />
              Priorité {getPriorityLabel(aiAnalysis.priority_level)} • {aiAnalysis.urgency_score}/10
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        {/* Résumé de l'analyse */}
        <div>
          <h4 className="font-semibold text-vet-navy mb-2 text-sm">Ce que nous avons compris :</h4>
          <p className="text-vet-brown text-sm leading-relaxed">
            {aiAnalysis.analysis_summary}
          </p>
        </div>
        
        {/* Actions recommandées - Limité à 3 */}
        {aiAnalysis.recommended_actions && aiAnalysis.recommended_actions.length > 0 && (
          <div>
            <h4 className="font-semibold text-vet-navy mb-2 text-sm">
              Nos conseils en attendant le rendez-vous :
            </h4>
            <div className="space-y-2">
              {aiAnalysis.recommended_actions.slice(0, 3).map((action: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-vet-sage mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-vet-brown">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
