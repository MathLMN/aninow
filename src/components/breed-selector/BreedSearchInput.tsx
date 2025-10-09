
import React from 'react';
import { Input } from "@/components/ui/input";

interface BreedSearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  disabled?: boolean;
}

const BreedSearchInput: React.FC<BreedSearchInputProps> = ({
  searchTerm,
  onSearchChange,
  onFocus,
  onBlur,
  disabled = false
}) => {
  return (
    <Input
      type="text"
      placeholder="Écrivez pour affiner la recherche"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      className="h-7 text-xs"
    />
  );
};

export default BreedSearchInput;
