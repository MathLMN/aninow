
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Building2, MapPin, User, Phone, Mail, Users, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DiscoverAniNowPro = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    establishmentName: "",
    addressStreet: "",
    addressCity: "",
    addressPostalCode: "",
    contactPersonName: "",
    contactPersonRole: "",
    contactPhone: "",
    contactEmail: "",
    numberOfVeterinarians: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔄 Soumission de la demande d\'accès...');
      
      const { error } = await supabase
        .from('veterinary_practice_requests')
        .insert({
          establishment_name: formData.establishmentName,
          address_street: formData.addressStreet,
          address_city: formData.addressCity,
          address_postal_code: formData.addressPostalCode,
          contact_person_name: formData.contactPersonName,
          contact_person_role: formData.contactPersonRole,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          number_of_veterinarians: parseInt(formData.numberOfVeterinarians)
        });

      if (error) {
        console.error('❌ Erreur lors de la soumission:', error);
        throw new Error('Erreur lors de la soumission de votre demande');
      }

      console.log('✅ Demande soumise avec succès');
      setIsSubmitted(true);

      toast({
        title: "Demande envoyée avec succès",
        description: "Nous vous recontacterons dans les plus brefs délais.",
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      let errorMessage = 'Erreur lors de la soumission';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Heart className="h-10 w-10 text-vet-sage" />
              <span className="text-2xl font-bold text-vet-navy">AniNow</span>
            </Link>
          </div>

          {/* Message de confirmation */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-vet-navy">Demande envoyée !</CardTitle>
              <CardDescription className="text-vet-brown">
                Votre demande d'accès à AniNow Pro a été transmise avec succès.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-vet-brown">
                Notre équipe va examiner votre demande et vous recontacter dans les plus brefs délais 
                pour finaliser la configuration de votre compte.
              </p>
              
              <div className="pt-4">
                <Link to="/">
                  <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Heart className="h-10 w-10 text-vet-sage" />
            <span className="text-2xl font-bold text-vet-navy">AniNow</span>
          </Link>
        </div>

        {/* Formulaire */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-vet-navy">Découvrir AniNow Pro</CardTitle>
            <CardDescription className="text-vet-brown text-lg">
              Simplifiez la gestion de vos rendez-vous vétérinaires avec notre solution professionnelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Bénéfices */}
            <div className="mb-8 p-6 bg-vet-blue/10 rounded-lg">
              <h3 className="text-xl font-semibold text-vet-navy mb-4">Pourquoi choisir AniNow Pro ?</h3>
              <ul className="space-y-2 text-vet-brown">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vet-sage mr-2 mt-0.5 flex-shrink-0" />
                  <span>Prise de rendez-vous en ligne 24h/24 et 7j/7</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vet-sage mr-2 mt-0.5 flex-shrink-0" />
                  <span>Gestion automatisée des créneaux et des disponibilités</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vet-sage mr-2 mt-0.5 flex-shrink-0" />
                  <span>Analyse IA pour évaluer l'urgence des consultations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vet-sage mr-2 mt-0.5 flex-shrink-0" />
                  <span>Interface intuitive pour vos clients et votre équipe</span>
                </li>
              </ul>
            </div>

            <Alert className="mb-6 border-vet-blue/30 bg-vet-blue/10">
              <AlertDescription className="text-vet-navy text-sm">
                Remplissez le formulaire ci-dessous pour recevoir un accès à AniNow Pro. 
                Notre équipe vous contactera pour finaliser la configuration.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de l'établissement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-vet-navy border-b border-vet-blue/20 pb-2">
                  Informations de l'établissement
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="establishmentName" className="text-vet-navy">Nom de l'établissement *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="establishmentName"
                      type="text"
                      placeholder="Clinique Vétérinaire des Champs"
                      value={formData.establishmentName}
                      onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressStreet" className="text-vet-navy">Adresse *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="addressStreet"
                      type="text"
                      placeholder="123 Rue de la Paix"
                      value={formData.addressStreet}
                      onChange={(e) => handleInputChange('addressStreet', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressCity" className="text-vet-navy">Ville *</Label>
                    <Input
                      id="addressCity"
                      type="text"
                      placeholder="Paris"
                      value={formData.addressCity}
                      onChange={(e) => handleInputChange('addressCity', e.target.value)}
                      className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressPostalCode" className="text-vet-navy">Code postal *</Label>
                    <Input
                      id="addressPostalCode"
                      type="text"
                      placeholder="75001"
                      value={formData.addressPostalCode}
                      onChange={(e) => handleInputChange('addressPostalCode', e.target.value)}
                      className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Personne de contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-vet-navy border-b border-vet-blue/20 pb-2">
                  Personne de contact
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName" className="text-vet-navy">Nom et prénom *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="contactPersonName"
                      type="text"
                      placeholder="Dr. Marie Dupont"
                      value={formData.contactPersonName}
                      onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonRole" className="text-vet-navy">Fonction *</Label>
                  <Input
                    id="contactPersonRole"
                    type="text"
                    placeholder="Vétérinaire responsable"
                    value={formData.contactPersonRole}
                    onChange={(e) => handleInputChange('contactPersonRole', e.target.value)}
                    className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-vet-navy">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="01 23 45 67 89"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-vet-navy">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@clinique.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations sur l'équipe */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-vet-navy border-b border-vet-blue/20 pb-2">
                  Informations sur l'équipe
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="numberOfVeterinarians" className="text-vet-navy">Nombre de vétérinaires *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="numberOfVeterinarians"
                      type="number"
                      min="1"
                      placeholder="3"
                      value={formData.numberOfVeterinarians}
                      onChange={(e) => handleInputChange('numberOfVeterinarians', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer ma demande'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Retour */}
        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="ghost" className="text-vet-brown hover:text-vet-navy">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiscoverAniNowPro;
