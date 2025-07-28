
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Public pages
import LandingPage from "./pages/public/LandingPage";
import BookingStart from "./pages/public/BookingStart";
import ConsultationReason from "./pages/public/ConsultationReason";
import AnimalInfo from "./pages/public/AnimalInfo";
import ConditionalQuestions from "./pages/public/ConditionalQuestions";
import AdditionalConsultationPoints from "./pages/public/AdditionalConsultationPoints";
import SymptomDuration from "./pages/public/SymptomDuration";
import ClientComment from "./pages/public/ClientComment";
import ContactInfo from "./pages/public/ContactInfo";
import AppointmentSlots from "./pages/public/AppointmentSlots";
import BookingConfirmation from "./pages/public/BookingConfirmation";
import ArticlesPage from "./pages/public/ArticlesPage";
import DiscoverAniNowPro from "./pages/public/DiscoverAniNowPro";

// Vet pages
import VetLayout from "./components/layout/VetLayout";
import VetLogin from "./pages/vet/VetLogin";
import VetDashboard from "./pages/vet/VetDashboard";
import VetAppointments from "./pages/vet/VetAppointments";
import VetPlanning from "./pages/vet/VetPlanning";
import VetSchedule from "./pages/vet/VetSchedule";
import VetSettings from "./pages/vet/VetSettings";

// Admin pages
import AdminLayout from "./components/layout/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPracticeRequests from "./pages/admin/AdminPracticeRequests";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/booking" element={<BookingStart />} />
            <Route path="/consultation-reason" element={<ConsultationReason />} />
            <Route path="/animal-info" element={<AnimalInfo />} />
            <Route path="/conditional-questions" element={<ConditionalQuestions />} />
            <Route path="/additional-points" element={<AdditionalConsultationPoints />} />
            <Route path="/symptom-duration" element={<SymptomDuration />} />
            <Route path="/client-comment" element={<ClientComment />} />
            <Route path="/contact-info" element={<ContactInfo />} />
            <Route path="/appointment-slots" element={<AppointmentSlots />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/discover-aninow-pro" element={<DiscoverAniNowPro />} />

            {/* Vet routes */}
            <Route path="/vet/login" element={<VetLogin />} />
            <Route path="/vet" element={<VetLayout />}>
              <Route path="dashboard" element={<VetDashboard />} />
              <Route path="appointments" element={<VetAppointments />} />
              <Route path="planning" element={<VetPlanning />} />
              <Route path="schedule" element={<VetSchedule />} />
              <Route path="settings" element={<VetSettings />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="practice-requests" element={<AdminPracticeRequests />} />
            </Route>

            {/* Fallback routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
