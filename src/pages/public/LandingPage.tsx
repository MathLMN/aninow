
import Header from "@/components/Header";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ArticlesSection from "@/components/landing/ArticlesSection";
import CTASection from "@/components/landing/CTASection";

const LandingPage = () => {
  return (
    <div className="min-h-screen font-poppins">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <ArticlesSection />
        <CTASection />
      </main>
    </div>
  );
};

export default LandingPage;
