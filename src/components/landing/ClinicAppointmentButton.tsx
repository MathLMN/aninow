
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowRight, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

interface Clinic {
  id: string;
  name: string;
  slug: string;
}

const ClinicAppointmentButton = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasSingleClinic, setHasSingleClinic] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;

      const clinicsData = data || [];
      setClinics(clinicsData);

      // Si une seule clinique, sélectionner automatiquement et masquer le sélecteur
      if (clinicsData.length === 1) {
        setSelectedClinic(clinicsData[0].id);
        setHasSingleClinic(true);
      } else {
        setHasSingleClinic(false);
      }
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

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = () => {
    if (!selectedClinic) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une clinique",
        variant: "destructive"
      });
      return;
    }

    const clinic = clinics.find(c => c.id === selectedClinic);
    if (clinic) {
      navigate(`/${clinic.slug}/booking`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 w-full max-w-md">
        <Button 
          disabled
          size="lg"
          className="w-full bg-vet-navy/50 hover:bg-vet-navy/50 text-white px-6 py-3 text-base font-semibold rounded-lg shadow-lg cursor-not-allowed"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Chargement...
        </Button>
      </div>
    );
  }

  if (clinics.length === 0) {
    return (
      <div className="space-y-4 w-full max-w-md">
        <p className="text-sm text-gray-500 text-center">
          Aucune clinique disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      {/* Afficher le sélecteur seulement s'il y a plusieurs cliniques */}
      {!hasSingleClinic && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-vet-navy">
            Choisir votre clinique vétérinaire
          </label>
          <Select value={selectedClinic} onValueChange={setSelectedClinic}>
            <SelectTrigger className="w-full bg-white border-gray-300 focus:border-vet-sage">
              <MapPin className="h-4 w-4 mr-2 text-vet-sage" />
              <SelectValue placeholder="Sélectionnez votre clinique..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-64">
              <div className="p-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher une clinique..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200"
                  />
                </div>
              </div>
              {filteredClinics.length === 0 ? (
                <SelectItem value="no-results" disabled>
                  Aucune clinique trouvée
                </SelectItem>
              ) : (
                filteredClinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id} className="hover:bg-vet-sage/10">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2 text-vet-sage" />
                      {clinic.name}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Message pour une seule clinique */}
      {hasSingleClinic && (
        <div className="text-center">
          <p className="text-sm text-vet-brown mb-2">
            Prendre rendez-vous chez
          </p>
          <p className="font-medium text-vet-navy">
            {clinics[0]?.name}
          </p>
        </div>
      )}

      <Button 
        onClick={handleBookAppointment}
        disabled={!selectedClinic}
        size="lg"
        className="w-full bg-vet-navy hover:bg-vet-navy/90 text-white px-6 py-3 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="mr-2 h-5 w-5" />
        Prendre rendez-vous
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Gratuit et sans inscription
      </p>
    </div>
  );
};

export default ClinicAppointmentButton;
