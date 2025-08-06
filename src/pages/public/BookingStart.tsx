
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from '@/components/ProgressBar';
import { Header } from '@/components/Header';
import BookingForm from '@/components/BookingForm';

const BookingStart = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5">
      <Header />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        <ProgressBar currentStep={1} totalSteps={8} />
        
        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-vet-navy leading-tight">
              Prenez rendez-vous pour votre animal
            </h1>
            <p className="text-base sm:text-lg text-vet-brown/80 max-w-xl mx-auto leading-relaxed">
              Commençons par quelques informations sur votre compagnon
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <BookingForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingStart;
