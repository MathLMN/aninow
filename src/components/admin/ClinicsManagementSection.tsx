
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Edit, ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminClinicCreation } from '@/hooks/useAdminClinicCreation';

interface Clinic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

const ClinicsManagementSection = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { validateSlug, checkSlugAvailability } = useAdminClinicCreation();

  useEffect(() => {
    fetchClinics();
  }, []);

  // Check slug availability when editing
  useEffect(() => {
    if (!editSlug.trim() || !editingClinic) {
      setSlugStatus('idle');
      return;
    }

    // If slug hasn't changed, it's valid
    if (editSlug === editingClinic.slug) {
      setSlugStatus('available');
      return;
    }

    const checkSlug = async () => {
      if (!validateSlug(editSlug)) {
        setSlugStatus('invalid');
        return;
      }

      setSlugStatus('checking');
      
      try {
        const isAvailable = await checkSlugAvailability(editSlug);
        setSlugStatus(isAvailable ? 'available' : 'taken');
      } catch (error) {
        console.error('Error checking slug:', error);
        setSlugStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [editSlug, editingClinic, validateSlug, checkSlugAvailability]);

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClinics(data || []);
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cliniques",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClinic = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setEditName(clinic.name);
    setEditSlug(clinic.slug);
    setSlugStatus('idle');
  };

  const handleSaveChanges = async () => {
    if (!editingClinic || slugStatus !== 'available') return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          name: editName.trim(),
          slug: editSlug.trim()
        })
        .eq('id', editingClinic.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Clinique mise à jour avec succès",
      });

      setEditingClinic(null);
      fetchClinics(); // Refresh the list
    } catch (error) {
      console.error('Error updating clinic:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la clinique",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSlugStatusIcon = () => {
    switch (slugStatus) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'taken':
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSlugStatusMessage = () => {
    switch (slugStatus) {
      case 'checking':
        return 'Vérification...';
      case 'available':
        return 'Disponible';
      case 'taken':
        return 'Déjà utilisé';
      case 'invalid':
        return 'Format invalide';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-vet-navy">
            <Building2 className="h-5 w-5 mr-2" />
            Gestion des cliniques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-vet-brown">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-vet-navy">
            <Building2 className="h-5 w-5 mr-2" />
            Gestion des cliniques ({clinics.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clinics.length === 0 ? (
            <p className="text-vet-brown">Aucune clinique créée pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {clinics.map((clinic) => (
                <div key={clinic.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-vet-navy">{clinic.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-vet-brown">
                        <span>Slug: /{clinic.slug}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`/${clinic.slug}`, '_blank')}
                          className="h-auto p-1 hover:bg-vet-sage/10"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-vet-brown/70">
                        Créé le {new Date(clinic.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClinic(clinic)}
                      className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingClinic} onOpenChange={() => setEditingClinic(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-vet-navy flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Modifier la clinique
            </DialogTitle>
          </DialogHeader>

          {editingClinic && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-clinic-name">Nom de la clinique</Label>
                <Input
                  id="edit-clinic-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ex: Clinique Vétérinaire du Centre"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-clinic-slug">
                  Slug de la clinique
                  <span className="text-sm text-gray-500 ml-1">(URL: /{editSlug}/booking)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="edit-clinic-slug"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value.toLowerCase())}
                    placeholder="ex: clinique-centre-ville"
                    disabled={isSaving}
                    className={`pr-10 ${
                      slugStatus === 'available' ? 'border-green-500' :
                      slugStatus === 'taken' || slugStatus === 'invalid' ? 'border-red-500' :
                      'border-gray-300'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {getSlugStatusIcon()}
                  </div>
                </div>
                {slugStatus !== 'idle' && (
                  <p className={`text-xs ${
                    slugStatus === 'available' ? 'text-green-600' : 
                    'text-red-600'
                  }`}>
                    {getSlugStatusMessage()}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingClinic(null)}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving || slugStatus !== 'available' || !editName.trim()}
                  className="flex-1 bg-vet-sage hover:bg-vet-sage/90 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    'Sauvegarder'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClinicsManagementSection;
