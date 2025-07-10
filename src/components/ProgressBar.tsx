
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
}

const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <Progress value={value} className="h-1" />
    </div>
  );
};

export default ProgressBar;
