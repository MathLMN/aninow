import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

// Public Pages
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import ContactPage from '@/pages/ContactPage';
import FeaturesPage from '@/pages/FeaturesPage';

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
          
          {/* Vet Routes */}
          <Route path="/vet/login" element={<VetLogin />} />
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
