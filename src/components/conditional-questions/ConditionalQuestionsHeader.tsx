

import { Progress } from "@/components/ui/progress";

const ConditionalQuestionsHeader = () => {
  return (
    <div className="mb-4 sm:mb-6">
      {/* Barre de progression simplifiée */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-sm border border-vet-blue/5">
        <Progress value={42.86} className="h-1" />
      </div>
    </div>
  );
};

export default ConditionalQuestionsHeader;

