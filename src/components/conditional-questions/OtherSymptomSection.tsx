import SharedQuestionsSection from "@/components/conditional-questions/SharedQuestionsSection";
import { Separator } from "@/components/ui/separator";
import MultiPhotoUpload from "./MultiPhotoUpload";

interface OtherSymptomSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  onFileChange: (questionKey: string, file: File | null) => void;
  keyPrefix?: string;
}

const OtherSymptomSection = ({ 
  answers, 
  onAnswerChange, 
  onFileChange, 
  keyPrefix = '' 
}: OtherSymptomSectionProps) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Réutiliser toutes les questions génériques existantes */}
      <SharedQuestionsSection
        answers={answers}
        onAnswerChange={onAnswerChange}
        keyPrefix={keyPrefix}
        needsGeneralForm={true}
        needsEating={true}
        needsDrinking={true}
        needsPainComplaints={true}
      />

      <Separator className="mt-6 sm:mt-8" />

      {/* Section upload photo - Question #5 */}
      <div className="space-y-3 sm:space-y-6">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-base font-bold">
              5
            </div>
            <h3 className="text-sm sm:text-lg text-foreground font-semibold text-left flex-1 pt-0.5">
              📸 Photos du symptôme
              <span className="text-sm text-muted-foreground ml-2 font-normal">(optionnel mais recommandé)</span>
            </h3>
          </div>
          <div className="w-full p-2 bg-blue-50 border-l-4 border-blue-400 rounded ml-0 sm:ml-10">
            <p className="text-xs text-blue-800 text-left flex items-start gap-2">
              <span className="text-sm">💡</span>
              <span>Les photos permettent au vétérinaire de mieux comprendre la situation et de préparer votre consultation.</span>
            </p>
          </div>
        </div>
        
        <MultiPhotoUpload
          photoKey="other_photo"
          keyPrefix={keyPrefix}
          answers={answers}
          onFileChange={onFileChange}
          maxPhotos={3}
        />
      </div>
    </div>
  );
};

export default OtherSymptomSection;
