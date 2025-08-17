
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar, Trash2 } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useClinicVeterinarians } from '@/hooks/useClinicVeterinarians';
import { useConsultationTypes } from '@/hooks/useConsultationTypes';
import type { Database } from '@/integrations/supabase/types';

type AvailableSlotRow = Database['public']['Tables']['available_slots']['Row'];

interface SlotsListProps {
  slots: AvailableSlotRow[];
  onDeleteSlot: (slotId: string) => Promise<boolean>;
}

export const SlotsList = ({ slots, onDeleteSlot }: SlotsListProps) => {
  const { veterinarians } = useClinicVeterinarians();
  const { consultationTypes } = useConsultationTypes();

  const groupedSlots = useMemo(() => {
    return slots.reduce((acc, slot) => {
      const date = slot.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, AvailableSlotRow[]>);
  }, [slots]);

  const getVeterinarianName = (vetId: string) => {
    const vet = veterinarians.find(v => v.id === vetId);
    return vet ? vet.name : 'Vétérinaire inconnu';
  };

  const getConsultationTypeName = (typeId: string) => {
    const type = consultationTypes.find(t => t.id === typeId);
    return type ? type.name : 'Type inconnu';
  };

  const getConsultationTypeColor = (typeId: string) => {
    const type = consultationTypes.find(t => t.id === typeId);
    return type ? type.color : '#3B82F6';
  };

  const handleDelete = async (slotId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      await onDeleteSlot(slotId);
    }
  };

  if (slots.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <p className="text-vet-brown">Aucun créneau disponible pour les critères sélectionnés</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedSlots).map(([date, dateSlots]) => (
        <Card key={date} className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardHeader>
            <CardTitle className="flex items-center text-vet-navy">
              <Calendar className="h-5 w-5 mr-2" />
              {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: fr })}
            </CardTitle>
            <CardDescription>
              {dateSlots.length} créneau{dateSlots.length > 1 ? 'x' : ''} disponible{dateSlots.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {dateSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 border rounded-lg bg-white/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-vet-blue" />
                      <span className="font-medium">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(slot.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-vet-sage" />
                      <span className="text-sm text-vet-brown">
                        {getVeterinarianName(slot.veterinarian_id)}
                      </span>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: getConsultationTypeColor(slot.consultation_type_id) + '20',
                        color: getConsultationTypeColor(slot.consultation_type_id),
                        borderColor: getConsultationTypeColor(slot.consultation_type_id)
                      }}
                    >
                      {getConsultationTypeName(slot.consultation_type_id)}
                    </Badge>

                    {slot.is_booked && (
                      <Badge variant="destructive" className="text-xs">
                        Réservé
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
