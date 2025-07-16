
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { PromptRuleModal } from "./PromptRuleModal";

interface PromptRulesListProps {
  rules: any[];
  templates: any[];
  isLoading: boolean;
  onCreateRule: (data: any) => Promise<any>;
  onUpdateRule: (id: string, data: any) => Promise<any>;
  onDeleteRule: (id: string) => Promise<void>;
}

export const PromptRulesList = ({
  rules,
  templates,
  isLoading,
  onCreateRule,
  onUpdateRule,
  onDeleteRule
}: PromptRulesListProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  const handleCreate = async (data: any) => {
    await onCreateRule(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (editingRule) {
      await onUpdateRule(editingRule.id, data);
      setEditingRule(null);
    }
  };

  const getConditionDescription = (conditions: any) => {
    if (!conditions) return "Aucune condition";
    
    const descriptions = [];
    
    if (conditions.animal_species) {
      const species = Array.isArray(conditions.animal_species) 
        ? conditions.animal_species.join(', ') 
        : conditions.animal_species;
      descriptions.push(`Espèce: ${species}`);
    }
    
    if (conditions.consultation_reason) {
      descriptions.push(`Motif: ${conditions.consultation_reason}`);
    }
    
    if (conditions.symptoms) {
      const symptoms = Array.isArray(conditions.symptoms) 
        ? conditions.symptoms.join(', ') 
        : conditions.symptoms;
      descriptions.push(`Symptômes: ${symptoms}`);
    }
    
    if (conditions.type === 'default') {
      descriptions.push("Règle par défaut (s'applique à tous)");
    }
    
    return descriptions.length > 0 ? descriptions.join(' • ') : "Conditions personnalisées";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-vet-brown">Chargement des règles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-vet-navy">
          {rules.length} règle{rules.length !== 1 ? 's' : ''} configurée{rules.length !== 1 ? 's' : ''}
        </h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-vet-sage hover:bg-vet-sage/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Règle
        </Button>
      </div>

      {rules.length === 0 ? (
        <Card className="border-dashed border-2 border-vet-blue/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-vet-brown mb-4">Aucune règle de sélection configurée</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              variant="outline"
              className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white"
            >
              Créer la première règle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-vet-brown/70 mb-2">
            Les règles sont appliquées par ordre de priorité (plus élevée en premier)
          </div>
          {rules.map((rule, index) => (
            <Card key={rule.id} className="border-vet-blue/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-vet-navy flex items-center gap-2">
                      <Badge variant="outline" className="bg-vet-sage/10 text-vet-sage">
                        #{rule.priority}
                      </Badge>
                      {rule.name}
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Template: {rule.prompt_templates?.name || "Template supprimé"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateRule(rule.id, { priority: rule.priority + 1 })}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateRule(rule.id, { priority: rule.priority - 1 })}
                        disabled={index === rules.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingRule(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <strong className="text-sm text-vet-navy">Conditions d'application:</strong>
                    <p className="text-sm text-vet-brown mt-1">
                      {getConditionDescription(rule.conditions)}
                    </p>
                  </div>
                  <div className="text-xs text-vet-brown/70">
                    Créé le {new Date(rule.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PromptRuleModal
        isOpen={isCreateModalOpen || !!editingRule}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingRule(null);
        }}
        onSubmit={editingRule ? handleUpdate : handleCreate}
        rule={editingRule}
        templates={templates}
        title={editingRule ? "Modifier la Règle" : "Créer une Règle"}
      />
    </div>
  );
};
