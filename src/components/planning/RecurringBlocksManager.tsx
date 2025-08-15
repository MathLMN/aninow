
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Trash2, Plus, RefreshCw } from "lucide-react";
import { useRecurringSlotBlocks } from "@/hooks/useRecurringSlotBlocks";
import { RecurringBlockModal } from "./RecurringBlockModal";

interface RecurringBlocksManagerProps {
  veterinarians: any[];
}

const DAYS_OF_WEEK = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export const RecurringBlocksManager = ({ veterinarians }: RecurringBlocksManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    recurringBlocks, 
    isLoading, 
    deleteRecurringBlock, 
    isDeleting 
  } = useRecurringSlotBlocks();

  const getVeterinarianName = (vetId: string) => {
    const vet = veterinarians.find(v => v.id === vetId);
    return vet?.name || 'Vétérinaire inconnu';
  };

  const getDurationText = (startTime: string, endTime: string) => {
    const startDate = new Date(`2000-01-01T${startTime}`);
    const endDate = new Date(`2000-01-01T${endTime}`);
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
    
    if (durationMinutes > 0) {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      if (hours > 0 && minutes > 0) {
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${minutes} min`;
      }
    }
    return '';
  };

  const handleDeleteBlock = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le blocage récurrent "${title}" ?`)) {
      try {
        await deleteRecurringBlock(id);
      } catch (error) {
        console.error('Error deleting recurring block:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-6">
          <div className="text-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-vet-blue" />
            <p className="text-vet-brown">Chargement des blocages récurrents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-vet-navy flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Blocages récurrents
            </CardTitle>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau blocage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recurringBlocks.length === 0 ? (
            <div className="text-center py-8 text-vet-brown bg-vet-beige/10 rounded-lg border border-vet-blue/20">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-vet-blue/60" />
              <p className="font-medium">Aucun blocage récurrent configuré</p>
              <p className="text-sm mt-1">
                Créez des blocages automatiques pour les activités récurrentes
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 bg-vet-sage hover:bg-vet-sage/90 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Créer le premier blocage
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recurringBlocks.map((block) => (
                <div
                  key={block.id}
                  className="p-4 border border-vet-blue/20 rounded-lg bg-vet-beige/5 hover:bg-vet-beige/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-vet-navy">{block.title}</h3>
                        <Badge variant="secondary" className="bg-vet-sage/20 text-vet-sage border-vet-sage/30">
                          Récurrent
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-vet-brown">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-vet-blue" />
                          <span>{getVeterinarianName(block.veterinarian_id)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-vet-blue" />
                          <span>Tous les {DAYS_OF_WEEK[block.day_of_week].toLowerCase()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-vet-blue" />
                          <span>
                            {block.start_time.slice(0, 5)} - {block.end_time.slice(0, 5)}
                            <span className="text-vet-sage ml-1">
                              ({getDurationText(block.start_time, block.end_time)})
                            </span>
                          </span>
                        </div>
                      </div>

                      {block.description && (
                        <p className="text-sm text-vet-brown/80 mt-2 italic">
                          {block.description}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBlock(block.id, block.title)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RecurringBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        veterinarians={veterinarians}
      />
    </>
  );
};
