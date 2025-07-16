
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Copy } from "lucide-react";
import { PromptTemplateModal } from "./PromptTemplateModal";
import { PromptTemplatePreview } from "./PromptTemplatePreview";

interface PromptTemplatesListProps {
  templates: any[];
  isLoading: boolean;
  onCreateTemplate: (data: any) => Promise<any>;
  onUpdateTemplate: (id: string, data: any) => Promise<any>;
  onDeleteTemplate: (id: string) => Promise<void>;
}

export const PromptTemplatesList = ({
  templates,
  isLoading,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}: PromptTemplatesListProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const handleCreate = async (data: any) => {
    await onCreateTemplate(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (editingTemplate) {
      await onUpdateTemplate(editingTemplate.id, data);
      setEditingTemplate(null);
    }
  };

  const handleDuplicate = async (template: any) => {
    const duplicatedTemplate = {
      ...template,
      name: `${template.name} (Copie)`,
      id: undefined,
      created_at: undefined,
      updated_at: undefined
    };
    await onCreateTemplate(duplicatedTemplate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-vet-brown">Chargement des templates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-vet-navy">
          {templates.length} template{templates.length !== 1 ? 's' : ''} configuré{templates.length !== 1 ? 's' : ''}
        </h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-vet-sage hover:bg-vet-sage/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="border-dashed border-2 border-vet-blue/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-vet-brown mb-4">Aucun template de prompt configuré</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              variant="outline"
              className="border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white"
            >
              Créer le premier template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="border-vet-blue/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-vet-navy flex items-center gap-2">
                      {template.name}
                      <Badge variant={template.is_active ? "default" : "secondary"}>
                        {template.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {template.description || "Aucune description"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteTemplate(template.id)}
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
                    <strong className="text-sm text-vet-navy">Prompt système:</strong>
                    <p className="text-sm text-vet-brown mt-1 truncate">
                      {template.system_prompt}
                    </p>
                  </div>
                  <div>
                    <strong className="text-sm text-vet-navy">Variables disponibles:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.keys(template.variables || {}).map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-vet-brown/70">
                    Créé le {new Date(template.created_at).toLocaleDateString('fr-FR')}
                    {template.updated_at !== template.created_at && (
                      <span> • Modifié le {new Date(template.updated_at).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PromptTemplateModal
        isOpen={isCreateModalOpen || !!editingTemplate}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTemplate(null);
        }}
        onSubmit={editingTemplate ? handleUpdate : handleCreate}
        template={editingTemplate}
        title={editingTemplate ? "Modifier le Template" : "Créer un Template"}
      />

      <PromptTemplatePreview
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />
    </div>
  );
};
