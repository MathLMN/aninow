
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import SelectionButton from "@/components/SelectionButton";

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  customSymptom: string;
  onCustomSymptomChange: (symptom: string) => void;
}

const SYMPTOMS = [
  // Couleur rouge/orange - symptômes digestifs
  { id: 'vomissements', label: 'Vomissements', color: 'red' },
  { id: 'diarrhee', label: 'Diarrhée', color: 'red' },
  { id: 'sang-selles', label: 'Sang dans les selles', color: 'red' },
  
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
  
  // Couleur violette - symptômes locomoteurs
  { id: 'boiterie', label: 'Boiterie', color: 'purple' },
  { id: 'difficultes-respiratoires', label: 'Difficultés respiratoires', color: 'purple' },
  
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

const getButtonColorClasses = (color: string) => {
  switch (color) {
    case 'red':
      return 'text-red-700 hover:bg-red-50 data-[selected=true]:bg-red-500 data-[selected=true]:text-white';
    case 'yellow':
      return 'text-yellow-700 hover:bg-yellow-50 data-[selected=true]:bg-yellow-500 data-[selected=true]:text-white';
    case 'purple':
      return 'text-purple-700 hover:bg-purple-50 data-[selected=true]:bg-purple-500 data-[selected=true]:text-white';
    case 'green':
      return 'text-green-700 hover:bg-green-50 data-[selected=true]:bg-green-500 data-[selected=true]:text-white';
    case 'blue':
      return 'text-blue-700 hover:bg-blue-50 data-[selected=true]:bg-blue-500 data-[selected=true]:text-white';
    case 'gray':
      return 'text-gray-700 hover:bg-gray-50 data-[selected=true]:bg-gray-500 data-[selected=true]:text-white';
    default:
      return 'text-gray-700 hover:bg-gray-50 data-[selected=true]:bg-gray-500 data-[selected=true]:text-white';
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
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher une option"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
        />
      </div>

      {/* Liste des symptômes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {filteredSymptoms.map((symptom) => (
          <button
            key={symptom.id}
            type="button"
            onClick={() => handleSymptomToggle(symptom.id, !selectedSymptoms.includes(symptom.id))}
            data-selected={selectedSymptoms.includes(symptom.id)}
            className={`
              p-3 border rounded-lg transition-all duration-200 cursor-pointer text-left text-sm sm:text-base
              border-gray-300 bg-white hover:border-current
              ${getButtonColorClasses(symptom.color)}
            `}
          >
            {symptom.label}
          </button>
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
