import { CheckCircle } from "lucide-react";

export const ValidationProcessTimeline = () => {
  const steps = [
    {
      number: "1",
      label: "Demande reçue",
      status: "completed"
    },
    {
      number: "2",
      label: "Validation ou rappel si urgence",
      status: "current"
    },
    {
      number: "3",
      label: "SMS & Email de confirmation",
      status: "pending"
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      <div className="relative flex items-center justify-between px-2">
        {/* Ligne de fond */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-vet-beige/40" />
        {/* Ligne de progression */}
        <div 
          className="absolute top-4 left-6 h-0.5 bg-vet-sage transition-all duration-700 ease-out"
          style={{ width: 'calc(33.33% - 1.5rem)' }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={index} className="relative flex flex-col items-center z-10 flex-1">
              {/* Badge numéroté */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted 
                    ? "bg-vet-sage text-white shadow-md" 
                    : isCurrent 
                    ? "bg-vet-blue text-white shadow-lg scale-110" 
                    : "bg-vet-beige/30 text-vet-brown/50"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  step.number
                )}
              </div>
              
              {/* Label */}
              <p className={`mt-1 text-[10px] font-medium text-center leading-tight px-0.5 ${
                isCompleted || isCurrent ? "text-vet-navy" : "text-vet-brown/50"
              }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
