
import SelectionButton from "@/components/SelectionButton";
import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";

interface LossOfAppetiteSectionProps {
  answers: {[key: string]: string | File | PhotoData};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const LossOfAppetiteSection = ({ answers, onAnswerChange, keyPrefix = '' }: LossOfAppetiteSectionProps) => {
  // Toutes les questions sont maintenant gérées par SharedQuestionsSection
  return null;
};

export default LossOfAppetiteSection;
