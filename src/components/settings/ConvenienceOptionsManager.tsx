import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, GripVertical, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ConvenienceOption {
  value: string;
  label: string;
  color: string;
  isActive: boolean;
  isOther?: boolean;
}

interface ConvenienceOptionsManagerProps {
  options: ConvenienceOption[];
  onOptionsChange: (options: ConvenienceOption[]) => void;
}

const COLOR_PALETTE = [
  { name: 'Rouge', classes: 'bg-red-100 text-red-600 border-red-200' },
  { name: 'Orange', classes: 'bg-orange-100 text-orange-600 border-orange-200' },
  { name: 'Jaune', classes: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { name: 'Vert', classes: 'bg-green-100 text-green-600 border-green-200' },
  { name: 'Bleu', classes: 'bg-blue-100 text-blue-600 border-blue-200' },
  { name: 'Violet', classes: 'bg-purple-100 text-purple-600 border-purple-200' },
  { name: 'Rose', classes: 'bg-pink-100 text-pink-600 border-pink-200' },
  { name: 'Cyan', classes: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
  { name: 'Indigo', classes: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { name: 'Gris', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
];

export const ConvenienceOptionsManager: React.FC<ConvenienceOptionsManagerProps> = ({
  options,
  onOptionsChange
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ConvenienceOption | null>(null);
  const [newOption, setNewOption] = useState<Partial<ConvenienceOption>>({
    value: '',
    label: '',
    color: COLOR_PALETTE[0].classes,
    isActive: true,
    isOther: false
  });

  const handleToggleActive = (value: string) => {
    const updatedOptions = options.map(opt =>
      opt.value === value ? { ...opt, isActive: !opt.isActive } : opt
    );
    onOptionsChange(updatedOptions);
  };

  const handleEditClick = (option: ConvenienceOption) => {
    if (option.isOther) {
      toast({
        title: "Action non autorisée",
        description: "L'option 'Autre' ne peut pas être modifiée",
        variant: "destructive"
      });
      return;
    }
    setEditingOption(option);
    setNewOption({
      value: option.value,
      label: option.label,
      color: option.color,
      isActive: option.isActive,
      isOther: false
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingOption(null);
    setNewOption({
      value: '',
      label: '',
      color: COLOR_PALETTE[0].classes,
      isActive: true,
      isOther: false
    });
    setIsDialogOpen(true);
  };

  const handleSaveOption = () => {
    if (!newOption.label?.trim()) {
      toast({
        title: "Erreur",
        description: "Le libellé est obligatoire",
        variant: "destructive"
      });
      return;
    }

    // Générer un value slug depuis le label si c'est une nouvelle option
    const optionValue = editingOption 
      ? newOption.value! 
      : newOption.label!.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Retirer accents
          .replace(/[^a-z0-9]+/g, '-') // Remplacer caractères spéciaux par -
          .replace(/^-+|-+$/g, ''); // Retirer - en début/fin

    if (editingOption) {
      // Modification
      const updatedOptions = options.map(opt =>
        opt.value === editingOption.value
          ? { ...opt, label: newOption.label!, color: newOption.color! }
          : opt
      );
      onOptionsChange(updatedOptions);
      toast({
        title: "Option modifiée",
        description: "L'option a été mise à jour avec succès"
      });
    } else {
      // Ajout
      // Vérifier que le value n'existe pas déjà
      if (options.some(opt => opt.value === optionValue)) {
        toast({
          title: "Erreur",
          description: "Une option avec ce nom existe déjà",
          variant: "destructive"
        });
        return;
      }

      const newOptionComplete: ConvenienceOption = {
        value: optionValue,
        label: newOption.label!,
        color: newOption.color!,
        isActive: true,
        isOther: false
      };

      // Insérer avant l'option "Autre"
      const otherIndex = options.findIndex(opt => opt.isOther);
      if (otherIndex !== -1) {
        const updatedOptions = [
          ...options.slice(0, otherIndex),
          newOptionComplete,
          ...options.slice(otherIndex)
        ];
        onOptionsChange(updatedOptions);
      } else {
        onOptionsChange([...options, newOptionComplete]);
      }

      toast({
        title: "Option créée",
        description: "La nouvelle option a été ajoutée avec succès"
      });
    }

    setIsDialogOpen(false);
    setEditingOption(null);
  };

  const handleDeleteOption = (value: string) => {
    const option = options.find(opt => opt.value === value);
    if (option?.isOther) {
      toast({
        title: "Action non autorisée",
        description: "L'option 'Autre' ne peut pas être supprimée",
        variant: "destructive"
      });
      return;
    }

    const updatedOptions = options.filter(opt => opt.value !== value);
    onOptionsChange(updatedOptions);
    toast({
      title: "Option supprimée",
      description: "L'option a été supprimée avec succès"
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedOptions = [...options];
    [updatedOptions[index - 1], updatedOptions[index]] = [updatedOptions[index], updatedOptions[index - 1]];
    onOptionsChange(updatedOptions);
  };

  const handleMoveDown = (index: number) => {
    // Ne pas permettre de déplacer l'option "Autre"
    const otherIndex = options.findIndex(opt => opt.isOther);
    if (index >= options.length - 1 || index === otherIndex - 1) return;
    
    const updatedOptions = [...options];
    [updatedOptions[index], updatedOptions[index + 1]] = [updatedOptions[index + 1], updatedOptions[index]];
    onOptionsChange(updatedOptions);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardHeader>
        <CardTitle className="text-vet-navy">Options de consultation de convenance</CardTitle>
        <CardDescription>
          Personnalisez les options proposées aux clients lors de la prise de rendez-vous en ligne
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Liste des options */}
        <div className="space-y-2">
          {options.map((option, index) => (
            <div
              key={option.value}
              className="flex items-center gap-2 p-3 bg-background rounded-lg border border-border hover:border-border/80 transition-colors"
            >
              {/* Poignée de déplacement */}
              <div className="flex flex-col gap-0.5 cursor-move text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-accent"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || option.isOther}
                >
                  <GripVertical className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-accent"
                  onClick={() => handleMoveDown(index)}
                  disabled={index >= options.length - 1 || option.isOther}
                >
                  <GripVertical className="h-3 w-3" />
                </Button>
              </div>

              {/* Badge de l'option */}
              <div className={`flex-1 px-3 py-2 rounded-full border text-sm font-medium ${option.color}`}>
                {option.label}
                {option.isOther && ' 🔒'}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Toggle actif/inactif */}
                <div className="flex items-center gap-2">
                  {option.isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <Switch
                    checked={option.isActive}
                    onCheckedChange={() => handleToggleActive(option.value)}
                  />
                </div>

                {/* Bouton éditer */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(option)}
                  disabled={option.isOther}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                {/* Bouton supprimer */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={option.isOther}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'option "{option.label}" ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteOption(option.value)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton ajouter */}
        <Button onClick={handleAddNew} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une option
        </Button>

        {/* Dialog ajouter/modifier */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOption ? 'Modifier l\'option' : 'Ajouter une option'}
              </DialogTitle>
              <DialogDescription>
                {editingOption 
                  ? 'Modifiez le libellé et la couleur de l\'option' 
                  : 'Créez une nouvelle option de consultation de convenance'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="label">Libellé *</Label>
                <Input
                  id="label"
                  placeholder="Ex: Bilan gériatrique"
                  value={newOption.label || ''}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Select
                  value={newOption.color}
                  onValueChange={(value) => setNewOption({ ...newOption, color: value })}
                >
                  <SelectTrigger id="color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {COLOR_PALETTE.map((color) => (
                      <SelectItem key={color.classes} value={color.classes}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full border ${color.classes}`} />
                          <span>{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aperçu */}
              <div className="space-y-2">
                <Label>Aperçu</Label>
                <div className={`px-3 py-2 rounded-full border text-sm font-medium inline-block ${newOption.color}`}>
                  {newOption.label || 'Aperçu de l\'option'}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveOption}>
                {editingOption ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
