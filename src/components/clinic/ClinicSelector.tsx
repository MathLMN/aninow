
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Plus } from "lucide-react";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { useClinicManagement } from "@/hooks/useClinicManagement";
import { ManualClinicCreationModal } from "@/components/admin/ManualClinicCreationModal";

export const ClinicSelector = () => {
  const { clinicAccess, currentClinic, userRole, isLoading } = useClinicAccess();
  const { createClinic, isCreatingClinic } = useClinicManagement();

  const handleCreateClinic = async () => {
    // Pour l'instant, créer une clinique avec un nom par défaut
    // Dans une vraie implémentation, on ouvrirait un modal avec un formulaire
    const success = await createClinic({
      name: `Nouvelle clinique ${new Date().toLocaleDateString()}`
    });
    
    if (success) {
      console.log('Clinique créée avec succès');
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-6">
          <div className="text-center text-vet-brown">Chargement des informations de la clinique...</div>
        </CardContent>
      </Card>
    );
  }

  if (!currentClinic) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Aucune clinique configurée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-vet-brown mb-6">
              Vous n'avez accès à aucune clinique. Vous pouvez créer votre clinique ou utiliser la création manuelle pour les comptes clients.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleCreateClinic}
                disabled={isCreatingClinic}
                className="bg-vet-blue hover:bg-vet-blue/90 text-white w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreatingClinic ? 'Création...' : 'Créer ma clinique'}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-vet-blue/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-vet-brown">ou</span>
                </div>
              </div>
              
              <ManualClinicCreationModal />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Clinique actuelle
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-vet-sage text-vet-sage">
              {userRole}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-vet-navy text-lg">{currentClinic.name}</h3>
            <p className="text-sm text-vet-brown">
              Créée le {new Date(currentClinic.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {clinicAccess.length > 1 && (
                <p className="text-sm text-vet-brown">
                  <Users className="h-4 w-4 inline mr-1" />
                  Vous avez accès à {clinicAccess.length} clinique{clinicAccess.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {userRole === 'admin' && (
              <ManualClinicCreationModal />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
