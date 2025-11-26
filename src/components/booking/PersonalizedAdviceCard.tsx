import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Loader2, AlertCircle } from "lucide-react";

interface PersonalizedAdviceCardProps {
  advice: string | null;
  isLoading: boolean;
  error: string | null;
}

export const PersonalizedAdviceCard = ({ advice, isLoading, error }: PersonalizedAdviceCardProps) => {
  if (isLoading) {
    return (
      <Card className="bg-vet-sage/10 border-vet-sage/30 shadow-md animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-vet-navy flex items-center gap-2">
            <Heart className="h-5 w-5 text-vet-sage" />
            Conseils personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-vet-sage animate-spin" />
          </div>
          <p className="text-xs text-vet-brown/70 text-center">
            Génération de conseils personnalisés en cours...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-orange-50/70 border-orange-300/60 shadow-md animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-vet-navy flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Conseils indisponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-vet-brown leading-relaxed">
            Les conseils personnalisés ne peuvent pas être affichés pour le moment. 
            N'hésitez pas à contacter la clinique pour toute question en attendant la confirmation de votre rendez-vous.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!advice) {
    return null;
  }

  return (
    <Card className="bg-vet-sage/10 border-vet-sage/30 shadow-md animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-vet-navy flex items-center gap-2">
          <Heart className="h-5 w-5 text-vet-sage" />
          Conseils personnalisés en attendant votre rendez-vous
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div 
          className="text-xs text-vet-brown leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: advice }}
        />
        <div className="bg-white/60 rounded-lg p-3 border border-vet-sage/20 mt-4">
          <p className="text-[10px] text-vet-brown/70 leading-relaxed">
            <strong>Important :</strong> Ces conseils sont donnés à titre informatif. En cas de doute ou d'aggravation des symptômes, 
            contactez immédiatement la clinique.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
