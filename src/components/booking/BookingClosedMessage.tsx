import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Mail, MapPin, ArrowLeft } from "lucide-react";
import { useClinicContext } from '@/contexts/ClinicContext';
import { usePublicClinicSettings } from '@/hooks/usePublicClinicSettings';

export const BookingClosedMessage = () => {
  const { currentClinic } = useClinicContext();
  const { settings } = usePublicClinicSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36% flex items-center justify-center p-4 sm:p-6">
      <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg">
        {/* Bouton retour */}
        <div className="p-4 sm:p-6 pb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 -ml-2 text-vet-brown/70 hover:text-vet-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Retour</span>
          </Button>
        </div>
        <CardHeader className="text-center space-y-3 sm:space-y-4 px-4 sm:px-6 pt-2 sm:pt-6">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-vet-sage/10 rounded-full flex items-center justify-center">
            <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-vet-sage" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-vet-navy leading-tight px-2">
            Prise de rendez-vous temporairement indisponible
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
          <Alert className="border-vet-blue/20 bg-vet-blue/5">
            <AlertTitle className="text-vet-navy text-base sm:text-lg">
              {settings?.clinic_name || currentClinic?.name || 'Notre clinique'}
            </AlertTitle>
            <AlertDescription className="text-vet-brown/80 mt-2 text-sm sm:text-base">
              La prise de rendez-vous en ligne n'est pas encore activée pour notre clinique.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
            <h3 className="font-semibold text-vet-navy text-base sm:text-lg">
              Pour prendre rendez-vous, contactez-nous directement :
            </h3>

            {settings?.clinic_phone && (
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-vet-sage/5 border border-vet-sage/20">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-vet-sage flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-vet-brown/70">Téléphone</p>
                  <a 
                    href={`tel:${settings.clinic_phone}`}
                    className="text-base sm:text-lg font-semibold text-vet-navy hover:text-vet-sage transition-colors block truncate"
                  >
                    {settings.clinic_phone}
                  </a>
                </div>
              </div>
            )}

            {settings?.clinic_email && (
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-vet-blue/5 border border-vet-blue/20">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-vet-blue flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-vet-brown/70">Email</p>
                  <a 
                    href={`mailto:${settings.clinic_email}`}
                    className="text-sm sm:text-base font-semibold text-vet-navy hover:text-vet-blue transition-colors block break-all"
                  >
                    {settings.clinic_email}
                  </a>
                </div>
              </div>
            )}

            {(settings?.clinic_address_street || settings?.clinic_address_city) && (
              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-vet-brown/5 border border-vet-brown/20">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-vet-brown flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-vet-brown/70">Adresse</p>
                  <p className="text-sm sm:text-base text-vet-navy">
                    {settings.clinic_address_street}
                    {settings.clinic_address_street && <br />}
                    {settings.clinic_address_postal_code} {settings.clinic_address_city}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center pt-3 sm:pt-4 border-t border-vet-blue/10">
            <p className="text-xs sm:text-sm text-vet-brown/60 px-2">
              Nous vous remercions de votre compréhension et avons hâte de vous accueillir !
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
