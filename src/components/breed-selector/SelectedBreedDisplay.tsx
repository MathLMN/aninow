
import React from 'react';

interface SelectedBreedDisplayProps {
  selectedBreed: string;
  isVisible: boolean;
}

const SelectedBreedDisplay: React.FC<SelectedBreedDisplayProps> = ({
  selectedBreed,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="mt-2 p-2 bg-vet-beige/20 rounded border text-sm text-vet-navy">
      Race sélectionnée: <strong>{selectedBreed}</strong>
    </div>
  );
};

export default SelectedBreedDisplay;
