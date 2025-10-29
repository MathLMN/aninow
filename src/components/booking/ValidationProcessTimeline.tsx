import { CheckCircle, Clock, Mail, Calendar } from "lucide-react";

export const ValidationProcessTimeline = () => {
  const steps = [
    {
      icon: CheckCircle,
      label: "Demande reçue",
      status: "completed",
      description: "Votre demande a été enregistrée"
    },
    {
      icon: Clock,
      label: "Validation en cours",
      status: "current",
      description: "Notre équipe analyse votre demande"
    },
    {
      icon: Mail,
      label: "Confirmation par email",
      status: "pending",
      description: "Vous recevrez un email de confirmation"
    },
    {
      icon: Calendar,
      label: "Rendez-vous confirmé",
      status: "pending",
      description: "Votre rendez-vous est validé"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Desktop: Timeline horizontale */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Ligne de connexion */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-vet-beige/30 -z-10" />
        <div className="absolute top-5 left-0 w-1/4 h-0.5 bg-vet-sage -z-10" />
        
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted 
                    ? "bg-vet-sage text-white" 
                    : isCurrent 
                    ? "bg-vet-blue text-white animate-pulse" 
                    : "bg-vet-beige/30 text-vet-brown/50"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className={`text-sm font-medium text-center ${
                isCompleted || isCurrent ? "text-vet-navy" : "text-vet-brown/50"
              }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile: Timeline verticale */}
      <div className="md:hidden space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={index} className="flex items-start gap-3">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? "bg-vet-sage text-white" 
                    : isCurrent 
                    ? "bg-vet-blue text-white" 
                    : "bg-vet-beige/30 text-vet-brown/50"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isCompleted || isCurrent ? "text-vet-navy" : "text-vet-brown/50"
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-vet-brown/70 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
