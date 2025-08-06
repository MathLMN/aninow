
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const value = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-4 sm:mb-6">
      <Progress value={value} className="h-1" />
    </div>
  );
};

export default ProgressBar;
