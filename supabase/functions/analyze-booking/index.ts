
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingData {
  id: string
  animal_species: string
  animal_name: string
  consultation_reason: string
  selected_symptoms: string[]
  custom_symptom?: string
  conditional_answers?: Record<string, any>
  symptom_duration?: string
  animal_age?: string
  animal_breed?: string
  animal_weight?: number
  second_animal_species?: string
  second_animal_selected_symptoms?: string[]
  client_comment?: string
  [key: string]: any
}

interface AnalysisResult {
  urgency_score: number
  recommended_actions: string[]
  analysis_summary: string
  confidence_score: number
  ai_insights?: string
  priority_level: string
}

interface PromptTemplate {
  id: string
  name: string
  system_prompt: string
  user_prompt_template: string
  variables: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking_data } = await req.json()
    
    if (!booking_data) {
      throw new Error('Données de réservation manquantes')
    }

    const startTime = Date.now()
    
    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Analyser la réservation avec IA en utilisant les templates de prompts
    const analysis = await analyzeBookingWithAI(booking_data, supabaseClient)
    
    const processingTime = Date.now() - startTime

    // Logger l'analyse
    await supabaseClient
      .from('ai_analysis_logs')
      .insert({
        booking_id: booking_data.id,
        analysis_type: 'urgency_assessment_ai',
        input_data: booking_data,
        output_data: analysis,
        confidence_score: analysis.confidence_score,
        processing_time_ms: processingTime
      })

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )

  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error)
    
    // Fallback analysis en cas d'erreur
    const fallbackAnalysis = await analyzeBookingFallback(booking_data)
    
    return new Response(
      JSON.stringify({
        ...fallbackAnalysis,
        ai_insights: 'Analyse de base (IA indisponible)',
        error: error.message
      }),
      { 
        status: 200, // Retourner 200 avec analyse de base
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})

