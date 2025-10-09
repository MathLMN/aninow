import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { useFormQuestions, FormQuestion } from "@/hooks/useFormQuestions";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const QUESTION_TYPES = [
  { value: 'symptom', label: 'Symptôme' },
  { value: 'conditional_question', label: 'Question conditionnelle' },
  { value: 'general_info', label: 'Information générale' },
  { value: 'animal_info', label: 'Information animal' },
  { value: 'contact_info', label: 'Information contact' },
];

export const FormQuestionsManager = () => {
  const { questions, isLoading, createQuestion, updateQuestion, deleteQuestion, reorderQuestions } = useFormQuestions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FormQuestion | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const [formData, setFormData] = useState({
    question_key: '',
    question_type: 'symptom' as FormQuestion['question_type'],
    question_text: '',
    description: '',
    options: '[]',
    is_active: true,
  });

  const filteredQuestions = filterType === 'all' 
    ? questions 
    : questions.filter(q => q.question_type === filterType);

  const handleCreate = () => {
    try {
      const options = JSON.parse(formData.options);
      createQuestion({
        ...formData,
        options,
        order_index: questions.length,
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      alert('Format JSON invalide pour les options');
    }
  };

  const handleEdit = () => {
    if (!editingQuestion) return;
    try {
      const options = JSON.parse(formData.options);
      updateQuestion({
        id: editingQuestion.id,
        ...formData,
        options,
      });
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
      resetForm();
    } catch (error) {
      alert('Format JSON invalide pour les options');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      deleteQuestion(id);
    }
  };

  const handleToggleActive = (question: FormQuestion) => {
    updateQuestion({
      id: question.id,
      is_active: !question.is_active,
    });
  };

  const openEditDialog = (question: FormQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question_key: question.question_key,
      question_type: question.question_type,
      question_text: question.question_text,
      description: question.description || '',
      options: JSON.stringify(question.options, null, 2),
      is_active: question.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      question_key: '',
      question_type: 'symptom',
      question_text: '',
      description: '',
      options: '[]',
      is_active: true,
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(filteredQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    reorderQuestions(updates);
  };

  const QuestionForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question_key">Clé de la question *</Label>
        <Input
          id="question_key"
          value={formData.question_key}
          onChange={(e) => setFormData({ ...formData, question_key: e.target.value })}
          placeholder="ex: symptoms_selection"
          disabled={!!editingQuestion}
        />
        <p className="text-xs text-muted-foreground mt-1">Identifiant unique (non modifiable après création)</p>
      </div>

      <div>
        <Label htmlFor="question_type">Type de question *</Label>
        <Select
          value={formData.question_type}
          onValueChange={(value: any) => setFormData({ ...formData, question_type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUESTION_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="question_text">Texte de la question *</Label>
        <Input
          id="question_text"
          value={formData.question_text}
          onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
          placeholder="Quelle est votre question ?"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description optionnelle"
        />
      </div>

      <div>
        <Label htmlFor="options">Options (format JSON) *</Label>
        <Textarea
          id="options"
          value={formData.options}
          onChange={(e) => setFormData({ ...formData, options: e.target.value })}
          placeholder='[{"id": "option1", "label": "Option 1", "color": "blue"}]'
          rows={6}
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Format: tableau JSON avec id, label et color optionnel
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Question active</Label>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-vet-navy">Gestion des questions du formulaire</h2>
          <p className="text-sm text-vet-brown">
            Modifiez, réorganisez et gérez toutes les questions du formulaire de prise de rendez-vous
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-vet-sage hover:bg-vet-sage/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle question</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
              <QuestionForm />
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate} className="bg-vet-sage hover:bg-vet-sage/90">
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
          size="sm"
        >
          Toutes ({questions.length})
        </Button>
        {QUESTION_TYPES.map(type => {
          const count = questions.filter(q => q.question_type === type.value).length;
          return (
            <Button
              key={type.value}
              variant={filterType === type.value ? 'default' : 'outline'}
              onClick={() => setFilterType(type.value)}
              size="sm"
            >
              {type.label} ({count})
            </Button>
          );
        })}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {filteredQuestions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div {...provided.dragHandleProps} className="mt-1 cursor-grab">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={question.is_active ? 'default' : 'secondary'}>
                                  {QUESTION_TYPES.find(t => t.value === question.question_type)?.label}
                                </Badge>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {question.question_key}
                                </code>
                                {!question.is_active && (
                                  <Badge variant="outline" className="text-gray-500">
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-lg">{question.question_text}</CardTitle>
                              {question.description && (
                                <CardDescription className="mt-1">{question.description}</CardDescription>
                              )}
                              <div className="mt-3">
                                <p className="text-xs text-muted-foreground mb-2">
                                  Options ({question.options?.length || 0}) :
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {question.options?.slice(0, 5).map((opt: any, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {opt.label || opt.id}
                                    </Badge>
                                  ))}
                                  {question.options?.length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{question.options.length - 5} autres
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(question)}
                            >
                              {question.is_active ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(question)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(question.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Modifier la question</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <QuestionForm />
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit} className="bg-vet-sage hover:bg-vet-sage/90">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
