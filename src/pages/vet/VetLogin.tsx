
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VetLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        errorMessage = 'Email ou mot de passe incorrect. Contactez le support si vous avez besoin d\'aide.';
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
              Connexion
            </CardTitle>
            <CardDescription className="text-vet-brown">
              Accédez à votre dashboard de gestion des rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Infos de démo */}
            <Alert className="mb-6 border-vet-blue/30 bg-vet-blue/10">
              <AlertCircle className="h-4 w-4 text-vet-blue" />
              <AlertDescription className="text-vet-navy text-sm">
                <strong>Clients existants:</strong> Utilisez vos identifiants habituels
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

            <form onSubmit={handleLogin} className="space-y-6">
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
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    required
                    disabled={isLoading}
                  />
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
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Button variant="link" className="text-vet-brown hover:text-vet-sage">
                Mot de passe oublié ?
              </Button>
              
              <div className="pt-4 border-t border-vet-blue/20">
                <p className="text-sm text-vet-brown mb-3">
                  Vous n'avez pas encore accès à AniNow Pro ?
                </p>
                <Link to="/discover-aninow-pro">
                  <Button 
                    variant="outline" 
                    className="w-full border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white"
                  >
                    Découvrir AniNow Pro
                  </Button>
                </Link>
              </div>
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
