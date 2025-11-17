
import { Heart } from "lucide-react";
import ClinicAppointmentButton from "./ClinicAppointmentButton";

const CTASection = () => {
  return (
    <section className="bg-vet-navy py-8 sm:py-16">
      <div className="container mx-auto px-3 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Prêt à prendre rendez-vous ?
          </h2>
          <p className="text-vet-beige text-sm sm:text-lg mb-6 sm:mb-8">
            Votre vétérinaire vous attend. Commencez dès maintenant et obtenez 
            votre créneau en moins de 3 minutes.
          </p>
          
          <div className="flex justify-center">
            <ClinicAppointmentButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
