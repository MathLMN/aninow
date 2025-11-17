
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Informations de l'animal",
      description: "Renseignez l'espèce, le nom et les détails de votre compagnon"
    },
    {
      number: "02", 
      title: "Motif de consultation",
      description: "Décrivez les symptômes ou le type de consultation souhaité"
    },
    {
      number: "03",
      title: "Choix du créneau",
      description: "Sélectionnez l'heure qui vous convient le mieux"
    },
    {
      number: "04",
      title: "Confirmation",
      description: "Recevez votre confirmation par email et SMS"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-vet-blue/5 to-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-4 py-1.5 bg-vet-blue/20 rounded-full mb-4">
            <span className="text-vet-navy text-sm font-semibold">Simple et rapide</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-vet-navy mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-vet-brown text-lg max-w-2xl mx-auto">
            Seulement 4 étapes pour prendre votre rendez-vous
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-6 sm:p-8 text-center border-2 border-vet-blue/10 hover:border-vet-blue/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-vet-blue to-vet-sage rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                </div>
                <h3 className="font-bold text-vet-navy text-lg mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-vet-brown text-sm leading-relaxed">
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
