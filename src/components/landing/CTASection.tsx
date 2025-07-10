
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
          
          <Link to="/booking">
            <Button 
              size="lg"
              className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Heart className="mr-2 h-5 w-5" />
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
