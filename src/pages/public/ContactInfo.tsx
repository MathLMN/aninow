
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBookingFormData } from "@/hooks/useBookingFormData";

const ContactInfo = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { bookingData, updateBookingData } = useBookingFormData();
  
  // États pour le statut client et les informations
  const [clientStatus, setClientStatus] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+33');
  const [dataConsent, setDataConsent] = useState(false);

  useEffect(() => {
    // Vérifier que les données du formulaire existent
    if (!bookingData.animalSpecies || !bookingData.clientName) {
      navigate('/booking');
      return;
    }
    
    // Récupérer les données existantes s'il y en a
    if (bookingData.clientStatus) setClientStatus(bookingData.clientStatus);
    if (bookingData.firstName) setFirstName(bookingData.firstName);
    if (bookingData.lastName) setLastName(bookingData.lastName);
    if (bookingData.clientPhone) setPhoneNumber(bookingData.clientPhone);
    if (bookingData.clientEmail) setEmail(bookingData.clientEmail);
    if (bookingData.phonePrefix) setPhonePrefix(bookingData.phonePrefix);
    if (bookingData.dataConsent) setDataConsent(bookingData.dataConsent);
  }, [bookingData, navigate]);

  const handleBack = () => {
    navigate('/booking/client-comment');
  };

  const handleNext = () => {
    if (!canProceed) return;

    // Mettre à jour les données avec les noms de champs corrects
    const updatedData = {
      clientStatus,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      clientName: `${firstName.trim()} ${lastName.trim()}`, // Nom complet pour compatibilité
      clientPhone: `${phonePrefix}${phoneNumber.trim()}`,
      clientEmail: email.trim(),
      phonePrefix,
      preferredContactMethod: 'phone', // Valeur par défaut
      dataConsent
    };
    
    updateBookingData(updatedData);
    console.log('Updated booking data with contact info:', updatedData);

    // Naviguer vers la page des créneaux
    navigate('/booking/appointment-slots');
  };

  // Validation : statut client requis, et si statut sélectionné, tous les champs requis
  const canProceed = clientStatus !== '' && 
    (clientStatus === '' || 
     (firstName.trim() !== '' && 
      lastName.trim() !== '' && 
      phoneNumber.trim() !== '' && 
      email.trim() !== '' && 
      dataConsent));

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Titre */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Vos coordonnées
            </h1>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg relative">
            <CardContent className="p-3 sm:p-6">
              {/* Bouton retour - À l'intérieur de la carte, en haut */}
              <div className="mb-4 sm:mb-6">
                <Button variant="ghost" onClick={handleBack} className="text-vet-navy hover:bg-vet-beige/20 p-2 text-sm sm:text-base -ml-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </div>

              <div className="space-y-6">
                {/* Statut client */}
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg font-semibold text-vet-navy block">
                    Vous êtes <span className="text-vet-navy ml-1">*</span>
                  </Label>
                  
                  <Select value={clientStatus} onValueChange={setClientStatus}>
                    <SelectTrigger className="w-full h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
                      <SelectValue placeholder="Cliquez et sélectionnez une option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-gray-200 shadow-xl z-50 rounded-lg">
                      <SelectItem value="existing-client" className="text-sm sm:text-base py-2 px-3 hover:bg-vet-beige/50 cursor-pointer">
                        Déjà client
                      </SelectItem>
                      <SelectItem value="new-client" className="text-sm sm:text-base py-2 px-3 hover:bg-vet-beige/50 cursor-pointer">
                        Nouveau client
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Champs de contact - Affichés seulement après sélection du statut */}
                {clientStatus && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base font-medium text-vet-navy">
                          Nom <span className="text-vet-navy ml-1">*</span>
                        </Label>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Votre nom"
                          className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base font-medium text-vet-navy">
                          Prénom <span className="text-vet-navy ml-1">*</span>
                        </Label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Votre prénom"
                          className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
                        />
                      </div>
                    </div>

                    {/* Téléphone et Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base font-medium text-vet-navy">
                          N° de téléphone <span className="text-vet-navy ml-1">*</span>
                        </Label>
                        <div className="flex">
                          <Select value={phonePrefix} onValueChange={setPhonePrefix}>
                            <SelectTrigger className="w-20 h-12 text-sm bg-white border-2 border-gray-200 rounded-l-lg border-r-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+33">+33</SelectItem>
                              <SelectItem value="+32">+32</SelectItem>
                              <SelectItem value="+41">+41</SelectItem>
                              <SelectItem value="+49">+49</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0123456789"
                            type="tel"
                            className="h-12 text-sm sm:text-base bg-white border-2 border-l-0 border-gray-200 rounded-r-lg rounded-l-none hover:border-vet-sage/50 focus:border-vet-sage transition-colors flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base font-medium text-vet-navy">
                          Adresse e-mail <span className="text-vet-navy ml-1">*</span>
                        </Label>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          type="email"
                          className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
                        />
                      </div>
                    </div>

                    {/* Consentement */}
                    <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Checkbox 
                        id="data-consent"
                        checked={dataConsent}
                        onCheckedChange={(checked) => setDataConsent(checked as boolean)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="data-consent" className="text-xs sm:text-sm text-vet-navy cursor-pointer leading-relaxed">
                        J'accepte que mes données soient utilisées afin d'être rappelé(e) dans le cadre de ma demande de RDV <span className="text-vet-navy">*</span>
                      </Label>
                    </div>

                    {/* Notice RGPD */}
                    <div className="text-xs text-gray-600 leading-relaxed italic p-3 bg-gray-50/50 rounded-lg">
                      Les informations recueillies sont nécessaires au traitement de votre demande et à l'envoi d'un email de confirmation. 
                      Elles sont transmises à la clinique vétérinaire et ne seront pas utilisées à d'autres fins. 
                      Conformément au RGPD, vous pouvez exercer votre droit d'accès, de rectification et de suppression en nous contactant à l'adresse aninow.team@gmail.com.
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Continuer - Desktop/Tablet: dans la card, Mobile: fixe */}
              {!isMobile && clientStatus && (
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                  <Button 
                    onClick={handleNext} 
                    disabled={!canProceed}
                    className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Choisir mon créneau
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bouton Continuer fixe en bas à droite - Mobile seulement */}
      {isMobile && clientStatus && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={handleNext} 
            disabled={!canProceed}
            className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Choisir mon créneau
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
