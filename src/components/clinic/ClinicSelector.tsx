
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users } from "lucide-react";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { ManualClinicCreationModal } from "@/components/admin/ManualClinicCreationModal";
import { NoClinicAssigned } from "./NoClinicAssigned";

export const ClinicSelector = () => {
  const { clinicAccess, currentClinic, userRole, isLoading } = useClinicAccess();

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-6">
          <div className="text-center text-vet-brown">Chargement des informations de la clinique...</div>
        </CardContent>
      </Card>
    );
  }

  // Si aucune clinique n'est assignée, afficher le message approprié
  if (!currentClinic) {
    return <NoClinicAssigned />;
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
            
            {/* Seuls les administrateurs peuvent créer des comptes manuellement */}
            {userRole === 'admin' && (
              <ManualClinicCreationModal />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
