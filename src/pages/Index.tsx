
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Settings, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header */}
      <header className="bg-vet-navy text-vet-beige shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-vet-sage" />
              <h1 className="text-2xl font-bold">VetBooking</h1>
            </div>
            <p className="text-vet-blue">Système de prise de rendez-vous vétérinaire</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-vet-navy mb-4">
            Bienvenue sur VetBooking
          </h2>
          <p className="text-xl text-vet-brown max-w-2xl mx-auto">
            Solution complète de prise de rendez-vous en ligne pour les cliniques vétérinaires
          </p>
        </div>

        {/* Interface Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Interface Publique */}
          <Card className="bg-white/80 backdrop-blur-sm border-vet-blue/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <Calendar className="h-16 w-16 text-vet-sage mx-auto mb-4" />
              <CardTitle className="text-2xl text-vet-navy">
                Interface Publique
              </CardTitle>
              <CardDescription className="text-vet-brown text-lg">
                Formulaire de prise de rendez-vous pour les propriétaires d'animaux
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6 text-vet-brown">
                <p>✓ Formulaire intelligent avec logique conditionnelle</p>
                <p>✓ Sélection de créneaux disponibles</p>
                <p>✓ Confirmation instantanée</p>
                <p>✓ Intégrable sur votre site web</p>
              </div>
              <Link to="/booking">
                <Button className="w-full bg-vet-sage hover:bg-vet-sage/90 text-white">
                  Prendre un rendez-vous
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Interface Vétérinaire */}
          <Card className="bg-white/80 backdrop-blur-sm border-vet-blue/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <Users className="h-16 w-16 text-vet-navy mx-auto mb-4" />
              <CardTitle className="text-2xl text-vet-navy">
                Espace Vétérinaire
              </CardTitle>
              <CardDescription className="text-vet-brown text-lg">
                Dashboard privé pour la gestion des rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6 text-vet-brown">
                <p>✓ Planning interactif des rendez-vous</p>
                <p>✓ Gestion des créneaux disponibles</p>
                <p>✓ Tableau de bord complet</p>
                <p>✓ Paramètres personnalisables</p>
              </div>
              <Link to="/vet/login">
                <Button className="w-full bg-vet-navy hover:bg-vet-navy/90 text-white">
                  Accès Vétérinaire
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <Settings className="h-12 w-12 text-vet-sage mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-vet-navy mb-2">Simple à utiliser</h3>
            <p className="text-vet-brown">Interface intuitive pour tous les utilisateurs</p>
          </div>
          <div className="text-center p-6">
            <Calendar className="h-12 w-12 text-vet-sage mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-vet-navy mb-2">Planning intelligent</h3>
            <p className="text-vet-brown">Gestion automatique des créneaux disponibles</p>
          </div>
          <div className="text-center p-6">
            <Heart className="h-12 w-12 text-vet-sage mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-vet-navy mb-2">Dédié aux vétérinaires</h3>
            <p className="text-vet-brown">Conçu spécifiquement pour les besoins vétérinaires</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
