import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { GripVertical, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Veterinarian {
  id: string;
  name: string;
  is_active: boolean;
}

interface VeterinarianColumnsOrderManagerProps {
  veterinarians: Veterinarian[];
  currentOrder: string[];
  asvEnabled: boolean;
  onOrderChange: (order: string[]) => void;
}

export const VeterinarianColumnsOrderManager = ({
  veterinarians,
  currentOrder,
  asvEnabled,
  onOrderChange,
}: VeterinarianColumnsOrderManagerProps) => {
  // Initialiser l'ordre avec les vétérinaires actifs
  const initializeOrder = () => {
    if (currentOrder.length === 0) {
      // Ordre par défaut: ASV puis vétérinaires par ordre alphabétique
      const activeVets = veterinarians
        .filter(v => v.is_active)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(v => v.id);
      return asvEnabled ? ["asv", ...activeVets] : activeVets;
    }
    
    // Fusionner l'ordre sauvegardé avec les nouveaux vétérinaires
    const savedIds = new Set(currentOrder);
    const newVets = veterinarians
      .filter(v => v.is_active && !savedIds.has(v.id))
      .map(v => v.id);
    
    // Filtrer les vétérinaires qui n'existent plus ou sont désactivés
    const activeVetIds = new Set(veterinarians.filter(v => v.is_active).map(v => v.id));
    const validOrder = currentOrder.filter(id => id === "asv" || activeVetIds.has(id));
    
    return [...validOrder, ...newVets];
  };

  const [orderedColumns, setOrderedColumns] = useState<string[]>(initializeOrder);
  const [showAsv, setShowAsv] = useState(asvEnabled && currentOrder.includes("asv"));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedColumns(items);
    onOrderChange(items);
  };

  const handleResetOrder = () => {
    const defaultOrder = veterinarians
      .filter(v => v.is_active)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(v => v.id);
    
    const newOrder = showAsv ? ["asv", ...defaultOrder] : defaultOrder;
    setOrderedColumns(newOrder);
    onOrderChange(newOrder);
  };

  const handleAsvToggle = (checked: boolean) => {
    setShowAsv(checked);
    
    let newOrder: string[];
    if (checked) {
      // Ajouter ASV en première position
      newOrder = ["asv", ...orderedColumns.filter(id => id !== "asv")];
    } else {
      // Retirer ASV
      newOrder = orderedColumns.filter(id => id !== "asv");
    }
    
    setOrderedColumns(newOrder);
    onOrderChange(newOrder);
  };

  const getVetName = (id: string) => {
    if (id === "asv") return "ASV";
    return veterinarians.find(v => v.id === id)?.name || id;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-vet-cream/30 rounded-md border border-vet-blue/20">
        <div className="flex items-center gap-3">
          <Switch
            id="asv-toggle"
            checked={showAsv}
            onCheckedChange={handleAsvToggle}
          />
          <Label htmlFor="asv-toggle" className="text-sm font-medium cursor-pointer">
            Afficher la colonne ASV
          </Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetOrder}
          className="text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Réinitialiser
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="veterinarian-columns">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-1.5 p-2 rounded-lg border-2 border-dashed transition-colors ${
                snapshot.isDraggingOver
                  ? "border-vet-blue bg-vet-blue/5"
                  : "border-vet-blue/20 bg-white/50"
              }`}
            >
              {orderedColumns.map((columnId, index) => (
                <Draggable key={columnId} draggableId={columnId} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-2 p-2.5 bg-white rounded-md border transition-all ${
                        snapshot.isDragging
                          ? "border-vet-blue shadow-lg"
                          : "border-vet-blue/20 hover:border-vet-blue/40"
                      }`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4 text-vet-brown/50" />
                      </div>
                      
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-vet-navy">
                          {getVetName(columnId)}
                        </span>
                        
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            1ère
                          </Badge>
                        )}
                        {index === orderedColumns.length - 1 && orderedColumns.length > 1 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            Dernière
                          </Badge>
                        )}
                      </div>
                      
                      <span className="text-xs text-vet-brown/60 font-medium">
                        Position {index + 1}
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <p className="text-xs text-vet-brown/60 italic">
        Glissez-déposez les éléments pour réorganiser l'ordre d'affichage des colonnes dans le planning
      </p>
    </div>
  );
};
