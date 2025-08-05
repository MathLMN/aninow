
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAdvancedVetAuth } from "@/hooks/useAdvancedVetAuth";
import { useToast } from "@/hooks/use-toast";

const PasswordChangeForm = () => {
  const { toast } = useToast();
  const { changePassword } = useAdvancedVetAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    // Validation des mots de passe
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Tentative de changement de mot de passe...');
      
      const { error } = await changePassword(currentPassword, newPassword);

      if (error) {
        console.error('❌ Erreur de changement de mot de passe:', error);
        throw error;
      }

      console.log('✅ Mot de passe changé avec succès');
      
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été changé avec succès",
      });

    } catch (error) {
      console.error('❌ Erreur de changement de mot de passe:', error);
      
      let errorMessage = 'Erreur lors du changement de mot de passe';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      if (errorMessage.includes('Mot de passe actuel incorrect')) {
        errorMessage = 'Le mot de passe actuel est incorrect';
      } else if (errorMessage.includes('Session invalide') || errorMessage.includes('Utilisateur non authentifié')) {
        errorMessage = 'Votre session a expiré, veuillez vous reconnecter';
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-vet-navy">Changer le mot de passe</CardTitle>
        <CardDescription>
          Modifiez votre mot de passe pour sécuriser votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-6 border-green-300 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Mot de passe modifié avec succès !
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-300 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password" className="text-vet-navy">
              Mot de passe actuel *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
              <Input
                id="current_password"
                type="password"
                placeholder="Votre mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-vet-navy">
              Nouveau mot de passe *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
              <Input
                id="new_password"
                type="password"
                placeholder="Nouveau mot de passe (min. 6 caractères)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-vet-navy">
              Confirmer le nouveau mot de passe *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
              <Input
                id="confirm_password"
                type="password"
                placeholder="Confirmez le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                required
                disabled={isLoading}
                minLength={6}
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
                Modification en cours...
              </>
            ) : (
              'Modifier le mot de passe'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
