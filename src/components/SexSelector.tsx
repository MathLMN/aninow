
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SexSelectorProps {
  selectedSex: string;
  onSexChange: (sex: string) => void;
}

const SexSelector: React.FC<SexSelectorProps> = ({
  selectedSex,
  onSexChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base font-medium text-vet-navy">
        Quel est son sexe ?
        <span className="text-vet-navy ml-1">*</span>
      </Label>
      <Select value={selectedSex} onValueChange={onSexChange}>
        <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors [&>span]:text-gray-400">
          <SelectValue placeholder="Cliquez et sélectionnez" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Mâle</SelectItem>
          <SelectItem value="femelle">Femelle</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SexSelector;
