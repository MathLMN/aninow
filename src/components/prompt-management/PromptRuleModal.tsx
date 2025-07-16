
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PromptRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  rule?: any;
  templates: any[];
  title: string;
}

export const PromptRuleModal = ({
  isOpen,
  onClose,
  onSubmit,
  rule,
  templates,
  title
}: PromptRuleModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    template_id: "",
    priority: 1,
    is_active: true,
    conditions: {
      type: "custom",
      animal_species: [],
      consultation_reason: "",
      symptoms: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const animalSpecies = ["chien", "chat", "lapin", "oiseau", "rongeur", "reptile", "autre"];
  const consultationReasons = ["consultation-convenance", "symptomes-anomalie", "urgence"];
  const commonSymptoms = [
    "vomissements-repetes", "diarrhee-sanglante", "difficulte-respirer", 
    "perte-de-connaissance", "convulsions", "saignement-abondant",
    "douleur-intense", "fievre-elevee", "blessure-ouverte"
  ];

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || "",
        template_id: rule.template_id || "",
        priority: rule.priority || 1,
        is_active: rule.is_active ?? true,
        conditions: rule.conditions || {
          type: "custom",
          animal_species: [],
          consultation_reason: "",
          symptoms: []
        }
      });
    } else {
      setFormData({
        name: "",
        template_id: "",
        priority: 1,
        is_active: true,
        conditions: {
          type: "custom",
          animal_species: [],
          consultation_reason: "",
          symptoms: []
        }
      });
    }
  }, [rule, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecies = (species: string) => {
    if (!formData.conditions.animal_species.includes(species)) {
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          animal_species: [...prev.conditions.animal_species, species]
        }
      }));
    }
  };

  const removeSpecies = (species: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        animal_species: prev.conditions.animal_species.filter(s => s !== species)
      }
    }));
  };

  const addSymptom = (symptom: string) => {
    if (!formData.conditions.symptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          symptoms: [...prev.conditions.symptoms, symptom]
        }
      }));
    }
  };

  const removeSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        symptoms: prev.conditions.symptoms.filter(s => s !== symptom)
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">{title}</DialogTitle>
          <DialogDescription>
            Définissez les conditions qui déterminent quand utiliser ce template
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la règle *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Urgence Chien Chat"
                  required
                />
              </div>

              <div>
                <Label htmlFor="template_id">Template associé *</Label>
                <Select
                  value={formData.template_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, template_id: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-vet-brown/70 mt-1">
                  Plus le nombre est élevé, plus la règle a la priorité
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Règle active</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Type de règle</Label>
                <Select
                  value={formData.conditions.type}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions, type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Conditions personnalisées</SelectItem>
                    <SelectItem value="default">Règle par défaut</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.conditions.type === "custom" && (
                <>
                  <div>
                    <Label>Espèces concernées</Label>
                    <Select onValueChange={addSpecies}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ajouter une espèce" />
                      </SelectTrigger>
                      <SelectContent>
                        {animalSpecies.map((species) => (
                          <SelectItem key={species} value={species}>
                            {species}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.conditions.animal_species.map((species) => (
                        <Badge key={species} variant="secondary" className="cursor-pointer">
                          {species}
                          <X 
                            className="h-3 w-3 ml-1" 
                            onClick={() => removeSpecies(species)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Motif de consultation</Label>
                    <Select
                      value={formData.conditions.consultation_reason}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, consultation_reason: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un motif" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les motifs</SelectItem>
                        {consultationReasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason === "consultation-convenance" ? "Consultation de convenance" :
                             reason === "symptomes-anomalie" ? "Symptômes/Anomalie" :
                             reason === "urgence" ? "Urgence" : reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Symptômes concernés</Label>
                    <Select onValueChange={addSymptom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ajouter un symptôme" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonSymptoms.map((symptom) => (
                          <SelectItem key={symptom} value={symptom}>
                            {symptom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.conditions.symptoms.map((symptom) => (
                        <Badge key={symptom} variant="secondary" className="cursor-pointer">
                          {symptom}
                          <X 
                            className="h-3 w-3 ml-1" 
                            onClick={() => removeSymptom(symptom)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-sage hover:bg-vet-sage/90"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
