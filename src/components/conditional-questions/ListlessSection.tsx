
import SelectionButton from "@/components/SelectionButton";
import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";

interface ListlessSectionProps {
  answers: {[key: string]: string | File | PhotoData};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const ListlessSection = ({ answers, onAnswerChange, keyPrefix = '' }: ListlessSectionProps) => {
  // Toutes les questions sont maintenant gérées par SharedQuestionsSection
  return null;
};

export default ListlessSection;
