
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle, Users, Calendar, BarChart3, AlertCircle } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setLoginError(""); // Réinitialiser l'erreur
    setIsSubmitting(true); // Démarrer le chargement
    
    console.log('🔄 Starting login process for:', email);
    const { error } = await signIn(email, password);
    
    setIsSubmitting(false); // Arrêter le chargement
    
    if (!error) {
      console.log('✅ Login successful, redirection will be handled by useEffect');
    } else {
      console.log('❌ Login failed:', error);
      setLoginError("Identifiant ou mot de passe incorrect. Veuillez réessayer.");
      setEmail(""); // Vider le champ email
      setPassword(""); // Vider le champ mot de passe
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would be implemented when we add the reset functionality
    console.log('Password reset requested for:', resetEmail);
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-vet-sage" />
              <span className="text-xl sm:text-2xl font-bold text-vet-navy">AniNow</span>
            </Link>
            <p className="text-vet-brown mt-2 text-sm sm:text-base">Réinitialisation du mot de passe</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl text-vet-navy">
                Mot de passe oublié ?
              </CardTitle>
              <CardDescription className="text-vet-brown text-sm sm:text-base">
                Entrez votre email pour recevoir un lien de réinitialisation
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handlePasswordReset} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-vet-navy text-sm sm:text-base">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="votre@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white text-sm sm:text-base py-2 sm:py-3"
                >
                  Envoyer le lien de réinitialisation
                </Button>

                <Button 
                  type="button"
                  variant="ghost"
                  className="w-full text-vet-brown hover:text-vet-navy text-sm sm:text-base"
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden bg-gradient-to-r from-vet-navy to-vet-blue p-4">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Heart className="h-8 w-8 text-vet-sage" />
            <span className="text-xl font-bold text-white">AniNow</span>
          </Link>
          <p className="text-white/90 mt-2 text-sm">Espace Vétérinaire</p>
        </div>
      </div>

      {/* Left Side - Login Form */}
      <div className="flex-1 bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-md mx-auto">
          {/* Logo - Hidden on mobile (shown in header instead) */}
          <div className="text-center mb-6 sm:mb-8 hidden lg:block">
            <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-vet-sage" />
              <span className="text-xl sm:text-2xl font-bold text-vet-navy">AniNow</span>
            </Link>
            <p className="text-vet-brown mt-2 text-sm sm:text-base">Espace Vétérinaire</p>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl text-vet-navy">
                Connexion
              </CardTitle>
              <CardDescription className="text-vet-brown text-sm sm:text-base">
                Accédez à votre dashboard de gestion des rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                {loginError && (
                  <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-vet-navy text-sm sm:text-base">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginError(""); // Réinitialiser l'erreur lors de la saisie
                      }}
                      className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage text-sm sm:text-base"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-vet-navy text-sm sm:text-base">Mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError(""); // Réinitialiser l'erreur lors de la saisie
                      }}
                      className="pl-10 pr-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage text-sm sm:text-base"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vet-brown hover:text-vet-navy transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-xs sm:text-sm text-vet-sage hover:text-vet-sage/80 underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm text-vet-brown">
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
          <div className="text-center mt-4 sm:mt-6">
            <Link to="/">
              <Button variant="ghost" className="text-vet-brown hover:text-vet-navy text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Commercial Section - Hidden on mobile, shown on large screens */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-vet-navy to-vet-blue items-center justify-center p-8 relative">
        <div className="max-w-lg text-center text-white space-y-6 lg:space-y-8">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
              Simplifiez la gestion de vos rendez-vous vétérinaires
            </h1>
            <p className="text-lg lg:text-xl text-white/90">
              Une solution intelligente pour optimiser votre temps et améliorer l'expérience client
            </p>
          </div>

          <div className="space-y-4 lg:space-y-6 text-left">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-vet-sage mt-1 flex-shrink-0" />
              <div>
                <p className="text-base lg:text-lg font-medium">Réduisez le temps passé au téléphone grâce à la prise de rendez-vous en ligne 24/7</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Users className="h-5 w-5 lg:h-6 lg:w-6 text-vet-sage mt-1 flex-shrink-0" />
              <div>
                <p className="text-base lg:text-lg font-medium">Améliorez la satisfaction client avec un système moderne et accessible</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-vet-sage mt-1 flex-shrink-0" />
              <div>
                <p className="text-base lg:text-lg font-medium">Optimisez votre planning avec une gestion intelligente et automatisée des créneaux</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-vet-sage mt-1 flex-shrink-0" />
              <div>
                <p className="text-base lg:text-lg font-medium">Concentrez-vous sur l'essentiel : soigner vos patients, pas gérer l'administratif</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={() => window.open('https://aninow.fr/', '_blank')}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 lg:px-8 py-2 lg:py-3 text-base lg:text-lg font-medium"
            >
              En savoir plus
            </Button>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-8 right-8 opacity-20">
          <Heart className="h-24 w-24 lg:h-32 lg:w-32 text-vet-sage" />
        </div>
      </div>
    </div>
  );
};

export default VetLogin;
