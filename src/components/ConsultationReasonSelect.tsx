
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConsultationReasonSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ConsultationReasonSelect: React.FC<ConsultationReasonSelectProps> = ({
  value,
  onValueChange
}) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <Label className="text-base sm:text-lg font-semibold text-vet-navy block leading-tight">
        Pour quel motif souhaitez-vous une consultation ? *
      </Label>
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-12 sm:h-11 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
          <SelectValue 
            placeholder="Cliquez et choisissez le motif" 
            className="text-gray-500"
          />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-200 shadow-xl z-50 rounded-lg">
          <SelectItem 
            value="symptomes-anomalie" 
            className="text-sm sm:text-base py-2 sm:py-3 px-3 sm:px-4 leading-tight hover:bg-vet-beige/50 cursor-pointer"
          >
            🩺 Symptômes ou anomalie (boiterie, vomissements,...)
          </SelectItem>
          <SelectItem 
            value="consultation-convenance" 
            className="text-sm sm:text-base py-2 sm:py-3 px-3 sm:px-4 leading-tight hover:bg-vet-beige/50 cursor-pointer"
          >
            💉 Consultation de convenance (vaccins, contrôle,...)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConsultationReasonSelect;
