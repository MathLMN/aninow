
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  [key: string]: any
}

interface AnalysisResult {
  urgency_score: number
  recommended_actions: string[]
  analysis_summary: string
  confidence_score: number
}

serve(async (req) => {
  // Gérer les requêtes CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking_data } = await req.json()
    
    if (!booking_data) {
      throw new Error('Données de réservation manquantes')
    }

    const startTime = Date.now()
    
    // Analyser la réservation
    const analysis = await analyzeBooking(booking_data)
    
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
        analysis_type: 'urgency_assessment',
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
    return new Response(
      JSON.stringify({ 
        error: error.message,
        urgency_score: 3,
        recommended_actions: ['Consultation standard'],
        analysis_summary: 'Analyse impossible, consultation recommandée',
        confidence_score: 0.1
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})

async function analyzeBooking(booking: BookingData): Promise<AnalysisResult> {
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

  return {
    urgency_score: urgencyScore,
    recommended_actions: recommendedActions,
    analysis_summary: analysisSummary,
    confidence_score: confidenceScore
  }
}
