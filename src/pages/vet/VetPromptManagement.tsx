
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VetLayout from "@/components/layout/VetLayout";
import { PromptTemplatesList } from "@/components/prompt-management/PromptTemplatesList";
import { PromptRulesList } from "@/components/prompt-management/PromptRulesList";
import { PromptPerformanceAnalytics } from "@/components/prompt-management/PromptPerformanceAnalytics";
import { usePromptManagement } from "@/hooks/usePromptManagement";

const VetPromptManagement = () => {
  const { 
    templates, 
    rules, 
    performanceLogs, 
    isLoading, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    createRule,
    updateRule,
    deleteRule
  } = usePromptManagement();

  return (
    <VetLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-vet-navy mb-2">
            Gestion des Prompts IA
          </h1>
          <p className="text-vet-brown">
            Gérez les templates de prompts et les règles de sélection pour optimiser l'analyse automatique
          </p>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates de Prompts</TabsTrigger>
            <TabsTrigger value="rules">Règles de Sélection</TabsTrigger>
            <TabsTrigger value="analytics">Performances</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
              <CardHeader>
                <CardTitle className="text-vet-navy">Templates de Prompts</CardTitle>
                <CardDescription>
                  Créez et gérez les templates de prompts utilisés par l'IA pour analyser les demandes de consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PromptTemplatesList
                  templates={templates}
                  isLoading={isLoading}
                  onCreateTemplate={createTemplate}
                  onUpdateTemplate={updateTemplate}
                  onDeleteTemplate={deleteTemplate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
              <CardHeader>
                <CardTitle className="text-vet-navy">Règles de Sélection</CardTitle>
                <CardDescription>
                  Définissez les conditions qui déterminent quel template utiliser selon le type de consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PromptRulesList
                  rules={rules}
                  templates={templates}
                  isLoading={isLoading}
                  onCreateRule={createRule}
                  onUpdateRule={updateRule}
                  onDeleteRule={deleteRule}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
              <CardHeader>
                <CardTitle className="text-vet-navy">Analyse des Performances</CardTitle>
                <CardDescription>
                  Analysez les performances des différents templates et optimisez leur efficacité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PromptPerformanceAnalytics
                  performanceLogs={performanceLogs}
                  templates={templates}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VetLayout>
  );
};

export default VetPromptManagement;
