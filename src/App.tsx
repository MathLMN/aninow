import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { ClinicProvider } from '@/contexts/ClinicContext';
import { ClinicWrapper } from '@/components/ClinicWrapper';

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
import VetSettings from '@/pages/vet/VetSettings';
import VetResetPassword from '@/pages/vet/VetResetPassword';
import VetLayout from '@/components/layout/VetLayout';
import VetAdvancedSettings from "@/pages/vet/VetAdvancedSettings";
import { EnhancedFirstLoginWelcome } from '@/components/clinic/EnhancedFirstLoginWelcome';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClinicProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            {/* Public Routes (non-clinic specific) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            
            {/* Legacy Booking Routes (redirect or fallback) */}
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
            
            {/* Multi-Tenant Booking Routes */}
            <Route path="/:clinicSlug/booking" element={
              <ClinicWrapper>
                <BookingStart />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/consultation-reason" element={
              <ClinicWrapper>
                <ConsultationReason />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/conditional-questions" element={
              <ClinicWrapper>
                <ConditionalQuestions />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/symptom-duration" element={
              <ClinicWrapper>
                <SymptomDuration />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/additional-points" element={
              <ClinicWrapper>
                <AdditionalConsultationPoints />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/animal-info" element={
              <ClinicWrapper>
                <AnimalInfo />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/client-comment" element={
              <ClinicWrapper>
                <ClientComment />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/contact-info" element={
              <ClinicWrapper>
                <ContactInfo />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/appointment-slots" element={
              <ClinicWrapper>
                <AppointmentSlots />
              </ClinicWrapper>
            } />
            <Route path="/:clinicSlug/booking/confirmation" element={
              <ClinicWrapper>
                <BookingConfirmation />
              </ClinicWrapper>
            } />
            
            {/* Vet Routes (unchanged) */}
            <Route path="/vet/login" element={<VetLogin />} />
            <Route path="/vet/first-login" element={<EnhancedFirstLoginWelcome />} />
            <Route path="/vet/reset-password" element={<VetResetPassword />} />
            <Route path="/vet" element={<VetLayout />}>
              <Route path="dashboard" element={<VetDashboard />} />
              <Route path="appointments" element={<VetAppointments />} />
              <Route path="planning" element={<VetPlanning />} />
              <Route path="settings" element={<VetSettings />} />
              <Route path="advanced-settings" element={<VetAdvancedSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ClinicProvider>
    </QueryClientProvider>
  );
}

export default App;
