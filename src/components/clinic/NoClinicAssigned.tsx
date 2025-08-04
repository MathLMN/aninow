
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone } from "lucide-react";

export const NoClinicAssigned = () => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Aucune clinique assignée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 space-y-6">
          <div className="space-y-3">
            <p className="text-vet-brown text-lg">
              Votre compte n'est pas encore associé à une clinique vétérinaire.
            </p>
            <p className="text-vet-brown">
              Pour accéder à l'interface de gestion, votre clinique doit être configurée par notre équipe.
            </p>
          </div>
          
          <div className="bg-vet-blue/10 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-vet-navy">Comment procéder ?</h3>
            <div className="space-y-2 text-sm text-vet-brown">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Contactez-nous par email pour configurer votre clinique</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Ou appelez-nous pour un setup rapide</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Badge variant="outline" className="border-vet-sage text-vet-sage">
              Configuration en attente
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