async function analyzeBookingWithAI(booking: BookingData, supabaseClient: any): Promise<AnalysisResult> {
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
  
  if (!lovableApiKey) {
    console.log('Lovable API key not found, falling back to basic analysis')
    return analyzeBookingFallback(booking)
  }

  try {
    // Récupérer le template de prompt approprié
    const template = await getPromptTemplate(booking, supabaseClient)
    
    // Préparer le prompt avec le template
    const { systemPrompt, userPrompt } = buildPromptsFromTemplate(template, booking)
    
    console.log('Sending request to Lovable AI for booking analysis with template:', template.name)
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 1000
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lovable AI API error:', response.status, errorText)
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to your workspace.')
      }
      
      throw new Error(`Lovable AI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    console.log('Lovable AI response received:', aiResponse)

    // Parser la réponse JSON de l'IA
    let aiAnalysis
    try {
      // Essayer de parser directement en JSON
      aiAnalysis = JSON.parse(aiResponse)
    } catch (parseError) {
      // Si l'IA retourne du texte libre, créer une structure JSON
      console.log('AI returned text instead of JSON, converting:', parseError)
      aiAnalysis = {
        analysis_summary: aiResponse.trim(),
        urgency_score: 5, // Score par défaut moyen
        recommended_actions: ['Consultation standard', 'Préparer le carnet de santé'],
        confidence_score: 0.7,
        ai_insights: aiResponse.trim(),
        priority_level: 'medium'
      }
    }
    
    // Logger les performances du prompt
    await logPromptPerformance(
      template,
      booking,
      userPrompt,
      aiAnalysis,
      Date.now() - Date.now(),
      data.usage?.total_tokens || 0,
      supabaseClient
    )
    
    // Valider et compléter l'analyse
    return validateAndCompleteAnalysis(aiAnalysis, booking)
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse IA:', error)
    // Fallback vers l'analyse de base
    return analyzeBookingFallback(booking)
  }
}

async function getPromptTemplate(booking: BookingData, supabaseClient: any): Promise<PromptTemplate> {
  try {
    // Récupérer les règles actives triées par priorité
    const { data: rules, error: rulesError } = await supabaseClient
      .from('prompt_rules')
      .select(`
        *,
        prompt_templates:template_id (
          id,
          name,
          system_prompt,
          user_prompt_template,
          variables
        )
      `)
      .eq('is_active', true)
      .order('priority', { ascending: false })

    if (rulesError) {
      throw new Error(`Erreur lors de la récupération des règles: ${rulesError.message}`)
    }

    // Évaluer les règles pour trouver le template approprié
    for (const rule of rules || []) {
      if (evaluateRuleConditions(rule.conditions, booking)) {
        console.log('Template sélectionné:', rule.prompt_templates.name)
        return rule.prompt_templates
      }
    }

    // Si aucune règle ne correspond, utiliser le template par défaut
    const { data: defaultTemplate, error: templateError } = await supabaseClient
      .from('prompt_templates')
      .select('*')
      .eq('name', 'default_veterinary_analysis')
      .eq('is_active', true)
      .single()

    if (templateError || !defaultTemplate) {
      throw new Error('Aucun template par défaut trouvé')
    }

    console.log('Utilisation du template par défaut')
    return defaultTemplate

  } catch (error) {
    console.error('Erreur lors de la récupération du template:', error)
    // Retourner un template hardcodé en cas d'erreur
    return {
      id: 'fallback',
      name: 'fallback_template',
      system_prompt: `Tu es un assistant vétérinaire expert qui analyse les demandes de consultation. 

OBJECTIF: Générer un résumé concis et clair pour les vétérinaires.

Le résumé doit être:
- Concis (2-3 phrases maximum)
- Orienté clinique vétérinaire
- Facile à lire rapidement
- Synthétiser les symptômes principaux et leur gravité
- Mentionner les facteurs aggravants (âge, durée, comportement)

L'évaluation d'urgence doit être basée sur:
- La gravité des symptômes
- La durée d'évolution
- L'âge de l'animal
- Les réponses aux questions conditionnelles
- Les changements comportementaux

Réponds UNIQUEMENT en JSON avec cette structure exacte:
{
  "urgency_score": number (1-10),
  "recommended_actions": ["action1", "action2"],
  "analysis_summary": "résumé concis de 2-3 phrases maximum",
  "confidence_score": number (0-1),
  "ai_insights": "analyse détaillée pour le dossier",
  "priority_level": "low|medium|high|critical"
}`,
      user_prompt_template: `Analyse cette demande de consultation vétérinaire:

ANIMAL:
- Nom: {{animal_name}}
- Espèce: {{animal_species}}
- Âge: {{animal_age}}
- Race: {{animal_breed}}
- Poids: {{animal_weight}} kg

MOTIF DE CONSULTATION:
{{consultation_reason}}

SYMPTÔMES OBSERVÉS:
{{symptoms}}
{{#custom_symptom}}
Symptôme personnalisé: {{custom_symptom}}
{{/custom_symptom}}

DURÉE DES SYMPTÔMES:
{{symptom_duration}}

RÉPONSES AUX QUESTIONS CONDITIONNELLES:
{{conditional_answers}}

{{#client_comment}}
COMMENTAIRE DU CLIENT:
{{client_comment}}
{{/client_comment}}

Génère un résumé clinique concis (2-3 phrases) et une évaluation d'urgence précise.`,
      variables: {}
    }
  }
}

function evaluateRuleConditions(conditions: any, booking: BookingData): boolean {
  try {
    // Règle par défaut - s'applique à tous
    if (conditions.type === 'default') {
      return true
    }

    // Évaluer les conditions basées sur l'espèce
    if (conditions.animal_species) {
      if (Array.isArray(conditions.animal_species)) {
        if (!conditions.animal_species.includes(booking.animal_species)) {
          return false
        }
      } else if (conditions.animal_species !== booking.animal_species) {
        return false
      }
    }

    // Évaluer les conditions basées sur les symptômes
    if (conditions.symptoms && booking.selected_symptoms) {
      const requiredSymptoms = Array.isArray(conditions.symptoms) ? conditions.symptoms : [conditions.symptoms]
      const hasRequiredSymptom = requiredSymptoms.some(symptom => 
        booking.selected_symptoms.includes(symptom)
      )
      if (!hasRequiredSymptom) {
        return false
      }
    }

    // Évaluer les conditions basées sur l'urgence
    if (conditions.consultation_reason && conditions.consultation_reason !== booking.consultation_reason) {
      return false
    }

    return true
  } catch (error) {
    console.error('Erreur lors de l\'évaluation des conditions:', error)
    return false
  }
}

function buildPromptsFromTemplate(template: PromptTemplate, booking: BookingData): { systemPrompt: string, userPrompt: string } {
  try {
    // Préparer les variables pour le template
    const variables = {
      animal_species: booking.animal_species || 'Non spécifié',
      second_animal_species: booking.second_animal_species || '',
      animal_name: booking.animal_name || 'Non spécifié',
      second_animal_name: booking.second_animal_name || '',
      animal_age: booking.animal_age || 'Non spécifié',
      animal_breed: booking.animal_breed || 'Non spécifié',
      animal_weight: booking.animal_weight?.toString() || 'Non spécifié',
      consultation_reason: booking.consultation_reason || 'Non spécifié',
      symptoms: [
        ...(booking.selected_symptoms || []),
        ...(booking.second_animal_selected_symptoms || [])
      ].join(', ') || 'Aucun symptôme spécifique',
      custom_symptom: booking.custom_symptom || '',
      symptom_duration: booking.symptom_duration || 'Non spécifié',
      conditional_answers: booking.conditional_answers ? JSON.stringify(booking.conditional_answers, null, 2) : 'Aucune réponse conditionnelle',
      client_comment: booking.client_comment || 'Aucun commentaire'
    }

    // Remplacer les variables dans le template utilisateur
    let userPrompt = template.user_prompt_template
    
    // Remplacer les variables simples {{variable}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      userPrompt = userPrompt.replace(regex, value.toString())
    })

    // Gérer les conditions {{#variable}} et {{/variable}}
    userPrompt = userPrompt.replace(/{{#(\w+)}}(.*?){{\/\1}}/g, (match, varName, content) => {
      const value = variables[varName as keyof typeof variables]
      return value && value.toString().trim() ? content : ''
    })

    return {
      systemPrompt: template.system_prompt,
      userPrompt
    }
  } catch (error) {
    console.error('Erreur lors de la construction du prompt:', error)
    // Fallback vers un prompt simple
    return {
      systemPrompt: template.system_prompt,
      userPrompt: `Analyse cette demande de consultation vétérinaire pour ${booking.animal_name} (${booking.animal_species})`
    }
  }
}

async function logPromptPerformance(
  template: PromptTemplate,
  booking: BookingData,
  promptUsed: string,
  response: any,
  processingTime: number,
  tokensUsed: number,
  supabaseClient: any
) {
  try {
    // Calculer un score de qualité basique basé sur la réponse
    let qualityScore = 0.7 // Score par défaut
    
    if (response.urgency_score && response.urgency_score >= 1 && response.urgency_score <= 10) {
      qualityScore += 0.1
    }
    if (response.recommended_actions && Array.isArray(response.recommended_actions) && response.recommended_actions.length > 0) {
      qualityScore += 0.1
    }
    if (response.analysis_summary && response.analysis_summary.length > 10) {
      qualityScore += 0.1
    }
    
    qualityScore = Math.min(qualityScore, 1.0)

    await supabaseClient
      .from('prompt_performance_logs')
      .insert({
        template_id: template.id,
        booking_id: booking.id,
        prompt_used: promptUsed,
        response_quality_score: qualityScore,
        processing_time_ms: processingTime,
        tokens_used: tokensUsed,
        cost_cents: Math.round((tokensUsed / 1000) * 2) // Estimation basique du coût
      })
  } catch (error) {
    console.error('Erreur lors du logging des performances:', error)
  }
}

function validateAndCompleteAnalysis(aiAnalysis: any, booking: BookingData): AnalysisResult {
  // Valider la structure de la réponse IA
  const urgencyScore = Math.max(1, Math.min(10, aiAnalysis.urgency_score || 3))
  const confidenceScore = Math.max(0, Math.min(1, aiAnalysis.confidence_score || 0.7))
  
  let priorityLevel = 'medium'
  if (urgencyScore >= 8) priorityLevel = 'critical'
  else if (urgencyScore >= 6) priorityLevel = 'high'
  else if (urgencyScore <= 3) priorityLevel = 'low'
  
  const recommendedActions = aiAnalysis.recommended_actions || ['Consultation standard']
  
  if (!recommendedActions.includes('Préparer le carnet de santé')) {
    recommendedActions.push('Préparer le carnet de santé')
  }
  
  if (booking.animal_vaccines_up_to_date === false) {
    recommendedActions.push('Vérifier les vaccinations')
  }

  return {
    urgency_score: urgencyScore,
    recommended_actions: recommendedActions,
    analysis_summary: aiAnalysis.analysis_summary || `Analyse automatique - Score d'urgence: ${urgencyScore}/10`,
    confidence_score: confidenceScore,
    ai_insights: aiAnalysis.ai_insights || 'Analyse réalisée avec succès',
    priority_level: priorityLevel
  }
}

// Fonction de fallback pour l'analyse de base (code existant)
async function analyzeBookingFallback(booking: BookingData): Promise<AnalysisResult> {
  let urgencyScore = 1
  let confidenceScore = 0.7
  const recommendedActions: string[] = []
  let analysisSummary = ''

  const criticalSymptoms = [
    'difficulte-respirer',
    'saignement-abondant',
    'perte-de-connaissance',
    'convulsions',
    'traumatisme-grave',
    'empoisonnement'
  ]

  const urgentSymptoms = [
    'vomissements-repetes',
    'diarrhee-sanglante',
    'douleur-intense',
    'fievre-elevee',
    'blessure-ouverte'
  ]

  const allSymptoms = [
    ...(booking.selected_symptoms || []),
    ...(booking.second_animal_selected_symptoms || [])
  ]

  const hasCriticalSymptoms = allSymptoms.some(symptom => 
    criticalSymptoms.includes(symptom)
  )

  if (hasCriticalSymptoms) {
    urgencyScore = 9
    recommendedActions.push('Urgence vétérinaire immédiate')
    recommendedActions.push('Préparer le transport d\'urgence')
    analysisSummary = 'Symptômes critiques détectés - intervention d\'urgence requise'
    confidenceScore = 0.95
  } else {
    const hasUrgentSymptoms = allSymptoms.some(symptom => 
      urgentSymptoms.includes(symptom)
    )

    if (hasUrgentSymptoms) {
      urgencyScore = 6
      recommendedActions.push('Consultation dans les 24h')
      recommendedActions.push('Surveiller l\'évolution des symptômes')
      analysisSummary = 'Symptômes préoccupants - consultation rapide recommandée'
      confidenceScore = 0.85
    } else {
      if (booking.symptom_duration) {
        if (booking.symptom_duration.includes('plus-une-semaine')) {
          urgencyScore = Math.max(urgencyScore, 4)
          recommendedActions.push('Consultation recommandée')
          analysisSummary = 'Symptômes persistants - évaluation nécessaire'
        } else if (booking.symptom_duration.includes('quelques-jours')) {
          urgencyScore = Math.max(urgencyScore, 3)
          recommendedActions.push('Consultation si aggravation')
        }
      }
    }
  }

  if (booking.animal_age === 'moins-1-an' || booking.animal_age === 'plus-10-ans') {
    urgencyScore = Math.min(urgencyScore + 1, 10)
    recommendedActions.push('Attention particulière due à l\'âge')
  }

  if (booking.conditional_answers) {
    const answers = booking.conditional_answers
    
    if (answers.symptoms_worsening === 'oui' || answers.general_worsening === 'oui') {
      urgencyScore = Math.min(urgencyScore + 2, 10)
      recommendedActions.push('Symptômes en aggravation - consultation prioritaire')
    }

    if (answers.behavioral_changes === 'oui' || answers.appetite_loss === 'oui') {
      urgencyScore = Math.min(urgencyScore + 1, 10)
      recommendedActions.push('Changements comportementaux détectés')
    }
  }

  if (booking.consultation_reason === 'urgence') {
    urgencyScore = Math.max(urgencyScore, 7)
    recommendedActions.push('Consultation d\'urgence demandée')
    analysisSummary = 'Consultation d\'urgence explicitement demandée'
  }

  if (booking.consultation_reason === 'consultation-convenance') {
    urgencyScore = Math.min(urgencyScore, 3)
    if (!analysisSummary) {
      analysisSummary = 'Consultation de convenance - planification flexible'
    }
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push('Consultation standard')
  }

  recommendedActions.push('Préparer le carnet de santé')
  if (booking.animal_vaccines_up_to_date === false) {
    recommendedActions.push('Vérifier les vaccinations')
  }

  if (!analysisSummary) {
    analysisSummary = `Consultation de routine - Score d'urgence: ${urgencyScore}/10`
  }

  let priorityLevel = 'medium'
  if (urgencyScore >= 8) priorityLevel = 'critical'
  else if (urgencyScore >= 6) priorityLevel = 'high'
  else if (urgencyScore <= 3) priorityLevel = 'low'

  return {
    urgency_score: urgencyScore,
    recommended_actions: recommendedActions,
    analysis_summary: analysisSummary,
    confidence_score: confidenceScore,
    ai_insights: 'Analyse de base effectuée',
    priority_level: priorityLevel
  }
}
