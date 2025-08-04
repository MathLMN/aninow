
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Settings, Clock, AlertTriangle, Shield } from 'lucide-react';
import { 
  enableConfigMode, 
  disableConfigMode, 
  isConfigModeEnabled, 
  getRemainingConfigTime 
} from '@/lib/configMode';

export const ConfigModeToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    // Check initial state
    updateState();

    // Update every minute
    const interval = setInterval(updateState, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateState = () => {
    setIsEnabled(isConfigModeEnabled());
    setRemainingTime(getRemainingConfigTime());
  };

  const handleToggle = () => {
    if (isEnabled) {
      disableConfigMode();
    } else {
      enableConfigMode(duration);
    }
    updateState();
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-vet-navy">
          <Settings className="h-5 w-5" />
          <span>Mode Configuration</span>
        </CardTitle>
        <CardDescription className="text-vet-brown">
          Contournement temporaire de l'authentification pour la configuration du logiciel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning Alert */}
        <Alert className="border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Attention:</strong> Ce mode désactive la sécurité temporairement. 
            À utiliser uniquement pour la configuration initiale du logiciel.
          </AlertDescription>
        </Alert>

        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className={`h-5 w-5 ${isEnabled ? 'text-amber-600' : 'text-green-600'}`} />
            <div>
              <div className="font-medium text-vet-navy">
                Authentification {isEnabled ? 'Contournée' : 'Activée'}
              </div>
              {isEnabled && remainingTime > 0 && (
                <div className="text-sm text-vet-brown flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Expire dans {remainingTime} minutes</span>
                </div>
              )}
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Duration Setting */}
        {!isEnabled && (
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-vet-navy">
              Durée du contournement (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="5"
              max="240"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
              className="border-vet-blue/30 focus:border-vet-sage focus:ring-vet-sage"
            />
            <p className="text-xs text-vet-brown">
              Recommandé: 60 minutes maximum pour des raisons de sécurité
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={handleToggle}
            variant={isEnabled ? "destructive" : "default"}
            className={isEnabled 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-vet-sage hover:bg-vet-sage/90"
            }
          >
            {isEnabled ? 'Désactiver le mode configuration' : 'Activer le mode configuration'}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-vet-brown space-y-1">
          <p><strong>Mode activé:</strong> Toutes les pages vétérinaires sont accessibles sans connexion</p>
          <p><strong>Expiration:</strong> Le mode se désactive automatiquement après la durée définie</p>
          <p><strong>Sécurité:</strong> Désactivez ce mode une fois la configuration terminée</p>
        </div>
      </CardContent>
    </Card>
  );
};
