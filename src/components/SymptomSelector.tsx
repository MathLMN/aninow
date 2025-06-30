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
        return 'bg-red-500 text-white border-red-500 hover:bg-red-600';
      case 'orange':
        return 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600';
      case 'yellow':
        return 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600';
      case 'purple':
        return 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600';
      case 'green':
        return 'bg-green-500 text-white border-green-500 hover:bg-green-600';
      case 'blue':
        return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
      case 'pink':
        return 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600';
      case 'gray':
        return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
    }
  } else {
    switch (color) {
      case 'red':
        return 'bg-white text-red-700 border-red-300 hover:bg-red-50';
      case 'orange':
        return 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50';
      case 'yellow':
        return 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50';
      case 'purple':
        return 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50';
      case 'green':
        return 'bg-white text-green-700 border-green-300 hover:bg-green-50';
      case 'blue':
        return 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50';
      case 'pink':
        return 'bg-white text-pink-700 border-pink-300 hover:bg-pink-50';
      case 'gray':
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
      default:
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
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

      {/* Tags des symptômes */}
      <div className="flex flex-wrap gap-2">
        {filteredSymptoms.map((symptom) => {
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
