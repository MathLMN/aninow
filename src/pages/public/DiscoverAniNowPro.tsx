import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Building2, Phone, Mail, MapPin, Users, CheckCircle, Star, Calendar, Clock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const DiscoverAniNowPro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    establishmentName: "",
    contactPersonName: "",
    contactPersonRole: "",
    contactEmail: "",
    contactPhone: "",
    addressStreet: "",
    addressCity: "",
    addressPostalCode: "",
    addressCountry: "France",
    numberOfVeterinarians: "",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('veterinary_practice_requests')
        .insert([{
          establishment_name: formData.establishmentName,
          contact_person_name: formData.contactPersonName,
          contact_person_role: formData.contactPersonRole,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          address_street: formData.addressStreet,
          address_city: formData.addressCity,
          address_postal_code: formData.addressPostalCode,
          address_country: formData.addressCountry,
          number_of_veterinarians: parseInt(formData.numberOfVeterinarians),
          notes: formData.notes || null
        }]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: "Demande envoyée avec succès",
        description: "Nous vous contacterons dans les plus brefs délais.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-vet-sage" />
            </div>
            <CardTitle className="text-2xl text-vet-navy">
              Demande envoyée avec succès !
            </CardTitle>
            <CardDescription className="text-vet-brown text-lg">
              Merci pour votre intérêt pour AniNow Pro
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-vet-brown">
              Nous avons bien reçu votre demande pour <strong>{formData.establishmentName}</strong>.
            </p>
            <p className="text-vet-brown">
              Notre équipe va examiner votre demande et vous contacter dans les plus brefs délais à l'adresse <strong>{formData.contactEmail}</strong>.
            </p>
            <div className="pt-4">
              <Link to="/">
                <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-vet-blue/30 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Heart className="h-8 w-8 text-vet-sage" />
              <span className="text-2xl font-bold text-vet-navy">AniNow</span>
            </Link>
            <Link to="/vet/login">
              <Button variant="outline" className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white">
                Connexion Vétérinaire
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-vet-navy mb-6">
            Découvrez AniNow Pro
          </h1>
          <p className="text-xl text-vet-brown max-w-3xl mx-auto mb-8">
            La solution complète de prise de rendez-vous en ligne pour les cliniques vétérinaires. 
            Simplifiez la gestion de vos rendez-vous et offrez une expérience moderne à vos clients.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-vet-blue/30 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-vet-sage mx-auto mb-4" />
              <CardTitle className="text-xl text-vet-navy">Planning Intelligent</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-vet-brown">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Gestion automatique des créneaux</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Synchronisation en temps réel</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Optimisation des plannings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-vet-blue/30 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-vet-sage mx-auto mb-4" />
              <CardTitle className="text-xl text-vet-navy">Expérience Client</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-vet-brown">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Formulaire intelligent</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Prise de RDV 24h/24</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Confirmation automatique</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-vet-blue/30 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-vet-sage mx-auto mb-4" />
              <CardTitle className="text-xl text-vet-navy">Sécurité & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-vet-brown">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Données sécurisées</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Support technique dédié</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-vet-sage mr-2" />Mises à jour gratuites</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Request Form */}
        <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-vet-navy mb-4">
              Demandez l'accès à AniNow Pro
            </CardTitle>
            <CardDescription className="text-lg text-vet-brown">
              Remplissez ce formulaire pour recevoir une démonstration personnalisée et découvrir comment AniNow Pro peut transformer votre pratique vétérinaire.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Establishment Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="establishmentName" className="text-vet-navy">Nom de l'établissement *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="establishmentName"
                      value={formData.establishmentName}
                      onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      placeholder="Clinique Vétérinaire des Champs"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfVeterinarians" className="text-vet-navy">Nombre de vétérinaires *</Label>
                  <Select value={formData.numberOfVeterinarians} onValueChange={(value) => handleInputChange('numberOfVeterinarians', value)} required>
                    <SelectTrigger className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 vétérinaire</SelectItem>
                      <SelectItem value="2">2 vétérinaires</SelectItem>
                      <SelectItem value="3">3 vétérinaires</SelectItem>
                      <SelectItem value="4">4 vétérinaires</SelectItem>
                      <SelectItem value="5">5 vétérinaires</SelectItem>
                      <SelectItem value="6">6+ vétérinaires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName" className="text-vet-navy">Nom du contact *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      placeholder="Dr. Martin Dubois"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonRole" className="text-vet-navy">Fonction *</Label>
                  <Select value={formData.contactPersonRole} onValueChange={(value) => handleInputChange('contactPersonRole', value)} required>
                    <SelectTrigger className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veterinaire">Vétérinaire</SelectItem>
                      <SelectItem value="directeur">Directeur/Propriétaire</SelectItem>
                      <SelectItem value="assistant">Assistant(e) vétérinaire</SelectItem>
                      <SelectItem value="secretaire">Secrétaire</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-vet-navy">Email professionnel *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      placeholder="contact@clinique-exemple.fr"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-vet-navy">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      placeholder="01 23 45 67 89"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addressStreet" className="text-vet-navy">Adresse *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="addressStreet"
                      value={formData.addressStreet}
                      onChange={(e) => handleInputChange('addressStreet', e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      placeholder="123 Rue de la Paix"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressCity" className="text-vet-navy">Ville *</Label>
                    <Input
                      id="addressCity"
                      value={formData.addressCity}
                      onChange={(e) => handleInputChange('addressCity', e.target.value)}
                      className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      placeholder="Paris"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressPostalCode" className="text-vet-navy">Code postal *</Label>
                    <Input
                      id="addressPostalCode"
                      value={formData.addressPostalCode}
                      onChange={(e) => handleInputChange('addressPostalCode', e.target.value)}
                      className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      placeholder="75001"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressCountry" className="text-vet-navy">Pays *</Label>
                    <Select value={formData.addressCountry} onValueChange={(value) => handleInputChange('addressCountry', value)} required>
                      <SelectTrigger className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Belgique">Belgique</SelectItem>
                        <SelectItem value="Suisse">Suisse</SelectItem>
                        <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-vet-navy">Besoins spécifiques ou questions</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                  placeholder="Décrivez vos besoins spécifiques, le nombre de rendez-vous par jour, ou toute question particulière..."
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Demander l'accès à AniNow Pro"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
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
