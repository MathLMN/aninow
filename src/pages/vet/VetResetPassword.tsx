
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Heart, Lock, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useVetAuth } from "@/hooks/useVetAuth";
import { useIsMobile } from "@/hooks/use-mobile";

const VetResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, isLoading } = useVetAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const { error } = await updatePassword(newPassword);
    
    if (!error) {
      setIsSuccess(true);
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/vet/dashboard');
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto p-4 sm:p-6">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardContent className="p-4 sm:p-8 text-center">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-vet-navy mb-4">
                Mot de passe mis à jour !
              </h2>
              <p className="text-sm sm:text-base text-vet-brown mb-6">
                Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers le dashboard...
              </p>
              <Link to="/vet/dashboard">
                <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white w-full sm:w-auto">
                  Accéder au dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-vet-sage" />
            <span className="text-xl sm:text-2xl font-bold text-vet-navy">AniNow</span>
          </Link>
          <p className="text-sm sm:text-base text-vet-brown mt-2">Nouveau mot de passe</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-vet-navy">
              Réinitialiser votre mot de passe
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-vet-brown">
              Choisissez un nouveau mot de passe sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {error && (
              <Alert className="mb-4 sm:mb-6 border-red-300 bg-red-50">
                <AlertDescription className="text-red-800 text-xs sm:text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-vet-navy text-sm">Nouveau mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Au moins 6 caractères"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage text-sm"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-vet-navy text-sm">Confirmer le mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Répétez le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage text-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50 py-2 sm:py-3 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour en cours...
                  </>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4 sm:mt-6">
          <Link to="/vet/login">
            <Button variant="ghost" className="text-vet-brown hover:text-vet-navy text-sm">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Retour à la connexion
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VetResetPassword;
