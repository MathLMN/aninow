
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from '@/components/ProgressBar';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';

const BookingStart = () => {
  return <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
      <Header />
      <main className="container mx-auto px-3 sm:px-6 pt-20 sm:pt-24 py-4 sm:py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentStep={1} totalSteps={7} />
          
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Prenez rendez-vous pour votre animal
            </h1>
            <p className="text-sm sm:text-base text-vet-brown/80 max-w-xl mx-auto leading-relaxed px-2">
              Commençons par quelques informations sur votre compagnon
            </p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg">
            <CardContent className="p-3 sm:p-6 lg:p-8">
              <BookingForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
};

export default BookingStart;
