
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Pages publiques (formulaire de RDV)
import PublicBooking from "./pages/public/PublicBooking";
import ConsultationReason from "./pages/public/ConsultationReason";
import ConditionalQuestions from "./pages/public/ConditionalQuestions";
import AppointmentSlots from "./pages/public/AppointmentSlots";
import BookingConfirmation from "./pages/public/BookingConfirmation";

// Pages privées (dashboard cliniques)
import VetLogin from "./pages/vet/VetLogin";
import VetDashboard from "./pages/vet/VetDashboard";
import VetSchedule from "./pages/vet/VetSchedule";
import VetAppointments from "./pages/vet/VetAppointments";
import VetSettings from "./pages/vet/VetSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Page d'accueil - Formulaire de RDV */}
          <Route path="/" element={<PublicBooking />} />
          <Route path="/booking/reason" element={<ConsultationReason />} />
          <Route path="/booking/questions" element={<ConditionalQuestions />} />
          <Route path="/booking/slots" element={<AppointmentSlots />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          
          {/* Interface privée - Dashboard vétérinaires */}
          <Route path="/vet/login" element={<VetLogin />} />
          <Route path="/vet/dashboard" element={<VetDashboard />} />
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

export default App;
