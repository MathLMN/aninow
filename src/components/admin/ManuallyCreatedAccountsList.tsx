import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Eye, EyeOff, CheckCircle2, Clock, AlertCircle, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ManuallyCreatedAccount {
  id: string;
  clinic_name: string;
  user_email: string;
  provisional_password: string;
  password_changed: boolean;
  first_login_completed: boolean;
  created_at: string;
}

export const ManuallyCreatedAccountsList = () => {
  const { toast } = useToast();
  const [visiblePasswords, setVisiblePasswords] = React.useState<Set<string>>(new Set());

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['manually-created-accounts'],
    queryFn: async () => {
      console.log('🔄 Fetching manually created accounts...');
      
      const { data, error } = await supabase
        .from('admin_clinic_creations')
        .select(`
          id,
          clinic_id,
          admin_user_id,
          provisional_password,
          password_changed,
          first_login_completed,
          created_at,
          clinics!admin_clinic_creations_clinic_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching accounts:', error);
        throw error;
      }

      // Get user emails from auth.users via the admin_clinic_creations -> user_clinic_access -> auth.users relationship
      const accountsWithEmails = await Promise.all(
        data.map(async (account) => {
          const { data: userAccess } = await supabase
            .from('user_clinic_access')
            .select('user_id')
            .eq('clinic_id', account.clinic_id)
            .eq('created_by_admin', account.admin_user_id)
            .single();

          if (userAccess) {
            const { data: { user } } = await supabase.auth.admin.getUserById(userAccess.user_id);
            return {
              ...account,
              clinic_name: account.clinics?.name || 'Clinique inconnue',
              user_email: user?.email || 'Email inconnu'
            };
          }

          return {
            ...account,
            clinic_name: account.clinics?.name || 'Clinique inconnue',
            user_email: 'Email inconnu'
          };
        })
      );

      console.log('✅ Accounts fetched:', accountsWithEmails.length);
      return accountsWithEmails as ManuallyCreatedAccount[];
    }
  });

  const togglePasswordVisibility = (accountId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: `${type} copié dans le presse-papier`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papier",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-vet-brown">Chargement des comptes créés manuellement...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-300 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Erreur lors du chargement des comptes : {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!accounts?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Comptes créés manuellement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-vet-brown py-8">
            Aucun compte créé manuellement pour le moment.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-vet-navy flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Comptes créés manuellement ({accounts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-vet-navy">{account.clinic_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-vet-brown">{account.user_email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(account.user_email, "Email")}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-vet-brown">
                    Créé le {new Date(account.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-vet-brown">Mot de passe :</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {visiblePasswords.has(account.id) ? account.provisional_password : '••••••••••••'}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility(account.id)}
                    className="h-6 w-6 p-0"
                  >
                    {visiblePasswords.has(account.id) ? 
                      <EyeOff className="h-3 w-3" /> : 
                      <Eye className="h-3 w-3" />
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.provisional_password, "Mot de passe")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {account.password_changed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        Mot de passe changé
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-amber-600" />
                      <Badge variant="outline" className="border-amber-600 text-amber-600">
                        Mot de passe provisoire
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {account.first_login_completed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        Configuration terminée
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-amber-600" />
                      <Badge variant="outline" className="border-amber-600 text-amber-600">
                        Configuration en attente
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
