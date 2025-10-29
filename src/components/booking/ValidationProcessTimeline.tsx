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
    <div className="w-full">
      {/* Frise horizontale chronologique */}
      <div className="relative">
        {/* Ligne de progression */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-vet-beige/30 rounded-full" />
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-vet-sage to-vet-blue rounded-full transition-all duration-500"
          style={{ width: '25%' }}
        />
        
        {/* Étapes */}
        <div className="relative flex justify-between items-start">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isPending = step.status === "pending";
            
            return (
              <div key={index} className="flex flex-col items-center" style={{ width: '25%' }}>
                {/* Numéro / Check */}
                <div 
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3 transition-all duration-300 ${
                    isCompleted 
                      ? "bg-vet-sage text-white shadow-lg scale-110" 
                      : isCurrent 
                      ? "bg-vet-blue text-white shadow-lg animate-pulse scale-110" 
                      : "bg-white border-2 border-vet-beige/50 text-vet-brown/40"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.number
                  )}
                </div>
                
                {/* Label et description */}
                <div className="text-center px-1">
                  <p className={`text-sm font-semibold mb-1 ${
                    isCompleted || isCurrent ? "text-vet-navy" : "text-vet-brown/50"
                  }`}>
                    {step.label}
                  </p>
                  <p className={`text-xs leading-tight ${
                    isCompleted || isCurrent ? "text-vet-brown/70" : "text-vet-brown/40"
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
