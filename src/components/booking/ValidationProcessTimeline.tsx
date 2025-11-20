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
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="relative flex items-center justify-between px-4">
        {/* Ligne de fond */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-vet-beige/40" />
        {/* Ligne de progression */}
        <div 
          className="absolute top-5 left-8 h-0.5 bg-vet-sage transition-all duration-700 ease-out"
          style={{ width: 'calc(33.33% - 2rem)' }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={index} className="relative flex flex-col items-center z-10 flex-1">
              {/* Badge numéroté */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted 
                    ? "bg-vet-sage text-white shadow-md" 
                    : isCurrent 
                    ? "bg-vet-blue text-white shadow-lg scale-110" 
                    : "bg-vet-beige/30 text-vet-brown/50"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" strokeWidth={2.5} />
                ) : (
                  step.number
                )}
              </div>
              
              {/* Label */}
              <p className={`mt-2 text-xs font-medium text-center leading-tight px-1 ${
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
