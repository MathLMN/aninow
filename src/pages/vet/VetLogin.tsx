
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useVetAuth } from "@/hooks/useVetAuth";
import { useEffect } from "react";
import { ConfigModeToggle } from "@/components/vet/ConfigModeToggle";

const VetLogin = () => {
  const navigate = useNavigate();
  const { signIn, isLoading, isAuthenticated, veterinarian, adminProfile } = useVetAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showConfigMode, setShowConfigMode] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 User is authenticated, redirecting...', { veterinarian, adminProfile });
      
      if (adminProfile) {
        // Admin users go to settings page where they can access admin dashboard
        navigate('/vet/settings');
      } else if (veterinarian) {
        // Veterinarians go to dashboard
        navigate('/vet/dashboard');
      }
    }
  }, [isAuthenticated, veterinarian, adminProfile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Starting login process');
    const { error } = await signIn(email, password);
    
    if (!error) {
      console.log('✅ Login successful, redirection will be handled by useEffect');
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
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Login Form */}
          <div>
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
                {/* Infos de migration */}
                <Alert className="mb-6 border-vet-blue/30 bg-vet-blue/10">
                  <AlertCircle className="h-4 w-4 text-vet-blue" />
                  <AlertDescription className="text-vet-navy text-sm">
                    <strong>Nouveau système:</strong> Utilisez vos identifiants Supabase Auth pour vous connecter
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
                        // URL sera fournie plus tard
                        console.log('Redirection vers AniNow Pro');
                      }}
                      className="text-vet-sage hover:text-vet-sage/80 font-medium underline transition-colors"
                    >
                      Découvrez AniNow Pro
                    </button>
                  </p>
                </div>

                {/* Configuration Mode Toggle */}
                <div className="mt-6 pt-6 border-t border-vet-blue/30">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfigMode(!showConfigMode)}
                    className="w-full text-vet-brown hover:text-vet-navy text-xs"
                  >
                    Configuration du logiciel
                  </Button>
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

          {/* Right Column - Configuration Mode */}
          {showConfigMode && (
            <div>
              <ConfigModeToggle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetLogin;
