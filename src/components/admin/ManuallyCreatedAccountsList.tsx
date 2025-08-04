
import React from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Calendar, CheckCircle, Clock } from "lucide-react";

interface ManuallyCreatedAccount {
  id: string;
  clinic_id: string;
  created_at: string;
  password_changed: boolean;
  first_login_completed: boolean;
  clinics: {
    name: string;
  };
}

export const ManuallyCreatedAccountsList = () => {
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['manually-created-accounts'],
    queryFn: async () => {
      console.log('🔄 Fetching manually created accounts...');
      
      const { data, error } = await supabase
        .from('admin_clinic_creations')
        .select(`
          id,
          clinic_id,
          created_at,
          password_changed,
          first_login_completed,
          clinics (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching manually created accounts:', error);
        throw error;
      }

      console.log('✅ Manually created accounts loaded:', data?.length || 0, 'items');
      return (data || []) as ManuallyCreatedAccount[];
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-6">
          <div className="text-center text-vet-brown">Chargement des comptes créés manuellement...</div>
        </CardContent>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <User className="h-5 w-5 mr-2" />
            Comptes créés manuellement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-vet-brown">Aucun compte créé manuellement pour le moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center">
          <User className="h-5 w-5 mr-2" />
          Comptes créés manuellement ({accounts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accounts.map((account) => (
            <div 
              key={account.id}
              className="flex items-center justify-between p-3 border border-vet-blue/20 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-vet-sage" />
                <div>
                  <p className="font-medium text-vet-navy">{account.clinics.name}</p>
                  <p className="text-xs text-vet-brown flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Créé le {new Date(account.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={account.password_changed ? "default" : "secondary"}
                  className={account.password_changed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {account.password_changed ? (
                    <><CheckCircle className="h-3 w-3 mr-1" />Mot de passe changé</>
                  ) : (
                    <><Clock className="h-3 w-3 mr-1" />Mot de passe provisoire</>
                  )}
                </Badge>
                
                {account.first_login_completed && (
                  <Badge variant="outline" className="border-vet-sage text-vet-sage">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Première connexion
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
