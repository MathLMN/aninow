import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BodyZoneSelectorProps {
  selectedZones: string[];
  onZonesChange: (zones: string[]) => void;
  keyPrefix?: string;
}

const BODY_ZONES = [
  { id: 'head', label: 'Tête' },
  { id: 'ears', label: 'Oreilles' },
  { id: 'neck', label: 'Cou' },
  { id: 'back', label: 'Dos' },
  { id: 'belly', label: 'Ventre/Abdomen' },
  { id: 'chest', label: 'Poitrine' },
  { id: 'front_left', label: 'Patte avant gauche' },
  { id: 'front_right', label: 'Patte avant droite' },
  { id: 'back_left', label: 'Patte arrière gauche' },
  { id: 'back_right', label: 'Patte arrière droite' },
  { id: 'tail', label: 'Queue' },
];

const BodyZoneSelector = ({ selectedZones, onZonesChange }: BodyZoneSelectorProps) => {
  const handleZoneToggle = (zoneId: string) => {
    const currentZones = Array.isArray(selectedZones) ? selectedZones : [];
    if (currentZones.includes(zoneId)) {
      onZonesChange(currentZones.filter(z => z !== zoneId));
    } else {
      onZonesChange([...currentZones, zoneId]);
    }
  };

  return (
    <div className="ml-0 sm:ml-10 mt-4">
      <label className="block text-sm font-medium text-foreground mb-3">
        Sélectionnez toutes les zones concernées <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BODY_ZONES.map((zone) => {
          const isChecked = Array.isArray(selectedZones) && selectedZones.includes(zone.id);
          return (
            <div
              key={zone.id}
              className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isChecked
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 bg-background'
              }`}
              onClick={() => handleZoneToggle(zone.id)}
            >
              <Checkbox
                id={zone.id}
                checked={isChecked}
                onCheckedChange={() => handleZoneToggle(zone.id)}
                className="pointer-events-none"
              />
              <Label
                htmlFor={zone.id}
                className="flex-1 cursor-pointer text-sm font-medium leading-tight"
              >
                {zone.label}
              </Label>
            </div>
          );
        })}
      </div>
      {Array.isArray(selectedZones) && selectedZones.length > 0 && (
        <div className="mt-3 p-2 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">{selectedZones.length} zone(s) sélectionnée(s):</span>{' '}
            {selectedZones.map(zId => BODY_ZONES.find(z => z.id === zId)?.label).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default BodyZoneSelector;
