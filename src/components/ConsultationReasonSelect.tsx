
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
    <div className="space-y-2 sm:space-y-4">
      <Label className="text-base sm:text-lg font-semibold text-vet-navy block">
        Pour quel motif souhaitez-vous une consultation ? *
      </Label>
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-10 sm:h-12 text-sm sm:text-base bg-white border border-gray-300 rounded-md">
          <SelectValue placeholder="Cliquez et choisissez le motif" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
          <SelectItem value="symptomes-anomalie" className="text-xs sm:text-sm py-2 sm:py-2 leading-tight">
            Symptômes ou anomalie (boiterie, vomissements,...)
          </SelectItem>
          <SelectItem value="consultation-convenance" className="text-xs sm:text-sm py-2 sm:py-2 leading-tight">
            Consultation de convenance (vaccins, contrôle,...)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConsultationReasonSelect;
