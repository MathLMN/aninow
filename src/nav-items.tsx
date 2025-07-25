
import { ReactNode } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/public/LandingPage";
import BookingStart from "./pages/public/BookingStart";
import AnimalInfo from "./pages/public/AnimalInfo";
import ConsultationReason from "./pages/public/ConsultationReason";
import ConditionalQuestions from "./pages/public/ConditionalQuestions";
import SymptomDuration from "./pages/public/SymptomDuration";
import AdditionalConsultationPoints from "./pages/public/AdditionalConsultationPoints";
import ClientComment from "./pages/public/ClientComment";
import ContactInfo from "./pages/public/ContactInfo";
import AppointmentSlots from "./pages/public/AppointmentSlots";
import BookingConfirmation from "./pages/public/BookingConfirmation";
import ArticlesPage from "./pages/public/ArticlesPage";
import VetLogin from "./pages/vet/VetLogin";

export interface NavItem {
  to: string;
  page: ReactNode;
}

export const navItems: NavItem[] = [
  {
    to: "/",
    page: <Index />,
  },
  {
    to: "/landing",
    page: <LandingPage />,
  },
  {
    to: "/booking-start",
    page: <BookingStart />,
  },
  {
    to: "/animal-info",
    page: <AnimalInfo />,
  },
  {
    to: "/consultation-reason",
    page: <ConsultationReason />,
  },
  {
    to: "/conditional-questions",
    page: <ConditionalQuestions />,
  },
  {
    to: "/symptom-duration",
    page: <SymptomDuration />,
  },
  {
    to: "/additional-consultation-points",
    page: <AdditionalConsultationPoints />,
  },
  {
    to: "/client-comment",
    page: <ClientComment />,
  },
  {
    to: "/contact-info",
    page: <ContactInfo />,
  },
  {
    to: "/appointment-slots",
    page: <AppointmentSlots />,
  },
  {
    to: "/booking-confirmation",
    page: <BookingConfirmation />,
  },
  {
    to: "/articles",
    page: <ArticlesPage />,
  },
  {
    to: "/vet/login",
    page: <VetLogin />,
  },
];
