import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormQuestionsManager } from "./FormQuestionsManager";
import { NavigationFlowEditor } from "./NavigationFlowEditor";
import { QuestionPreview } from "./QuestionPreview";
import { Settings2, Workflow, Eye } from "lucide-react";

export const FormQuestionsEditor = () => {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vet-navy mb-2">
          Gestion du parcours de réservation
        </h1>
        <p className="text-vet-brown">
          Configurez l'ensemble des questions, leurs réponses et la logique de navigation du formulaire client
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span>Questions</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            <span>Navigation</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>Aperçu</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <FormQuestionsManager />
        </TabsContent>

        <TabsContent value="navigation" className="mt-6">
          <NavigationFlowEditor />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <QuestionPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
};
