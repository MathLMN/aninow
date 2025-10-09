
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManualClinicCreationModal } from './ManualClinicCreationModal';
import { ManuallyCreatedAccountsList } from './ManuallyCreatedAccountsList';
import ClinicsManagementSection from './ClinicsManagementSection';
import { FormQuestionsManager } from './FormQuestionsManager';
import { Building2, Users, UserPlus, BarChart3, FileQuestion } from "lucide-react";

const AdminDashboard = () => {
  const [showFormQuestionsManager, setShowFormQuestionsManager] = useState(false);

  if (showFormQuestionsManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button
            variant="outline"
            onClick={() => setShowFormQuestionsManager(false)}
            className="mb-4"
          >
            ← Retour au tableau de bord
          </Button>
          <FormQuestionsManager />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-vet-navy mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-vet-brown">
            Gestion des cliniques et des comptes utilisateurs
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-vet-brown">Cliniques</CardTitle>
              <Building2 className="h-4 w-4 text-vet-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vet-navy">-</div>
              <p className="text-xs text-vet-brown/70">Cliniques actives</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-vet-brown">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-vet-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vet-navy">-</div>
              <p className="text-xs text-vet-brown/70">Comptes créés</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-vet-brown">Réservations</CardTitle>
              <BarChart3 className="h-4 w-4 text-vet-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vet-navy">-</div>
              <p className="text-xs text-vet-brown/70">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinics Management */}
          <div className="space-y-6">
            <ClinicsManagementSection />
          </div>

          {/* Account Creation */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-vet-navy">
                  <div className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Création de comptes
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-vet-brown text-sm">
                    Créez manuellement des comptes pour de nouvelles cliniques vétérinaires.
                  </p>
                  <ManualClinicCreationModal />
                </div>
              </CardContent>
            </Card>

            <ManuallyCreatedAccountsList />
          </div>
        </div>

        {/* Form Questions Management */}
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-vet-navy">
              <div className="flex items-center">
                <FileQuestion className="h-5 w-5 mr-2" />
                Gestion des questions du formulaire
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-vet-brown text-sm">
                Gérez les questions et réponses du formulaire de prise de rendez-vous client.
                Modifiez, ajoutez, supprimez et réorganisez les questions selon vos besoins.
              </p>
              <Button 
                onClick={() => setShowFormQuestionsManager(true)}
                className="bg-vet-sage hover:bg-vet-sage/90 w-full"
              >
                <FileQuestion className="h-4 w-4 mr-2" />
                Accéder à la gestion des questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
