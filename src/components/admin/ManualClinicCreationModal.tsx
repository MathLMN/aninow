
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Building2, User, Mail, Copy, CheckCircle } from "lucide-react";
import { useAdminClinicCreation } from "@/hooks/useAdminClinicCreation";
import { useToast } from "@/hooks/use-toast";

interface CreatedAccountDetails {
  clinicId: string;
  userId: string;
  provisionalPassword: string;
  userEmail: string;
  clinicName: string;
}

export const ManualClinicCreationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clinicName, setClinicName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [createdAccount, setCreatedAccount] = useState<CreatedAccountDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const { createManualClinic, isCreating } = useAdminClinicCreation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clinicName.trim() || !userEmail.trim() || !userName.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await createManualClinic({
        clinicName: clinicName.trim(),
        userEmail: userEmail.trim(),
        userName: userName.trim()
      });

      setCreatedAccount({
        ...result,
        userEmail: userEmail.trim(),
        clinicName: clinicName.trim()
      });
    } catch (error) {
      console.error('Error creating manual clinic:', error);
    }
  };

  const handleReset = () => {
    setClinicName("");
    setUserEmail("");
    setUserName("");
    setCreatedAccount(null);
    setCopiedField(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form when closing
    setTimeout(handleReset, 300);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copié !",
        description: `${field} copié dans le presse-papiers`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papiers",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vet-sage hover:bg-vet-sage/90 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Créer un compte manuellement
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-vet-navy flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Création manuelle de compte clinique
          </DialogTitle>
        </DialogHeader>

        {!createdAccount ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinic-name">Nom de la clinique</Label>
              <Input
                id="clinic-name"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Ex: Clinique Vétérinaire du Centre"
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-name">Nom du responsable</Label>
              <Input
                id="user-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Dr. Martin Dupont"
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email du responsable</Label>
              <Input
                id="user-email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Ex: martin.dupont@clinique.fr"
                disabled={isCreating}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isCreating}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating}
                className="flex-1 bg-vet-sage hover:bg-vet-sage/90 text-white"
              >
                {isCreating ? 'Création...' : 'Créer le compte'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-vet-navy">
                Compte créé avec succès !
              </h3>
              <p className="text-sm text-vet-brown mt-2">
                Transmettez ces informations au responsable de la clinique
              </p>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs text-vet-brown">CLINIQUE</Label>
                    <p className="font-medium text-vet-navy">{createdAccount.clinicName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-xs text-vet-brown">EMAIL DE CONNEXION</Label>
                    <p className="font-medium text-vet-navy text-sm">{createdAccount.userEmail}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdAccount.userEmail, "Email")}
                    className="ml-2"
                  >
                    {copiedField === "Email" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-xs text-vet-brown">MOT DE PASSE PROVISOIRE</Label>
                    <p className="font-mono text-vet-navy bg-white p-2 rounded border text-sm">
                      {createdAccount.provisionalPassword}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdAccount.provisionalPassword, "Mot de passe")}
                    className="ml-2"
                  >
                    {copiedField === "Mot de passe" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                  <p className="text-xs text-yellow-800">
                    <strong>Important :</strong> Le responsable devra changer ce mot de passe lors de sa première connexion.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                Créer un autre compte
              </Button>
              <Button 
                onClick={handleClose}
                className="flex-1 bg-vet-sage hover:bg-vet-sage/90 text-white"
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
