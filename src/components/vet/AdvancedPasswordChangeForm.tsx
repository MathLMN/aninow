
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2, CheckCircle } from "lucide-react";
import { useAdvancedVetAuth } from "@/hooks/useAdvancedVetAuth";

const AdvancedPasswordChangeForm = () => {
  const { changePassword, isLoading } = useAdvancedVetAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    const { error } = await changePassword(currentPassword, newPassword);
    
    if (!error) {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (success) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-vet-navy mb-2">
            Mot de passe modifié !
          </h3>
          <p className="text-vet-brown mb-4">
            Votre mot de passe a été modifié avec succès.
          </p>
          <Button 
            onClick={() => setSuccess(false)}
            className="bg-vet-sage hover:bg-vet-sage/90 text-white"
          >
            OK
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-vet-navy">
          Changer le mot de passe
        </CardTitle>
        <CardDescription className="text-vet-brown">
          Modifiez votre mot de passe de connexion
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-6 border-red-300 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-vet-navy">
              Mot de passe actuel *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
              <Input
                id="currentPassword"
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-vet-navy">
              Nouveau mot de passe *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
              <Input
                id="newPassword"
                type="password"
                placeholder="Au moins 6 caractères"
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
            <Label htmlFor="confirmPassword" className="text-vet-navy">
              Confirmer le nouveau mot de passe *
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-vet-brown" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Répétez le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

export default AdvancedPasswordChangeForm;
