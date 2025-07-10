
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
    <div className="space-y-2 p-4 bg-vet-sage/5 rounded-lg border-2 border-vet-sage/20 animate-fade-in">
      <div className="flex items-center gap-2">
        <Heart className="h-4 w-4 text-vet-sage" />
        <Label 
          htmlFor={id} 
          className="text-base font-semibold text-vet-navy flex-1"
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
        className={`text-base h-12 transition-all duration-200 ${
          isEmpty 
            ? 'border-vet-sage border-2 bg-white shadow-sm focus:border-vet-sage focus:ring-2 focus:ring-vet-sage/20' 
            : 'border-green-400 bg-green-50/50 focus:border-green-500'
        }`}
      />
      
      {isEmpty && (
        <p className="text-sm text-vet-brown/80 flex items-center gap-1">
          <span className="w-1 h-1 bg-vet-sage rounded-full"></span>
          Donnez un nom à votre compagnon pour personnaliser sa consultation
        </p>
      )}
    </div>
  );
};

export default AnimalNameInput;
