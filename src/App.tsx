
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import NotFound from "./pages/NotFound";

// Page d'accueil - restaurer LandingPage comme page principale
import LandingPage from "./pages/public/LandingPage";

// Page Index déplacée vers route administrative
import Index from "./pages/Index";

// Pages publiques (formulaire de RDV)
import BookingStart from "./pages/public/BookingStart";
import ConsultationReason from "./pages/public/ConsultationReason";
import ConditionalQuestions from "./pages/public/ConditionalQuestions";
import SymptomDuration from "./pages/public/SymptomDuration";
import AdditionalConsultationPoints from "./pages/public/AdditionalConsultationPoints";
import AnimalInfo from "./pages/public/AnimalInfo";
import ClientComment from "./pages/public/ClientComment";
import ContactInfo from "./pages/public/ContactInfo";
import AppointmentSlots from "./pages/public/AppointmentSlots";
import BookingConfirmation from "./pages/public/BookingConfirmation";

// Pages privées (dashboard cliniques)
import VetLogin from "./pages/vet/VetLogin";
import VetDashboard from "./pages/vet/VetDashboard";
import VetSchedule from "./pages/vet/VetSchedule";
import VetPlanning from "./pages/vet/VetPlanning";
import VetAppointments from "./pages/vet/VetAppointments";
import VetSettings from "./pages/vet/VetSettings";

const App = () => {
  // Create QueryClient inside the component to ensure proper React context
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Page d'accueil - restaurer LandingPage */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Page administrative - déplacer Index ici */}
            <Route path="/admin" element={<Index />} />
            
            {/* Formulaire de RDV */}
            <Route path="/booking" element={<BookingStart />} />
            <Route path="/booking/reason" element={<ConsultationReason />} />
            <Route path="/booking/questions" element={<ConditionalQuestions />} />
            <Route path="/booking/duration" element={<SymptomDuration />} />
            <Route path="/booking/additional-points" element={<AdditionalConsultationPoints />} />
            <Route path="/booking/animal-info" element={<AnimalInfo />} />
            <Route path="/booking/comment" element={<ClientComment />} />
            <Route path="/booking/contact-info" element={<ContactInfo />} />
            <Route path="/booking/slots" element={<AppointmentSlots />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            
            {/* Interface privée - Dashboard vétérinaires */}
            <Route path="/vet/login" element={<VetLogin />} />
            <Route path="/vet/dashboard" element={<VetDashboard />} />
            <Route path="/vet/planning" element={<VetPlanning />} />
            <Route path="/vet/schedule" element={<VetSchedule />} />
            <Route path="/vet/appointments" element={<VetAppointments />} />
            <Route path="/vet/settings" element={<VetSettings />} />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
