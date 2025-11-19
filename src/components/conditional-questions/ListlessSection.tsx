
import SelectionButton from "@/components/SelectionButton";

interface ListlessSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const ListlessSection = ({ answers, onAnswerChange, keyPrefix = '' }: ListlessSectionProps) => {
  // Toutes les questions sont maintenant gérées par SharedQuestionsSection
  return null;
};

export default ListlessSection;
