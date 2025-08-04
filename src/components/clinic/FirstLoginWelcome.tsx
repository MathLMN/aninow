
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, KeyRound, CheckCircle, ArrowRight } from "lucide-react";
import { useVetAuth } from "@/hooks/useVetAuth";
import { useToast } from "@/hooks/use-toast";

export const FirstLoginWelcome = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { updatePassword } = useVetAuth();
  const { toast } = useToast();

  const handlePasswordChange = async (newPassword: string) => {
    if (newPassword.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de changer le mot de passe",
          variant: "destructive"
        });
        return;
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
            <div className="space-y-4">
              <Alert className="border-amber-300 bg-amber-50">
                <KeyRound className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Sécurité requise :</strong> Vous devez changer votre mot de passe provisoire pour continuer.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <label className="text-sm font-medium text-vet-navy">
                  Nouveau mot de passe (minimum 6 caractères)
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-vet-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-vet-sage"
                  placeholder="Entrez votre nouveau mot de passe"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      handlePasswordChange(target.value);
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handlePasswordChange(input.value);
                  }}
                  disabled={isChangingPassword}
                  className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white"
                >
                  {isChangingPassword ? 'Changement en cours...' : 'Changer le mot de passe'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
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
                onClick={() => window.location.href = '/vet/settings'}
                className="bg-vet-sage hover:bg-vet-sage/90 text-white"
              >
                Accéder aux paramètres
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
