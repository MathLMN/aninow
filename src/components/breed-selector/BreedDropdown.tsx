
import React from 'react';

interface BreedDropdownProps {
  breeds: string[];
  isVisible: boolean;
  onBreedClick: (breed: string) => void;
}

const BreedDropdown: React.FC<BreedDropdownProps> = ({
  breeds,
  isVisible,
  onBreedClick
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {breeds.map(breed => (
        <button
          key={breed}
          type="button"
          onClick={() => onBreedClick(breed)}
          className="w-full px-3 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg text-sm"
        >
          {breed}
        </button>
      ))}
      {breeds.length === 1 && breeds[0] === 'Autre' && (
        <div className="px-3 py-2 text-gray-500 text-sm">
          Aucune race trouvée
        </div>
      )}
    </div>
  );
};

export default BreedDropdown;
