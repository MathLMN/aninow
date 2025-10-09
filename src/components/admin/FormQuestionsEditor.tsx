import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormQuestionsManager } from "./FormQuestionsManager";
import NavigationFlowEditor from "./NavigationFlowEditor";
import QuestionPreview from "./QuestionPreview";
import { List, GitBranch, Eye } from "lucide-react";

const FormQuestionsEditor = () => {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-vet-navy">
          Gestion des questions du formulaire
        </CardTitle>
        <CardDescription className="text-vet-brown">
          Gérez toutes les questions de la partie réservation client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <FormQuestionsManager />
          </TabsContent>

          <TabsContent value="navigation" className="space-y-4">
            <NavigationFlowEditor />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <QuestionPreview />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormQuestionsEditor;
