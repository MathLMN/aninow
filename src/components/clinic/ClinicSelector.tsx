
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Crown } from "lucide-react";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ManualClinicCreationModal } from "@/components/admin/ManualClinicCreationModal";
import { NoClinicAssigned } from "./NoClinicAssigned";

export const ClinicSelector = () => {
  const { clinicAccess, currentClinic, userRole, isLoading } = useClinicAccess();
  const { isAdmin: isGlobalAdmin } = useAdminAuth();

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-6">
          <div className="text-center text-vet-brown">Chargement des informations de la clinique...</div>
        </CardContent>
      </Card>
    );
  }

  // Si l'utilisateur est admin global mais n'a pas de clinique assignée
  if (!currentClinic && isGlobalAdmin) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-amber-500" />
              Administrateur global
            </div>
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              Super Admin
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-vet-brown">
                Vous êtes connecté en tant qu'administrateur global. Vous avez accès à tous les outils d'administration sans être lié à une clinique spécifique.
              </p>
            </div>
            
            <div className="flex items-center justify-end">
              <ManualClinicCreationModal />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si aucune clinique n'est assignée et pas admin global
  if (!currentClinic && !isGlobalAdmin) {
    return <NoClinicAssigned />;
  }

  // Déterminer le rôle à afficher
  const displayRole = isGlobalAdmin ? 'super admin' : userRole;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center justify-between">
          <div className="flex items-center">
            {isGlobalAdmin ? (
              <Crown className="h-5 w-5 mr-2 text-amber-500" />
            ) : (
              <Building2 className="h-5 w-5 mr-2" />
            )}
            {isGlobalAdmin ? "Administration globale" : "Clinique actuelle"}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={isGlobalAdmin 
                ? "border-amber-500 text-amber-600" 
                : "border-vet-sage text-vet-sage"
              }
            >
              {displayRole}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentClinic && (
            <div>
              <h3 className="font-semibold text-vet-navy text-lg">{currentClinic.name}</h3>
              <p className="text-sm text-vet-brown">
                Créée le {new Date(currentClinic.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              {clinicAccess.length > 1 && (
                <p className="text-sm text-vet-brown">
                  <Users className="h-4 w-4 inline mr-1" />
                  Vous avez accès à {clinicAccess.length} clinique{clinicAccess.length > 1 ? 's' : ''}
                </p>
              )}
              {isGlobalAdmin && !currentClinic && (
                <p className="text-sm text-vet-brown">
                  <Crown className="h-4 w-4 inline mr-1" />
                  Accès administrateur à toutes les fonctionnalités
                </p>
              )}
            </div>
            
            {/* Les administrateurs (globaux ou de clinique) peuvent créer des comptes */}
            {(userRole === 'admin' || isGlobalAdmin) && (
              <ManualClinicCreationModal />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
