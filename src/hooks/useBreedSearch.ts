
import { useState } from 'react';

export const useBreedSearch = (baseBreeds: string[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Filtrer les races selon le terme de recherche
  const filteredBreeds = searchTerm 
    ? baseBreeds.filter(breed => 
        breed.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : baseBreeds;

  // Ajouter l'option "Autre" à la fin
  const breedsWithOther = [...filteredBreeds, 'Autre'];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur les options
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    isInputFocused,
    filteredBreeds,
    breedsWithOther,
    handleSearchChange,
    handleInputFocus,
    handleInputBlur,
    clearSearch
  };
};
