
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

interface AdditionalPointsSelectorProps {
  selectedPoints: string[];
  onPointsChange: (points: string[]) => void;
  customPoint: string;
  onCustomPointChange: (point: string) => void;
}

const ADDITIONAL_POINTS = [
  // Couleur orange - soins esthétiques
  { id: 'coupe-griffes', label: 'Coupe de griffes', color: 'orange' },
  
  // Couleur jaune - bilans de santé
  { id: 'bilan-sante', label: 'Bilan de santé', color: 'yellow' },
  
  // Couleur verte - bilans spécialisés
  { id: 'bilan-senior', label: 'Bilan sénior', color: 'green' },
  
  // Couleur rouge - autre
  { id: 'autre', label: 'Autre (précisez)', color: 'red' }
];

const getTagColorClasses = (color: string, isSelected: boolean) => {
  if (isSelected) {
    switch (color) {
      case 'red':
        return 'bg-red-300 text-red-800 border-red-300 hover:bg-red-400';
      case 'orange':
        return 'bg-orange-300 text-orange-800 border-orange-300 hover:bg-orange-400';
      case 'yellow':
        return 'bg-yellow-200 text-yellow-800 border-yellow-200 hover:bg-yellow-300';
      case 'green':
        return 'bg-green-300 text-green-800 border-green-300 hover:bg-green-400';
      default:
        return 'bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-400';
    }
  } else {
    switch (color) {
      case 'red':
        return 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100';
      case 'orange':
        return 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100';
    }
  }
};

const AdditionalPointsSelector: React.FC<AdditionalPointsSelectorProps> = ({
  selectedPoints,
  onPointsChange,
  customPoint,
  onCustomPointChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPoints = useMemo(() => {
    if (!searchTerm.trim()) return ADDITIONAL_POINTS;
    
    return ADDITIONAL_POINTS.filter(point =>
      point.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handlePointToggle = (pointId: string, selected: boolean) => {
    if (selected) {
      onPointsChange([...selectedPoints, pointId]);
    } else {
      onPointsChange(selectedPoints.filter(id => id !== pointId));
    }
  };

  const showCustomInput = selectedPoints.includes('autre');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher une option"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
        />
      </div>

      {/* Tags des points supplémentaires */}
      <div className="flex flex-wrap gap-2">
        {filteredPoints.map((point) => {
          const isSelected = selectedPoints.includes(point.id);
          return (
            <button
              key={point.id}
              type="button"
              onClick={() => handlePointToggle(point.id, !isSelected)}
              className={`
                inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-95
                ${getTagColorClasses(point.color, isSelected)}
              `}
            >
              {point.label}
            </button>
          );
        })}
      </div>

      {/* Zone de texte personnalisée si "Autre" est sélectionné */}
      {showCustomInput && (
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-vet-navy">
            Précisez le point supplémentaire :
          </Label>
          <Textarea
            value={customPoint}
            onChange={(e) => onCustomPointChange(e.target.value)}
            placeholder="Décrivez le point supplémentaire..."
            className="min-h-[80px] text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors resize-none"
          />
        </div>
      )}
    </div>
  );
};

export default AdditionalPointsSelector;
