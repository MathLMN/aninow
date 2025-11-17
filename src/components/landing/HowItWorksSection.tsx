import shibaInusDuo from "@/assets/shiba-inus-duo.png";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Informations de l'animal",
      description: "Renseignez l'espèce, le nom et les détails de votre compagnon"
    },
    {
      number: "2", 
      title: "Motif de consultation",
      description: "Décrivez les symptômes ou le type de consultation souhaité"
    },
    {
      number: "3",
      title: "Choix du créneau",
      description: "Sélectionnez l'heure qui vous convient le mieux"
    },
    {
      number: "4",
      title: "Confirmation",
      description: "Recevez votre confirmation par email et SMS"
    }
  ];

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-br from-vet-beige/20 via-background to-background relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              4 étapes simples pour prendre rendez-vous
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Shiba Inus image with decorative frame */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-tl from-vet-beige/10 to-transparent z-10"></div>
                <img 
                  src={shibaInusDuo} 
                  alt="Duo de Shiba Inus adorables" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-vet-sage/20 rounded-full blur-3xl -z-10"></div>
            </div>
            
            {/* Steps grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="relative p-4 sm:p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:shadow-lg transition-all duration-300 hover:border-vet-beige/40"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-vet-sage text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
