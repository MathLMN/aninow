
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  customSymptom: string;
  onCustomSymptomChange: (symptom: string) => void;
}

const SYMPTOMS = [
  // Couleur orange - symptômes digestifs spécifiques
  { id: 'vomissements', label: 'Vomissements', color: 'orange' },
  { id: 'diarrhee', label: 'Diarrhée', color: 'orange' },
  { id: 'sang-selles', label: 'Sang dans les selles', color: 'orange' },
  
  // Couleur jaune - symptômes urinaires
  { id: 'problemes-urinaires', label: 'Problèmes urinaires', color: 'yellow' },
  
  // Couleur violette - symptômes cutanés
  { id: 'demangeaisons-cutanees', label: 'Démangeaisons cutanées', color: 'purple' },
  { id: 'plaie', label: 'Plaie', color: 'purple' },
  { id: 'demangeaisons-oreille', label: 'Démangeaisons de l\'oreille', color: 'purple' },
  { id: 'otite', label: 'Otite', color: 'purple' },
  
  // Couleur verte - symptômes oculaires et respiratoires
  { id: 'ecoulements-yeux', label: 'Ecoulements des yeux', color: 'green' },
  { id: 'toux', label: 'Toux', color: 'green' },
  
  // Couleur rose - symptômes locomoteurs spécifiques
  { id: 'boiterie', label: 'Boiterie', color: 'pink' },
  { id: 'difficultes-respiratoires', label: 'Difficultés respiratoires', color: 'pink' },
  
  // Couleur bleue - symptômes comportementaux et généraux
  { id: 'perte-appetit', label: 'Perte d\'appétit', color: 'blue' },
  { id: 'soif-excessive', label: 'Soif excessive', color: 'blue' },
  
  // Couleur grise - symptômes généraux
  { id: 'grosseur', label: 'Grosseur(s)', color: 'gray' },
  { id: 'semble-abattu', label: 'Semble abattu', color: 'gray' },
  { id: 'cris-gemissements', label: 'Cris/ gémissements', color: 'gray' },
  { id: 'agressif', label: 'Agressif', color: 'gray' },
  
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
      case 'purple':
        return 'bg-purple-300 text-purple-800 border-purple-300 hover:bg-purple-400';
      case 'green':
        return 'bg-green-300 text-green-800 border-green-300 hover:bg-green-400';
      case 'blue':
        return 'bg-blue-300 text-blue-800 border-blue-300 hover:bg-blue-400';
      case 'pink':
        return 'bg-pink-300 text-pink-800 border-pink-300 hover:bg-pink-400';
      case 'gray':
        return 'bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-400';
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
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100';
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100';
      case 'pink':
        return 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100';
      case 'gray':
        return 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100';
    }
  }
};

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomsChange,
  customSymptom,
  onCustomSymptomChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSymptoms = useMemo(() => {
    if (!searchTerm.trim()) return SYMPTOMS;
    
    return SYMPTOMS.filter(symptom =>
      symptom.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Regrouper les symptômes par couleur
  const groupedSymptoms = useMemo(() => {
    const groups: { [color: string]: typeof SYMPTOMS } = {};
    
    filteredSymptoms.forEach(symptom => {
      if (!groups[symptom.color]) {
        groups[symptom.color] = [];
      }
      groups[symptom.color].push(symptom);
    });
    
    // Ordre des couleurs pour un affichage cohérent
    const colorOrder = ['orange', 'yellow', 'purple', 'green', 'pink', 'blue', 'gray', 'red'];
    return colorOrder.filter(color => groups[color]).map(color => ({
      color,
      symptoms: groups[color]
    }));
  }, [filteredSymptoms]);

  const handleSymptomToggle = (symptomId: string, selected: boolean) => {
    if (selected) {
      onSymptomsChange([...selectedSymptoms, symptomId]);
    } else {
      onSymptomsChange(selectedSymptoms.filter(id => id !== symptomId));
    }
  };

  const showCustomInput = selectedSymptoms.includes('autre');

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

      {/* Tags des symptômes regroupés par couleur */}
      <div className="space-y-3">
        {groupedSymptoms.map(({ color, symptoms }) => (
          <div key={color} className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => handleSymptomToggle(symptom.id, !isSelected)}
                  className={`
                    inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-95
                    ${getTagColorClasses(symptom.color, isSelected)}
                  `}
                >
                  {symptom.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Zone de texte personnalisée si "Autre" est sélectionné */}
      {showCustomInput && (
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium text-vet-navy">
            Précisez le symptôme :
          </Label>
          <Textarea
            value={customSymptom}
            onChange={(e) => onCustomSymptomChange(e.target.value)}
            placeholder="Décrivez le symptôme observé..."
            className="min-h-[80px] text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors resize-none"
          />
        </div>
      )}
    </div>
  );
};

export default SymptomSelector;
