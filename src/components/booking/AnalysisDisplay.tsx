
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

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

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/30 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-vet-blue" />
            <CardTitle className="text-vet-navy">Analyse IA Vétérinaire</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getPriorityColor(aiAnalysis.priority_level)} flex items-center gap-1`}>
              <PriorityIcon className="h-3 w-3" />
              Priorité {getPriorityLabel(aiAnalysis.priority_level)}
            </Badge>
            <Badge variant="outline" className="text-vet-brown">
              <TrendingUp className="h-3 w-3 mr-1" />
              {aiAnalysis.urgency_score}/10
            </Badge>
          </div>
        </div>
        <CardDescription className="text-vet-brown">
          Analyse automatique basée sur les informations fournies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score et résumé */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-vet-blue/10 to-vet-sage/10 p-4 rounded-lg">
              <h4 className="font-semibold text-vet-navy mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Score d'urgence
              </h4>
              <div className="text-2xl font-bold text-vet-blue">
                {aiAnalysis.urgency_score}/10
              </div>
              <p className="text-sm text-vet-brown mt-1">
                Basé sur l'analyse des symptômes
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-vet-sage/10 to-vet-beige/20 p-4 rounded-lg">
              <h4 className="font-semibold text-vet-navy mb-2">
                Niveau de priorité
              </h4>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(aiAnalysis.priority_level)}`}>
                <PriorityIcon className="h-3 w-3 mr-1" />
                {getPriorityLabel(aiAnalysis.priority_level)}
              </div>
            </div>
          </div>
          
          {/* Résumé de l'analyse */}
          <div className="bg-vet-beige/20 p-4 rounded-lg">
            <h4 className="font-semibold text-vet-navy mb-2">Résumé de l'analyse</h4>
            <p className="text-vet-brown text-sm leading-relaxed">
              {aiAnalysis.analysis_summary}
            </p>
          </div>
          
          {/* Insights IA */}
          {aiAnalysis.ai_insights && (
            <div className="bg-vet-blue/10 p-4 rounded-lg border-l-4 border-vet-blue">
              <h4 className="font-semibold text-vet-navy mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Analyse détaillée
              </h4>
              <p className="text-vet-brown text-sm leading-relaxed">
                {aiAnalysis.ai_insights}
              </p>
            </div>
          )}

          {/* Actions recommandées */}
          {aiAnalysis.recommended_actions && aiAnalysis.recommended_actions.length > 0 && (
            <div>
              <h4 className="font-semibold text-vet-navy mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Recommandations
              </h4>
              <div className="grid gap-2">
                {aiAnalysis.recommended_actions.map((action: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 bg-white/50 p-3 rounded-md">
                    <CheckCircle className="h-4 w-4 text-vet-sage mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-vet-brown">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Indicateurs de confiance */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-xs text-vet-brown/70">
            <span>
              Confiance de l'analyse: {Math.round((aiAnalysis.confidence_score || 0.7) * 100)}%
            </span>
            <span className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Analysé par IA vétérinaire
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
