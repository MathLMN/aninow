
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Mail, Lock, Loader2, AlertCircle, Building2, Phone, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VetLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('🔄 Tentative de connexion vétérinaire...');
      
      const { data, error } = await supabase.functions.invoke('vet-auth', {
        body: {
          action: 'login',
          email,
          password
        }
      });

      console.log('📄 Réponse de la fonction:', { data, error });

      if (error) {
        console.error('❌ Erreur de la fonction edge:', error);
        throw new Error(error.message || 'Erreur de connexion');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Échec de la connexion');
      }

      console.log('✅ Connexion réussie');

      // Sauvegarder les informations de session
      localStorage.setItem('vet_session_token', data.session_token);
      localStorage.setItem('vet_user', JSON.stringify(data.clinic));
      localStorage.setItem('vet_session_expires', data.expires_at);

      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${data.clinic.name}!`,
      });

      navigate('/vet/dashboard');
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      
      let errorMessage = 'Erreur de connexion';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      if (errorMessage.includes('non-2xx status code')) {
        errorMessage = 'Problème de connexion au serveur. Veuillez réessayer.';
      } else if (errorMessage.includes('Identifiants invalides')) {
        errorMessage = 'Email ou mot de passe incorrect. Utilisez "vet123" comme mot de passe.';
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('🔄 Tentative de création de compte...');
      
      const { data, error } = await supabase.functions.invoke('vet-auth', {
        body: {
          action: 'create_account',
          email,
          password,
          clinic_name: clinicName,
          clinic_phone: clinicPhone,
          clinic_address: clinicAddress
        }
      });

      console.log('📄 Réponse de la fonction:', { data, error });

      if (error) {
        console.error('❌ Erreur de la fonction edge:', error);
        throw new Error(error.message || 'Erreur de création de compte');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Échec de la création de compte');
      }

      console.log('✅ Compte créé avec succès');

      // Sauvegarder les informations de session
      localStorage.setItem('vet_session_token', data.session_token);
      localStorage.setItem('vet_user', JSON.stringify(data.clinic));
      localStorage.setItem('vet_session_expires', data.expires_at);

      toast({
        title: "Compte créé avec succès",
        description: `Bienvenue, ${data.clinic.name}!`,
      });

      navigate('/vet/dashboard');
    } catch (error) {
      console.error('❌ Erreur de création de compte:', error);
      
      let errorMessage = 'Erreur de création de compte';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      if (errorMessage.includes('non-2xx status code')) {
        errorMessage = 'Problème de connexion au serveur. Veuillez réessayer.';
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erreur de création de compte",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Heart className="h-10 w-10 text-vet-sage" />
            <span className="text-2xl font-bold text-vet-navy">AniNow</span>
          </Link>
          <p className="text-vet-brown mt-2">Espace Vétérinaire</p>
        </div>

        {/* Formulaire */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vet-navy">
              {isCreateMode ? 'Créer un compte' : 'Connexion'}
            </CardTitle>
            <CardDescription className="text-vet-brown">
              {isCreateMode 
                ? 'Créez votre compte pour gérer votre clinique' 
                : 'Accédez à votre dashboard de gestion des rendez-vous'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Infos de démo */}
            <Alert className="mb-6 border-vet-blue/30 bg-vet-blue/10">
              <AlertCircle className="h-4 w-4 text-vet-blue" />
              <AlertDescription className="text-vet-navy text-sm">
                <strong>Démo:</strong> Utilisez n'importe quel email et le mot de passe "vet123"
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="mb-6 border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={isCreateMode ? handleCreateAccount : handleLogin} className="space-y-6">
              {isCreateMode && (
                <div className="space-y-2">
                  <Label htmlFor="clinic_name" className="text-vet-navy">Nom de la clinique *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="clinic_name"
                      type="text"
                      placeholder="Clinique Vétérinaire des Champs"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-vet-navy">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-vet-navy">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="vet123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isCreateMode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clinic_phone" className="text-vet-navy">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                      <Input
                        id="clinic_phone"
                        type="tel"
                        placeholder="01 23 45 67 89"
                        value={clinicPhone}
                        onChange={(e) => setClinicPhone(e.target.value)}
                        className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinic_address" className="text-vet-navy">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                      <Input
                        id="clinic_address"
                        type="text"
                        placeholder="123 Rue de la Paix, 75001 Paris"
                        value={clinicAddress}
                        onChange={(e) => setClinicAddress(e.target.value)}
                        className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isCreateMode ? 'Création en cours...' : 'Connexion en cours...'}
                  </>
                ) : (
                  isCreateMode ? 'Créer le compte' : 'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Button 
                variant="link" 
                className="text-vet-brown hover:text-vet-sage"
                onClick={() => setIsCreateMode(!isCreateMode)}
                disabled={isLoading}
              >
                {isCreateMode 
                  ? 'Déjà un compte ? Se connecter' 
                  : 'Pas de compte ? Créer un compte'
                }
              </Button>
              
              {!isCreateMode && (
                <div>
                  <Button variant="link" className="text-vet-brown hover:text-vet-sage">
                    Mot de passe oublié ?
                  </Button>
                </div>
              )}
            </div>
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

export default VetLogin;
