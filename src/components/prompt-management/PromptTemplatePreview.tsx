
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PromptTemplatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
}

export const PromptTemplatePreview = ({
  isOpen,
  onClose,
  template
}: PromptTemplatePreviewProps) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy flex items-center gap-2">
            Aperçu du Template: {template.name}
            <Badge variant={template.is_active ? "default" : "secondary"}>
              {template.is_active ? "Actif" : "Inactif"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {template.description || "Aucune description"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prompt Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-vet-beige/20 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-vet-brown">
                  {template.system_prompt}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template du Prompt Utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-vet-blue/10 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-vet-brown">
                  {template.user_prompt_template}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Variables Disponibles</CardTitle>
              <CardDescription>
                Variables qui peuvent être utilisées dans le template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(template.variables || {}).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(template.variables || {}).map(([key, type]) => (
                    <div key={key} className="bg-white p-2 rounded border">
                      <div className="font-medium text-sm text-vet-navy">{key}</div>
                      <div className="text-xs text-vet-brown">{type as string}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-vet-brown/60">Aucune variable définie</p>
              )}
            </CardContent>
          </Card>

          <div className="bg-vet-sage/10 p-4 rounded-md">
            <h4 className="font-medium text-vet-navy mb-2">Informations du Template</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Créé le:</span> {new Date(template.created_at).toLocaleString('fr-FR')}
              </div>
              <div>
                <span className="font-medium">Modifié le:</span> {new Date(template.updated_at).toLocaleString('fr-FR')}
              </div>
              <div>
                <span className="font-medium">Statut:</span> {template.is_active ? "Actif" : "Inactif"}
              </div>
              <div>
                <span className="font-medium">ID:</span> {template.id}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
