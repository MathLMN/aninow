
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

// Public Pages
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import ContactPage from '@/pages/ContactPage';
import FeaturesPage from '@/pages/FeaturesPage';

// Booking Pages
import BookingStart from '@/pages/public/BookingStart';
import ConsultationReason from '@/pages/public/ConsultationReason';
import ConditionalQuestions from '@/pages/public/ConditionalQuestions';
import SymptomDuration from '@/pages/public/SymptomDuration';
import AdditionalConsultationPoints from '@/pages/public/AdditionalConsultationPoints';
import AnimalInfo from '@/pages/public/AnimalInfo';
import ClientComment from '@/pages/public/ClientComment';
import ContactInfo from '@/pages/public/ContactInfo';
import AppointmentSlots from '@/pages/public/AppointmentSlots';
import BookingConfirmation from '@/pages/public/BookingConfirmation';

// Vet Pages
import VetLogin from '@/pages/vet/VetLogin';
import VetDashboard from '@/pages/vet/VetDashboard';
import VetAppointments from '@/pages/vet/VetAppointments';
import VetPlanning from '@/pages/vet/VetPlanning';
import VetSchedule from '@/pages/vet/VetSchedule';
import VetSettings from '@/pages/vet/VetSettings';
import VetResetPassword from '@/pages/vet/VetResetPassword';
import VetLayout from '@/components/layout/VetLayout';
import VetAdvancedSettings from "@/pages/vet/VetAdvancedSettings";
import { EnhancedFirstLoginWelcome } from '@/components/clinic/EnhancedFirstLoginWelcome';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          
          {/* Booking Routes */}
          <Route path="/booking" element={<BookingStart />} />
          <Route path="/booking/consultation-reason" element={<ConsultationReason />} />
          <Route path="/booking/conditional-questions" element={<ConditionalQuestions />} />
          <Route path="/booking/symptom-duration" element={<SymptomDuration />} />
          <Route path="/booking/additional-points" element={<AdditionalConsultationPoints />} />
          <Route path="/booking/animal-info" element={<AnimalInfo />} />
          <Route path="/booking/client-comment" element={<ClientComment />} />
          <Route path="/booking/contact-info" element={<ContactInfo />} />
          <Route path="/booking/appointment-slots" element={<AppointmentSlots />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          
          {/* Vet Routes */}
          <Route path="/vet/login" element={<VetLogin />} />
          <Route path="/vet/first-login" element={<EnhancedFirstLoginWelcome />} />
          <Route path="/vet/reset-password" element={<VetResetPassword />} />
          <Route path="/vet" element={<VetLayout />}>
            <Route path="dashboard" element={<VetDashboard />} />
            <Route path="appointments" element={<VetAppointments />} />
            <Route path="planning" element={<VetPlanning />} />
            <Route path="schedule" element={<VetSchedule />} />
            <Route path="settings" element={<VetSettings />} />
            <Route path="advanced-settings" element={<VetAdvancedSettings />} />
          </Route>
          
          {/* Add more routes here as needed */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
