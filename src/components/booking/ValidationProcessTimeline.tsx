import { CheckCircle } from "lucide-react";

export const ValidationProcessTimeline = () => {
  const steps = [
    {
      number: 1,
      label: "Demande reçue",
      status: "completed",
      description: "Enregistrée avec succès"
    },
    {
      number: 2,
      label: "Validation",
      status: "current",
      description: "Analyse en cours"
    },
    {
      number: 3,
      label: "Email",
      status: "pending",
      description: "Confirmation à venir"
    },
    {
      number: 4,
      label: "RDV confirmé",
      status: "pending",
      description: "Validation finale"
    }
  ];

  return (
    <div className="w-full py-2">
      {/* Frise horizontale chronologique */}
      <div className="relative px-2">
        {/* Ligne de progression */}
        <div className="absolute top-8 left-0 right-0 h-1.5 bg-vet-beige/30 rounded-full" />
        <div 
          className="absolute top-8 left-0 h-1.5 bg-gradient-to-r from-vet-sage to-vet-blue rounded-full transition-all duration-500"
          style={{ width: '25%' }}
        />
        
        {/* Étapes */}
        <div className="relative flex justify-between items-start gap-1">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isPending = step.status === "pending";
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                {/* Numéro / Check */}
                <div 
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 transition-all duration-300 ${
                    isCompleted 
                      ? "bg-vet-sage text-white shadow-lg" 
                      : isCurrent 
                      ? "bg-vet-blue text-white shadow-xl animate-pulse ring-4 ring-vet-blue/20" 
                      : "bg-white border-2 border-vet-beige/50 text-vet-brown/40"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <span className="text-2xl">{step.number}</span>
                  )}
                </div>
                
                {/* Label et description */}
                <div className="text-center px-1 w-full">
                  <p className={`text-sm sm:text-base font-bold mb-1 leading-tight ${
                    isCompleted || isCurrent ? "text-vet-navy" : "text-vet-brown/50"
                  }`}>
                    {step.label}
                  </p>
                  <p className={`text-xs sm:text-sm leading-snug ${
                    isCompleted || isCurrent ? "text-vet-brown/80" : "text-vet-brown/40"
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
