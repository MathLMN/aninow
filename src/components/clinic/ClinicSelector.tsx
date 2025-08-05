
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClinicAccess } from "@/hooks/useClinicAccess";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ManualClinicCreationModal } from "@/components/admin/ManualClinicCreationModal";
import { NoClinicAssigned } from "./NoClinicAssigned";

export const ClinicSelector = () => {
  const { clinicAccess, currentClinic, isLoading, refetch } = useClinicAccess();
  const { isAdmin: isGlobalAdmin } = useAdminAuth();

  console.log('🏥 ClinicSelector - Current clinic:', currentClinic);
  console.log('📋 ClinicSelector - Clinic access:', clinicAccess);

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-vet-brown">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Chargement des informations de la clinique...</span>
          </div>
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
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-500 text-amber-600">
                Admin AniNow
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="text-vet-blue hover:bg-vet-blue/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-vet-brown">
                Vous êtes connecté en tant qu'administrateur global AniNow. Vous avez accès à tous les outils d'administration pour gérer les comptes cliniques.
              </p>
              {clinicAccess.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ Problème de chargement des données de clinique détecté. Cliquez sur le bouton de rafraîchissement.
                </p>
              )}
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
              {isGlobalAdmin ? "Admin AniNow" : "Utilisateur"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-vet-blue hover:bg-vet-blue/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
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
                  Vous avez accès à {clinicAccess.length} clinique{clinicAccess.length > 1 ? 's' : ''}
                </p>
              )}
              {isGlobalAdmin && currentClinic && (
                <p className="text-sm text-vet-brown">
                  <Crown className="h-4 w-4 inline mr-1" />
                  Accès administrateur à toutes les fonctionnalités
                </p>
              )}
            </div>
            
            {/* Seuls les admins globaux peuvent créer des comptes */}
            {isGlobalAdmin && (
              <ManualClinicCreationModal />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
