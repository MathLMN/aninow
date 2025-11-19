
import SelectionButton from "@/components/SelectionButton";
import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";

interface ExcessiveThirstSectionProps {
  answers: {[key: string]: string | File | PhotoData};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const ExcessiveThirstSection = ({ answers, onAnswerChange, keyPrefix = '' }: ExcessiveThirstSectionProps) => {
  // Toutes les questions sont maintenant gérées par SharedQuestionsSection
  return null;
};

export default ExcessiveThirstSection;
