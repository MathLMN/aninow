
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
    
    // Analyser la réservation avec IA
    const analysis = await analyzeBookingWithAI(booking_data)
    
    const processingTime = Date.now() - startTime

    // Créer le client Supabase pour logger l'analyse
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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

async function analyzeBookingWithAI(booking: BookingData): Promise<AnalysisResult> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
  
  if (!openAIApiKey) {
    console.log('OpenAI API key not found, falling back to basic analysis')
    return analyzeBookingFallback(booking)
  }

  try {
    // Préparer le prompt pour l'IA
    const prompt = buildAnalysisPrompt(booking)
    
    console.log('Sending request to OpenAI for booking analysis')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant vétérinaire expert qui analyse les demandes de consultation.
            Tu dois évaluer l'urgence d'une consultation vétérinaire sur une échelle de 1 à 10.
            Réponds UNIQUEMENT en JSON avec cette structure exacte:
            {
              "urgency_score": number (1-10),
              "recommended_actions": ["action1", "action2"],
              "analysis_summary": "résumé de l'analyse",
              "confidence_score": number (0-1),
              "ai_insights": "insights détaillés sur le cas",
              "priority_level": "low|medium|high|critical"
            }`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    console.log('OpenAI response received:', aiResponse)

    // Parser la réponse JSON de l'IA
    const aiAnalysis = JSON.parse(aiResponse)
    
    // Valider et compléter l'analyse
    return validateAndCompleteAnalysis(aiAnalysis, booking)
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse IA:', error)
    // Fallback vers l'analyse de base
    return analyzeBookingFallback(booking)
  }
}

function buildAnalysisPrompt(booking: BookingData): string {
  const symptoms = [
    ...(booking.selected_symptoms || []),
    ...(booking.second_animal_selected_symptoms || [])
  ]
  
  return `
Analyse cette demande de consultation vétérinaire:

ANIMAL(S):
- Espèce: ${booking.animal_species}${booking.second_animal_species ? ` et ${booking.second_animal_species}` : ''}
- Nom: ${booking.animal_name}${booking.second_animal_name ? ` et ${booking.second_animal_name}` : ''}
- Âge: ${booking.animal_age || 'Non spécifié'}
- Race: ${booking.animal_breed || 'Non spécifié'}
- Poids: ${booking.animal_weight || 'Non spécifié'}

MOTIF DE CONSULTATION:
${booking.consultation_reason}

SYMPTÔMES OBSERVÉS:
${symptoms.length > 0 ? symptoms.join(', ') : 'Aucun symptôme spécifique'}
${booking.custom_symptom ? `Symptôme personnalisé: ${booking.custom_symptom}` : ''}

DURÉE DES SYMPTÔMES:
${booking.symptom_duration || 'Non spécifié'}

RÉPONSES AUX QUESTIONS:
${booking.conditional_answers ? JSON.stringify(booking.conditional_answers, null, 2) : 'Aucune réponse conditionnelle'}

COMMENTAIRE CLIENT:
${booking.client_comment || 'Aucun commentaire'}

Évalue l'urgence et fournis des recommandations appropriées.
  `
}

function validateAndCompleteAnalysis(aiAnalysis: any, booking: BookingData): AnalysisResult {
  // Valider la structure de la réponse IA
  const urgencyScore = Math.max(1, Math.min(10, aiAnalysis.urgency_score || 3))
  const confidenceScore = Math.max(0, Math.min(1, aiAnalysis.confidence_score || 0.7))
  
  // Déterminer le niveau de priorité
  let priorityLevel = 'medium'
  if (urgencyScore >= 8) priorityLevel = 'critical'
  else if (urgencyScore >= 6) priorityLevel = 'high'
  else if (urgencyScore <= 3) priorityLevel = 'low'
  
  // Ajouter des actions recommandées par défaut si nécessaire
  const recommendedActions = aiAnalysis.recommended_actions || ['Consultation standard']
  
  // Toujours ajouter des recommandations de base
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

  // Analyser les symptômes critiques
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

  // Vérifier les symptômes critiques
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
    // Vérifier les symptômes urgents
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
      // Analyser la durée des symptômes
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

  // Analyser l'âge de l'animal
  if (booking.animal_age === 'moins-1-an' || booking.animal_age === 'plus-10-ans') {
    urgencyScore = Math.min(urgencyScore + 1, 10)
    recommendedActions.push('Attention particulière due à l\'âge')
  }

  // Analyser les réponses aux questions conditionnelles
  if (booking.conditional_answers) {
    const answers = booking.conditional_answers
    
    // Vérifier les signes d'aggravation
    if (answers.symptoms_worsening === 'oui' || answers.general_worsening === 'oui') {
      urgencyScore = Math.min(urgencyScore + 2, 10)
      recommendedActions.push('Symptômes en aggravation - consultation prioritaire')
    }

    // Vérifier les problèmes de comportement
    if (answers.behavioral_changes === 'oui' || answers.appetite_loss === 'oui') {
      urgencyScore = Math.min(urgencyScore + 1, 10)
      recommendedActions.push('Changements comportementaux détectés')
    }
  }

  // Motif de consultation d'urgence
  if (booking.consultation_reason === 'urgence') {
    urgencyScore = Math.max(urgencyScore, 7)
    recommendedActions.push('Consultation d\'urgence demandée')
    analysisSummary = 'Consultation d\'urgence explicitement demandée'
  }

  // Ajuster le score pour les consultations de convenance
  if (booking.consultation_reason === 'consultation-convenance') {
    urgencyScore = Math.min(urgencyScore, 3)
    if (!analysisSummary) {
      analysisSummary = 'Consultation de convenance - planification flexible'
    }
  }

  // Ajouter des actions par défaut
  if (recommendedActions.length === 0) {
    recommendedActions.push('Consultation standard')
  }

  // Ajouter des recommandations générales
  recommendedActions.push('Préparer le carnet de santé')
  if (booking.animal_vaccines_up_to_date === false) {
    recommendedActions.push('Vérifier les vaccinations')
  }

  if (!analysisSummary) {
    analysisSummary = `Consultation de routine - Score d'urgence: ${urgencyScore}/10`
  }

  // Déterminer le niveau de priorité
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
