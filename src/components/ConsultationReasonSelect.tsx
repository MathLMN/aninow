
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
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-vet-navy">
        Pour quel motif souhaitez-vous une consultation ? *
      </Label>
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-12 text-base bg-white border border-gray-300 rounded-md">
          <SelectValue placeholder="Cliquez et choisissez le motif" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 shadow-lg">
          <SelectItem value="symptomes-anomalie" className="text-sm py-2">
            Symptômes ou anomalie (boiterie, vomissements,...)
          </SelectItem>
          <SelectItem value="consultation-convenance" className="text-sm py-2">
            Consultation de convenance (vaccins, contrôle,...)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConsultationReasonSelect;
