
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ConditionalQuestionsHeaderProps {
  onBack: () => void;
}

const ConditionalQuestionsHeader = ({ onBack }: ConditionalQuestionsHeaderProps) => {
  return (
    <>
      {/* Bouton retour */}
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" onClick={onBack} className="text-vet-navy hover:bg-vet-beige/20 p-1 text-sm sm:p-2 sm:text-base -ml-2">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Retour
        </Button>
      </div>

      {/* Titre */}
      <div className="text-center mb-4 sm:mb-6 animate-fade-in">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-vet-navy mb-1 sm:mb-2 leading-tight">
          Quelques questions complémentaires
        </h1>
        <p className="text-sm sm:text-base text-vet-brown/80 px-2">Aidez-nous à mieux détecter l'urgence</p>
      </div>
    </>
  );
};

export default ConditionalQuestionsHeader;
