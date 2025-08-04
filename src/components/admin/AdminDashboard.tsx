
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp 
} from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";
import { ManualClinicCreationModal } from "./ManualClinicCreationModal";
import { ManuallyCreatedAccountsList } from "./ManuallyCreatedAccountsList";

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-vet-brown">Chargement du tableau de bord...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec action rapide */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-vet-navy">Tableau de bord administrateur</h2>
          <p className="text-vet-brown">Gestion des comptes cliniques</p>
        </div>
        <ManualClinicCreationModal />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-vet-sage" />
              <div>
                <p className="text-sm text-vet-brown">Cliniques créées</p>
                <p className="text-2xl font-bold text-vet-navy">
                  {stats?.totalClinicsCreated || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-vet-blue" />
              <div>
                <p className="text-sm text-vet-brown">Comptes actifs</p>
                <p className="text-2xl font-bold text-vet-navy">
                  {stats?.activeClinicAccounts || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-yellow-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-vet-brown">Mots de passe à changer</p>
                <p className="text-2xl font-bold text-vet-navy">
                  {stats?.pendingPasswordChanges || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-green-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-vet-brown">Taux d'activation</p>
                <p className="text-2xl font-bold text-vet-navy">
                  {stats?.totalClinicsCreated && stats?.activeClinicAccounts
                    ? Math.round((stats.activeClinicAccounts / stats.totalClinicsCreated) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      {stats?.pendingPasswordChanges && stats.pendingPasswordChanges > 0 && (
        <Card className="bg-yellow-50 border-yellow-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  {stats.pendingPasswordChanges} clinique{stats.pendingPasswordChanges > 1 ? 's' : ''} n'ont pas encore changé leur mot de passe provisoire
                </p>
                <p className="text-sm text-yellow-700">
                  Ces comptes nécessitent un suivi pour finaliser leur configuration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Créations récentes */}
      {stats?.recentCreations && stats.recentCreations.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader>
            <CardTitle className="text-vet-navy flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Créations récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentCreations.map((creation) => (
                <div key={creation.id} className="flex items-center justify-between p-3 border border-vet-blue/20 rounded-lg">
                  <div>
                    <p className="font-medium text-vet-navy">{creation.clinic_name}</p>
                    <p className="text-sm text-vet-brown">
                      Créé le {new Date(creation.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-vet-sage text-vet-sage">
                    Nouveau
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste complète des comptes */}
      <ManuallyCreatedAccountsList />
    </div>
  );
};
