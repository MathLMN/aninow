
import { Progress } from "@/components/ui/progress";

const ConditionalQuestionsHeader = () => {
  return (
    <div className="mb-4 sm:mb-6">
      {/* Barre de progression - Étape 3 sur 7 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-vet-blue/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm text-vet-brown/70 font-medium">
            Progression
          </span>
          <span className="text-xs sm:text-sm text-vet-brown/70 font-medium">
            3/7
          </span>
        </div>
        <Progress value={42.86} className="h-2" />
        <p className="text-xs text-vet-brown/60 mt-2 text-center">
          Questions complémentaires
        </p>
      </div>
    </div>
  );
};

export default ConditionalQuestionsHeader;
