
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface PromptTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  template?: any;
  title: string;
}

export const PromptTemplateModal = ({
  isOpen,
  onClose,
  onSubmit,
  template,
  title
}: PromptTemplateModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    system_prompt: "",
    user_prompt_template: "",
    is_active: true,
    variables: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        description: template.description || "",
        system_prompt: template.system_prompt || "",
        user_prompt_template: template.user_prompt_template || "",
        is_active: template.is_active ?? true,
        variables: template.variables || {}
      });
    } else {
      setFormData({
        name: "",
        description: "",
        system_prompt: "",
        user_prompt_template: "",
        is_active: true,
        variables: {}
      });
    }
  }, [template, isOpen]);

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

  const extractVariables = () => {
    const variables: Record<string, string> = {};
    const regex = /\{\{([^}]+)\}\}/g;
    let match;
    
    while ((match = regex.exec(formData.user_prompt_template)) !== null) {
      const varName = match[1].replace(/[#/]/g, '');
      variables[varName] = "string";
    }
    
    setFormData(prev => ({ ...prev, variables }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">{title}</DialogTitle>
          <DialogDescription>
            Configurez le template de prompt pour l'analyse IA
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du template *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Analyse Chien Urgence"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du template et de son usage"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Template actif</Label>
              </div>

              <div>
                <Label>Variables détectées</Label>
                <div className="bg-vet-beige/20 p-3 rounded-md min-h-[100px]">
                  {Object.keys(formData.variables).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(formData.variables).map((variable) => (
                        <span key={variable} className="bg-vet-sage/20 text-vet-sage px-2 py-1 rounded text-sm">
                          {variable}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-vet-brown/60 text-sm">
                      Aucune variable détectée. Utilisez {"{{"} et {"}}"} dans le template utilisateur.
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={extractVariables}
                  className="mt-2"
                >
                  Détecter les variables
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="system_prompt">Prompt système *</Label>
                <Textarea
                  id="system_prompt"
                  value={formData.system_prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, system_prompt: e.target.value }))}
                  placeholder="Instructions pour l'IA sur son rôle et le format de réponse attendu..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="user_prompt_template">Template du prompt utilisateur *</Label>
                <Textarea
                  id="user_prompt_template"
                  value={formData.user_prompt_template}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_prompt_template: e.target.value }))}
                  placeholder="Template avec variables: Analyse pour {{animal_name}} ({{animal_species}})..."
                  rows={8}
                  required
                />
                <p className="text-xs text-vet-brown/70 mt-1">
                  Utilisez {"{{"} variable {"}}"} pour les variables dynamiques. 
                  Utilisez {"{{"} #variable {"}}"} contenu {"{{"} /variable {"}}"} pour les conditions.
                </p>
              </div>
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
