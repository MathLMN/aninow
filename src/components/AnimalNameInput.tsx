
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

interface AnimalNameInputProps {
  name: string;
  onNameChange: (value: string) => void;
  placeholder: string;
  id: string;
}

const AnimalNameInput: React.FC<AnimalNameInputProps> = ({
  name,
  onNameChange,
  placeholder,
  id
}) => {
  const isEmpty = !name || name.trim() === '';

  return (
    <div className="space-y-1.5 p-3 bg-vet-sage/5 rounded-lg border border-vet-sage/20 animate-fade-in">
      <div className="flex items-center gap-2">
        <Heart className="h-3.5 w-3.5 text-vet-sage" />
        <Label 
          htmlFor={id} 
          className="text-sm font-semibold text-vet-navy flex-1"
        >
          Nom de votre animal *
        </Label>
        {isEmpty && (
          <span className="text-xs text-vet-brown/70 font-medium">
            Requis
          </span>
        )}
      </div>
      
      <Input 
        id={id} 
        value={name} 
        onChange={e => onNameChange(e.target.value)} 
        placeholder={placeholder}
        className="text-sm h-10 transition-all duration-200 border-vet-sage bg-white shadow-sm focus:border-vet-sage focus:ring-2 focus:ring-vet-sage/20"
      />
    </div>
  );
};

export default AnimalNameInput;
