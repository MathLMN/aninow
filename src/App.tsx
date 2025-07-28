
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookingStart from "./pages/public/BookingStart";
import AnimalInfo from "./pages/public/AnimalInfo";
import ConsultationReason from "./pages/public/ConsultationReason";
import ConditionalQuestions from "./pages/public/ConditionalQuestions";
import AdditionalConsultationPoints from "./pages/public/AdditionalConsultationPoints";
import SymptomDuration from "./pages/public/SymptomDuration";
import ContactInfo from "./pages/public/ContactInfo";
import ClientComment from "./pages/public/ClientComment";
import AppointmentSlots from "./pages/public/AppointmentSlots";
import BookingConfirmation from "./pages/public/BookingConfirmation";
import LandingPage from "./pages/public/LandingPage";
import ArticlesPage from "./pages/public/ArticlesPage";
import DiscoverAniNowPro from "./pages/public/DiscoverAniNowPro";
import VetLogin from "./pages/vet/VetLogin";
import VetDashboard from "./pages/vet/VetDashboard";
import VetPlanning from "./pages/vet/VetPlanning";
import VetAppointments from "./pages/vet/VetAppointments";
import VetSchedule from "./pages/vet/VetSchedule";
import VetSettings from "./pages/vet/VetSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Page d'accueil principale */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Page des articles */}
            <Route path="/articles" element={<ArticlesPage />} />
            
            {/* Page Découvrir AniNow Pro */}
            <Route path="/discover-aninow-pro" element={<DiscoverAniNowPro />} />
            
            {/* Processus de réservation */}
            <Route path="/booking" element={<BookingStart />} />
            <Route path="/booking/animal-info" element={<AnimalInfo />} />
            <Route path="/booking/consultation-reason" element={<ConsultationReason />} />
            <Route path="/booking/conditional-questions" element={<ConditionalQuestions />} />
            <Route path="/booking/additional-points" element={<AdditionalConsultationPoints />} />
            <Route path="/booking/symptom-duration" element={<SymptomDuration />} />
            <Route path="/booking/contact-info" element={<ContactInfo />} />
            <Route path="/booking/client-comment" element={<ClientComment />} />
            <Route path="/booking/appointment-slots" element={<AppointmentSlots />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            
            {/* Interface vétérinaire */}
            <Route path="/vet/login" element={<VetLogin />} />
            <Route path="/vet/dashboard" element={<VetDashboard />} />
            <Route path="/vet/planning" element={<VetPlanning />} />
            <Route path="/vet/appointments" element={<VetAppointments />} />
            <Route path="/vet/schedule" element={<VetSchedule />} />
            <Route path="/vet/settings" element={<VetSettings />} />
            
            {/* Page de démarrage (redirection) */}
            <Route path="/start" element={<Index />} />
            
            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
