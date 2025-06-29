
import React from 'react';
import { Input } from "@/components/ui/input";

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
  return (
    <div>
      <Input 
        id={id} 
        value={name} 
        onChange={e => onNameChange(e.target.value)} 
        placeholder={placeholder} 
        className="text-base" 
      />
    </div>
  );
};

export default AnimalNameInput;
