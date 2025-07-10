
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
    <section className="py-8 sm:py-16">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-vet-navy mb-3 sm:mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-vet-brown text-sm sm:text-lg max-w-2xl mx-auto">
            Seulement 4 étapes pour prendre votre rendez-vous
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-vet-sage text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-base sm:text-lg">
                  {step.number}
                </div>
                <h3 className="font-semibold text-vet-navy mb-2 text-sm sm:text-base">
                  {step.title}
                </h3>
                <p className="text-vet-brown text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
