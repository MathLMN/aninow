
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
}

const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-sm border border-vet-blue/5">
        <Progress value={value} className="h-1" />
      </div>
    </div>
  );
};

export default ProgressBar;
