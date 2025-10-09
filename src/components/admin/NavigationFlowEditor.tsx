import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFormQuestions } from "@/hooks/useFormQuestions";
import { ArrowRight, GitBranch, AlertCircle } from "lucide-react";

const NAVIGATION_FLOW = [
  {
    step: 1,
    type: 'booking_start',
    label: 'Démarrage de la réservation',
    description: 'Espèce, nom, portée',
    next: [{ condition: 'always', target: 'consultation_reason' }]
  },
  {
    step: 2,
    type: 'consultation_reason',
    label: 'Motif de consultation',
    description: 'Symptômes ou convenance',
    next: [
      { condition: 'if symptoms selected', target: 'conditional_questions' },
      { condition: 'if convenience only', target: 'animal_info' }
    ]
  },
  {
    step: 3,
    type: 'conditional_questions',
    label: 'Questions conditionnelles',
    description: 'Questions basées sur les symptômes',
    next: [{ condition: 'always', target: 'symptom_duration' }]
  },
  {
    step: 4,
    type: 'symptom_duration',
    label: 'Durée des symptômes',
    description: 'Depuis combien de temps',
    next: [{ condition: 'always', target: 'additional_points' }]
  },
  {
    step: 5,
    type: 'additional_points',
    label: 'Points complémentaires',
    description: 'Autres points à voir',
    next: [{ condition: 'always', target: 'animal_info' }]
  },
  {
    step: 6,
    type: 'animal_info',
    label: 'Informations animal',
    description: 'Race, âge, poids, sexe',
    next: [{ condition: 'always', target: 'client_comment' }]
  },
  {
    step: 7,
    type: 'client_comment',
    label: 'Commentaire client',
    description: 'Informations supplémentaires (optionnel)',
    next: [{ condition: 'always', target: 'contact_info' }]
  },
  {
    step: 8,
    type: 'contact_info',
    label: 'Coordonnées',
    description: 'Nom, email, téléphone',
    next: [{ condition: 'always', target: 'appointment_slots' }]
  },
  {
    step: 9,
    type: 'appointment_slots',
    label: 'Choix du créneau',
    description: 'Sélection date et heure',
    next: [{ condition: 'always', target: 'confirmation' }]
  }
];

export const NavigationFlowEditor = () => {
  const { questions } = useFormQuestions();

  const getQuestionCount = (type: string) => {
    return questions.filter(q => q.question_type === type && q.is_active).length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Flux de navigation</CardTitle>
          <CardDescription>
            Visualisez et comprenez le parcours complet de réservation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Le flux de navigation est actuellement géré par la logique du code. 
              Les modifications futures permettront de personnaliser les conditions de navigation.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {NAVIGATION_FLOW.map((step, index) => (
              <div key={step.type}>
                <Card className="bg-gradient-to-r from-vet-beige/20 to-white border-vet-blue/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="bg-vet-sage text-white">
                            Étape {step.step}
                          </Badge>
                          <h3 className="text-lg font-semibold text-vet-navy">
                            {step.label}
                          </h3>
                          {getQuestionCount(step.type) > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {getQuestionCount(step.type)} question{getQuestionCount(step.type) > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-vet-brown mb-3">
                          {step.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {step.next.map((nav, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-vet-brown/70">
                              <GitBranch className="h-3 w-3" />
                              <span className="italic">{nav.condition}</span>
                              <ArrowRight className="h-3 w-3" />
                              <code className="bg-vet-blue/10 px-2 py-1 rounded">
                                {nav.target}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {index < NAVIGATION_FLOW.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="h-6 w-6 text-vet-sage" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-vet-navy">Logique conditionnelle</CardTitle>
          <CardDescription>
            Règles de navigation basées sur les réponses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-vet-blue/5 rounded-lg border border-vet-blue/20">
              <h4 className="font-semibold text-vet-navy mb-2">
                Symptômes → Questions conditionnelles
              </h4>
              <p className="text-sm text-vet-brown">
                Si l'utilisateur sélectionne des symptômes, il sera redirigé vers des questions 
                spécifiques basées sur les symptômes choisis (plaie, boiterie, problèmes cutanés, etc.)
              </p>
            </div>

            <div className="p-4 bg-vet-blue/5 rounded-lg border border-vet-blue/20">
              <h4 className="font-semibold text-vet-navy mb-2">
                Convenance uniquement → Informations animal
              </h4>
              <p className="text-sm text-vet-brown">
                Si l'utilisateur choisit uniquement une consultation de convenance 
                (vaccins, stérilisation), il passe directement aux informations de l'animal
              </p>
            </div>

            <div className="p-4 bg-vet-blue/5 rounded-lg border border-vet-blue/20">
              <h4 className="font-semibold text-vet-navy mb-2">
                Deux animaux → Questions dupliquées
              </h4>
              <p className="text-sm text-vet-brown">
                Si l'utilisateur réserve pour 2 animaux, certaines questions sont 
                posées pour chaque animal séparément
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
