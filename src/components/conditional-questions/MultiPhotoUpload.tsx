import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiPhotoUploadProps {
  photoKey: string;
  keyPrefix?: string;
  answers: {[key: string]: string | File};
  onFileChange: (questionKey: string, file: File | null) => void;
  maxPhotos?: number;
}

const MultiPhotoUpload = ({ 
  photoKey, 
  keyPrefix = '', 
  answers, 
  onFileChange,
  maxPhotos = 3 
}: MultiPhotoUploadProps) => {
  // Get all uploaded photos
  const uploadedPhotos: Array<{ key: string; file: File; index: number }> = [];
  for (let i = 1; i <= maxPhotos; i++) {
    const key = `${photoKey}_${i}`;
    const file = answers[keyPrefix + key];
    if (file instanceof File) {
      uploadedPhotos.push({ key, file, index: i });
    }
  }

  const canAddMore = uploadedPhotos.length < maxPhotos;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Find the next available slot
    for (let i = 1; i <= maxPhotos; i++) {
      const key = `${photoKey}_${i}`;
      if (!answers[keyPrefix + key]) {
        onFileChange(key, file);
        break;
      }
    }

    // Reset input
    e.target.value = '';
  };

  const handleRemovePhoto = (key: string) => {
    onFileChange(key, null);
  };

  return (
    <div className="space-y-4 ml-0 sm:ml-10">
      {/* Upload button */}
      {canAddMore && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id={`${keyPrefix}${photoKey}-upload`}
          />
          <label
            htmlFor={`${keyPrefix}${photoKey}-upload`}
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Cliquez pour ajouter une photo
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadedPhotos.length > 0 
                  ? `${uploadedPhotos.length}/${maxPhotos} photo${uploadedPhotos.length > 1 ? 's' : ''} ajoutée${uploadedPhotos.length > 1 ? 's' : ''}`
                  : `Jusqu'à ${maxPhotos} photos`}
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Uploaded photos grid - compact thumbnails */}
      {uploadedPhotos.length > 0 && (
        <div className="flex flex-wrap gap-3 ml-0 sm:ml-10">
          {uploadedPhotos.map(({ key, file, index }) => (
            <div 
              key={key}
              className="relative group w-24 h-24 border-2 border-border rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Photo ${index}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemovePhoto(key)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedPhotos.length === maxPhotos && (
        <p className="text-sm text-muted-foreground text-center">
          Nombre maximum de photos atteint ({maxPhotos}/{maxPhotos})
        </p>
      )}
    </div>
  );
};

export default MultiPhotoUpload;
