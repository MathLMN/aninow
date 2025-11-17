
import { Heart } from "lucide-react";
import ClinicAppointmentButton from "./ClinicAppointmentButton";
import catDogFriends from "@/assets/cat-dog-friends.png";

const CTASection = () => {
  return (
    <section className="bg-vet-navy py-8 sm:py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-vet-sage/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-vet-beige/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-3 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Prêt à prendre rendez-vous ?
            </h2>
            <p className="text-vet-beige text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              Votre vétérinaire vous attend. Commencez dès maintenant et obtenez 
              votre créneau en moins de 3 minutes.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <ClinicAppointmentButton />
            </div>
          </div>
          
          {/* Image du chien et du chat avec effet */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-10"></div>
              <img 
                src={catDogFriends} 
                alt="Chat et chien amis - amitié entre animaux" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-vet-beige/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
