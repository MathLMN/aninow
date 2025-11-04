
import { Heart } from "lucide-react";
import ClinicAppointmentButton from "./ClinicAppointmentButton";
import catDogFriends from "@/assets/cat-dog-friends.png";

const CTASection = () => {
  return (
    <section className="bg-vet-navy py-8 sm:py-16">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Prêt à prendre rendez-vous ?
            </h2>
            <p className="text-vet-beige text-sm sm:text-lg mb-6 sm:mb-8">
              Votre vétérinaire vous attend. Commencez dès maintenant et obtenez 
              votre créneau en moins de 3 minutes.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <ClinicAppointmentButton />
            </div>
          </div>
          
          {/* Image du chien et du chat */}
          <div className="hidden lg:flex justify-center items-center">
            <img 
              src={catDogFriends} 
              alt="Chat et chien amis" 
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
