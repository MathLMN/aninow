import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
interface AdditionalPointsSelectorProps {
  selectedPoints: string[];
  onPointsChange: (points: string[]) => void;
  customPoint: string;
  onCustomPointChange: (point: string) => void;
}
const ADDITIONAL_POINTS = [
// Couleur orange - soins esthétiques
{
  id: 'coupe-griffes',
  label: 'Coupe de griffes',
  color: 'orange'
},
// Couleur jaune - bilans de santé
{
  id: 'bilan-sante',
  label: 'Bilan de santé',
  color: 'yellow'
},
// Couleur verte - bilans spécialisés
{
  id: 'bilan-senior',
  label: 'Bilan sénior',
  color: 'green'
},
// Couleur rouge - autre
{
  id: 'autre',
  label: 'Autre (précisez)',
  color: 'red'
}];
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
  onCustomPointChange
}) => {
  const handlePointToggle = (pointId: string, selected: boolean) => {
    if (selected) {
      onPointsChange([...selectedPoints, pointId]);
    } else {
      onPointsChange(selectedPoints.filter(id => id !== pointId));
    }
  };
  const showCustomInput = selectedPoints.includes('autre');
  const selectedPointsData = ADDITIONAL_POINTS.filter(point => selectedPoints.includes(point.id));
  const availablePointsData = ADDITIONAL_POINTS.filter(point => !selectedPoints.includes(point.id));
  return <div className="space-y-4 sm:space-y-6">
      {/* Indication de multi-sélection */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
        <span className="text-lg">💡</span>
        <p className="text-xs sm:text-sm text-blue-800">Vous pouvez sélectionner plusieurs points.</p>
      </div>

      {/* Points sélectionnés */}
      {selectedPointsData.length > 0 && <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-vet-navy flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-vet-sage text-white text-xs font-bold">
              {selectedPointsData.length}
            </span>
            Point{selectedPointsData.length > 1 ? 's' : ''} sélectionné{selectedPointsData.length > 1 ? 's' : ''}
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-vet-sage/10 rounded-lg border-2 border-vet-sage/30">
            {selectedPointsData.map(point => <button key={point.id} type="button" onClick={() => handlePointToggle(point.id, false)} className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95
                  ${getTagColorClasses(point.color, true)}
                `}>
                {point.label}
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>)}
          </div>
        </div>}

      {/* Points disponibles */}
      {availablePointsData.length > 0 && <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-600">
            Autres points disponibles
          </Label>
          <div className="flex flex-wrap gap-2">
            {availablePointsData.map(point => <button key={point.id} type="button" onClick={() => handlePointToggle(point.id, true)} className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-95
                  ${getTagColorClasses(point.color, false)}
                `}>
                {point.label}
              </button>)}
          </div>
        </div>}

      {/* Zone de texte personnalisée si "Autre" est sélectionné */}
      {showCustomInput && <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-vet-navy">
            Précisez le point supplémentaire :
          </Label>
          <Textarea value={customPoint} onChange={e => onCustomPointChange(e.target.value)} placeholder="Décrivez le point supplémentaire..." className="min-h-[80px] text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors resize-none" />
        </div>}
    </div>;
};
export default AdditionalPointsSelector;