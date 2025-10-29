import { CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendedActionsCardProps {
  actions: string[];
  urgencyScore: number;
}

export const RecommendedActionsCard = ({ actions, urgencyScore }: RecommendedActionsCardProps) => {
  // Déterminer le titre en fonction de l'urgence
  const getTitle = () => {
    if (urgencyScore >= 8) {
      return "⚠️ Conseils importants avant la consultation";
    }
    if (urgencyScore >= 5) {
      return "Nos conseils en attendant le rendez-vous";
    }
    return "Nos conseils pour préparer la consultation";
  };

  // Couleur de l'encadré selon l'urgence
  const getBorderColor = () => {
    if (urgencyScore >= 8) return "border-orange-500";
    if (urgencyScore >= 5) return "border-vet-sage";
    return "border-vet-mint";
  };

  const getBgColor = () => {
    if (urgencyScore >= 8) return "bg-orange-50";
    if (urgencyScore >= 5) return "bg-vet-sage/10";
    return "bg-vet-mint/10";
  };

  // Icône selon l'urgence
  const Icon = urgencyScore >= 8 ? AlertTriangle : CheckCircle;
  const iconColor = urgencyScore >= 8 ? "text-orange-600" : "text-vet-sage";

  return (
    <Card className={`${getBgColor()} ${getBorderColor()} border-2 shadow-lg mb-6`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-vet-navy flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {actions.map((action, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-vet-sage flex-shrink-0 mt-0.5" />
              <span className="text-sm text-vet-brown leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
