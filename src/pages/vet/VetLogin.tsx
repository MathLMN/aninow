
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useVetAuth } from "@/hooks/useVetAuth";
import { useFirstLoginStatus } from "@/hooks/useFirstLoginStatus";
import { useEffect } from "react";

const VetLogin = () => {
  const navigate = useNavigate();
  const { signIn, isLoading, isAuthenticated, adminProfile, clinicAccess, user } = useVetAuth();
  const { needsFirstLogin, isLoading: firstLoginLoading } = useFirstLoginStatus();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Redirect logic
  useEffect(() => {
    const totalLoading = isLoading || firstLoginLoading;
    
    console.log('🔄 VetLogin useEffect - checking auth status:', {
      isAuthenticated,
      adminProfile: !!adminProfile,
      clinicAccess: !!clinicAccess,
      user: !!user,
      isLoading,
      firstLoginLoading,
      needsFirstLogin
    });

    if (totalLoading) {
      console.log('⏳ Still loading, waiting...');
      return;
    }

    if (!isAuthenticated) {
      console.log('❌ Not authenticated, staying on login page');
      return;
    }

    if (needsFirstLogin) {
      console.log('🔐 User needs first login, redirecting to first-login');
      navigate('/vet/first-login');
      return;
    }

    // User is authenticated and doesn't need first login
    console.log('🚀 User is authenticated, determining redirection...');
    
    if (adminProfile) {
      console.log('👨‍💼 Admin user detected, redirecting to settings');
      navigate('/vet/settings');
    } else if (clinicAccess) {
      console.log('🏥 Clinic user detected, redirecting to dashboard');
      navigate('/vet/dashboard');
    } else {
      console.log('⚠️ Authenticated but no valid profile found - staying on login');
    }
  }, [isAuthenticated, adminProfile, clinicAccess, user, navigate, isLoading, firstLoginLoading, needsFirstLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Starting login process for:', email);
    const { error } = await signIn(email, password);
    
    if (!error) {
      console.log('✅ Login successful, redirection will be handled by useEffect');
    } else {
      console.log('❌ Login failed:', error);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would be implemented when we add the reset functionality
    console.log('Password reset requested for:', resetEmail);
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Heart className="h-10 w-10 text-vet-sage" />
              <span className="text-2xl font-bold text-vet-navy">AniNow</span>
            </Link>
            <p className="text-vet-brown mt-2">Réinitialisation du mot de passe</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vet-navy">
                Mot de passe oublié ?
              </CardTitle>
              <CardDescription className="text-vet-brown">
                Entrez votre email pour recevoir un lien de réinitialisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-vet-navy">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="votre@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white"
                >
                  Envoyer le lien de réinitialisation
                </Button>

                <Button 
                  type="button"
                  variant="ghost"
                  className="w-full text-vet-brown hover:text-vet-navy"
                  onClick={() => setShowResetForm(false)}
                >
                  Retour à la connexion
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            {/* Infos de diagnostic */}
            <Alert className="mb-6 border-vet-blue/30 bg-vet-blue/10">
              <AlertCircle className="h-4 w-4 text-vet-blue" />
              <AlertDescription className="text-vet-navy text-sm">
                <strong>Système mis à jour:</strong> Gestion complète des mots de passe provisoires avec validation renforcée
              </AlertDescription>
            </Alert>

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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="text-sm text-vet-sage hover:text-vet-sage/80 underline"
                >
                  Mot de passe oublié ?
                </button>
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

            <div className="mt-6 text-center">
              <p className="text-sm text-vet-brown">
                Nos solutions vous intéressent ?{" "}
                <button 
                  onClick={() => {
                    window.open('https://aninowvet.fr/demandes-aninow-pro/', '_blank');
                  }}
                  className="text-vet-sage hover:text-vet-sage/80 font-medium underline transition-colors"
                >
                  Découvrez AniNow Pro
                </button>
              </p>
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
