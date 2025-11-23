import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Camera, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PhotoGalleryProps {
  conditionalAnswers: any;
}

interface PhotoItem {
  key: string;
  path: string;
  url: string | null;
  type: 'wound' | 'lump' | 'other';
  label: string;
}

export interface PhotoGalleryRef {
  openFirstPhoto: () => void;
  getPhotoCount: () => number;
}

export const PhotoGallery = forwardRef<PhotoGalleryRef, PhotoGalleryProps>(({ conditionalAnswers }, ref) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [conditionalAnswers]);

  const loadPhotos = async () => {
    if (!conditionalAnswers) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const photoItems: PhotoItem[] = [];

    for (const [key, value] of Object.entries(conditionalAnswers)) {
      if (key.includes('photo') && typeof value === 'string' && value.length > 0) {
        const path = value;
        let type: 'wound' | 'lump' | 'other' = 'other';
        let label = 'Photo';

        if (key.includes('wound_photo')) {
          type = 'wound';
          label = `Plaie - Photo ${key.split('_').pop()}`;
        } else if (key.includes('lump_photo')) {
          type = 'lump';
          label = `Grosseur - Photo ${key.split('_').pop()}`;
        } else if (key.includes('other_symptom_photo')) {
          type = 'other';
          label = `Autre symptôme - Photo ${key.split('_').pop()}`;
        }

        // Générer une URL signée temporaire (valide 1h)
        try {
          const { data, error } = await supabase.storage
            .from('consultation-photos')
            .createSignedUrl(path, 3600);

          if (error) {
            console.error(`Error creating signed URL for ${key}:`, error);
            photoItems.push({ key, path, url: null, type, label });
          } else {
            photoItems.push({ key, path, url: data.signedUrl, type, label });
          }
        } catch (err) {
          console.error(`Error processing photo ${key}:`, err);
          photoItems.push({ key, path, url: null, type, label });
        }
      }
    }

    setPhotos(photoItems);
    setIsLoading(false);
  };

  useImperativeHandle(ref, () => ({
    openFirstPhoto: () => {
      if (photos.length > 0) {
        setSelectedPhotoIndex(0);
      }
    },
    getPhotoCount: () => photos.length
  }));

  const openPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Chargement des photos...</span>
        </div>
      </Card>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'wound': return 'Plaie';
      case 'lump': return 'Grosseur';
      case 'other': return 'Autre';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wound': return 'bg-red-100 text-red-800 border-red-300';
      case 'lump': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'other': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Grouper les photos par type
  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.type]) {
      acc[photo.type] = [];
    }
    acc[photo.type].push(photo);
    return acc;
  }, {} as Record<string, PhotoItem[]>);

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="h-5 w-5 text-vet-sage" />
          <h3 className="font-semibold text-foreground">Photos jointes ({photos.length})</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedPhotos).map(([type, typePhotos]) => (
            <div key={type}>
              <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mb-2 ${getTypeColor(type)}`}>
                {getTypeLabel(type)}
              </div>
              <div className="flex flex-wrap gap-3">
                {typePhotos.map((photo, index) => {
                  const globalIndex = photos.findIndex(p => p.key === photo.key);
                  return (
                    <div
                      key={photo.key}
                      className="relative group cursor-pointer"
                      onClick={() => openPhoto(globalIndex)}
                    >
                      <div className="w-24 h-24 border-2 border-border rounded-lg overflow-hidden bg-muted">
                        {photo.url ? (
                          <img
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Camera className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Agrandir</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal plein écran */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <Dialog open={true} onOpenChange={closePhoto}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
            <div className="relative w-full h-[90vh] flex items-center justify-center">
              {/* Bouton fermer */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={closePhoto}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Bouton précédent */}
              {selectedPhotoIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* Image */}
              <div className="w-full h-full flex items-center justify-center p-8">
                {photos[selectedPhotoIndex].url ? (
                  <img
                    src={photos[selectedPhotoIndex].url!}
                    alt={photos[selectedPhotoIndex].label}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-white text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Photo non disponible</p>
                  </div>
                )}
              </div>

              {/* Bouton suivant */}
              {selectedPhotoIndex < photos.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}

              {/* Légende et compteur */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                <p className="text-sm font-medium mb-1">{photos[selectedPhotoIndex].label}</p>
                <p className="text-xs opacity-75">
                  {selectedPhotoIndex + 1} / {photos.length}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});
