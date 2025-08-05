
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Building2, KeyRound, CheckCircle, ArrowRight, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { useVetAuth } from "@/hooks/useVetAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const EnhancedFirstLoginWelcome = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCompletingSetup, setIsCompletingSetup] = useState(false);
  const { updatePassword, user } = useVetAuth();
  const { toast } = useToast();

  const validatePassword = (pwd: string): PasswordValidation => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    };
  };

  const validation = validatePassword(password);
  const isPasswordValid = Object.values(validation).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
  const canProceed = isPasswordValid && passwordsMatch;

  const getPasswordStrength = () => {
    const validCount = Object.values(validation).filter(Boolean).length;
    return (validCount / 5) * 100;
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength < 40) return "Faible";
    if (strength < 80) return "Moyenne";
    return "Forte";
  };

  const handlePasswordChange = async () => {
    if (!canProceed) {
      toast({
        title: "Mot de passe invalide",
        description: "Veuillez respecter tous les critères de sécurité",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de changer le mot de passe",
          variant: "destructive"
        });
        return;
      }

      // Update the password_changed flag in admin_clinic_creations
      if (user) {
        const { error: updateError } = await supabase
          .from('admin_clinic_creations')
          .update({ 
            password_changed: true,
            updated_at: new Date().toISOString()
          })
          .eq('clinic_user_id', user.id);

        if (updateError) {
          console.error('Error updating password changed status:', updateError);
        }
      }

      toast({
        title: "Mot de passe changé",
        description: "Votre mot de passe a été mis à jour avec succès",
      });

      setCurrentStep(2);
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCompleteSetup = async () => {
    setIsCompletingSetup(true);
    try {
      if (user) {
        // Mark first login as completed
        const { error } = await supabase
          .from('admin_clinic_creations')
          .update({ 
            first_login_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('clinic_user_id', user.id);

        if (error) {
          console.error('Error updating first login status:', error);
        }

        // Update user metadata to remove provisional password flags
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            provisional_password: false,
            first_login: false
          }
        });

        if (metadataError) {
          console.error('Error updating user metadata:', metadataError);
        }
      }

      // Redirect to settings
      window.location.href = '/vet/settings';
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la finalisation",
        variant: "destructive"
      });
    } finally {
      setIsCompletingSetup(false);
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
      <Check className={`h-3 w-3 ${isValid ? 'text-green-600' : 'text-gray-300'}`} />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-sage/20 to-vet-blue/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-vet-sage/20 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-vet-sage" />
          </div>
          <CardTitle className="text-2xl text-vet-navy">
            Bienvenue dans votre espace clinique !
          </CardTitle>
          <p className="text-vet-brown">
            Finalisons la configuration de votre compte en quelques étapes simples
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Étape 1: Changement de mot de passe */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Alert className="border-amber-300 bg-amber-50">
                <KeyRound className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Sécurité requise :</strong> Vous devez changer votre mot de passe provisoire pour continuer.
                </AlertDescription>
              </Alert>

              {/* Nouveau mot de passe */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-vet-navy">
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Indicateur de force */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Force du mot de passe</span>
                      <span className={`text-xs font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <Progress value={getPasswordStrength()} className="h-2" />
                  </div>
                )}
              </div>

              {/* Confirmation du mot de passe */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-vet-navy">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Validation des mots de passe identiques */}
                {confirmPassword && (
                  <div className={`flex items-center space-x-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>
                      {passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
                    </span>
                  </div>
                )}
              </div>

              {/* Critères de validation */}
              {password && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-vet-navy text-sm">Critères de sécurité :</h4>
                  <div className="grid grid-cols-1 gap-1">
                    <ValidationItem isValid={validation.minLength} text="Au moins 8 caractères" />
                    <ValidationItem isValid={validation.hasUppercase} text="Au moins une majuscule" />
                    <ValidationItem isValid={validation.hasLowercase} text="Au moins une minuscule" />
                    <ValidationItem isValid={validation.hasNumber} text="Au moins un chiffre" />
                    <ValidationItem isValid={validation.hasSpecialChar} text="Au moins un caractère spécial" />
                  </div>
                </div>
              )}

              <Button
                onClick={handlePasswordChange}
                disabled={!canProceed || isChangingPassword}
                className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50"
              >
                {isChangingPassword ? 'Changement en cours...' : 'Changer le mot de passe'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Étape 2: Configuration terminée */}
          {currentStep === 2 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-vet-navy">Configuration terminée !</h3>
                <p className="text-vet-brown">
                  Votre compte est maintenant sécurisé. Vous pouvez accéder à toutes les fonctionnalités de gestion de votre clinique.
                </p>
              </div>

              <div className="bg-vet-blue/10 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-vet-navy">Prochaines étapes :</h4>
                <ul className="text-sm text-vet-brown space-y-1">
                  <li>• Configurez les informations de votre clinique</li>
                  <li>• Ajoutez vos vétérinaires</li>
                  <li>• Définissez vos horaires de consultation</li>
                  <li>• Commencez à recevoir des réservations</li>
                </ul>
              </div>

              <Button
                onClick={handleCompleteSetup}
                disabled={isCompletingSetup}
                className="bg-vet-sage hover:bg-vet-sage/90 text-white"
              >
                {isCompletingSetup ? 'Finalisation...' : 'Accéder aux paramètres'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
