import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Generating personalized advice for booking:', booking_data.id || 'pending')
    
    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Récupérer le template de conseils
    const { data: template, error: templateError } = await supabaseClient
      .from('prompt_templates')
      .select('*')
      .eq('name', 'owner_advice_template')
      .eq('is_active', true)
      .single()

    if (templateError || !template) {
      console.error('Template not found:', templateError)
      throw new Error('Template de conseils non disponible')
    }

    // Préparer le prompt avec les données du booking
    const userPrompt = buildAdvicePrompt(template.user_prompt_template, booking_data)
    
    // Appeler Lovable AI
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    
    if (!lovableApiKey) {
      throw new Error('Lovable API key non configurée')
    }

    console.log('Calling Lovable AI for advice generation...')
    
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
            content: template.system_prompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 800
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

    console.log('AI response received:', aiResponse)

    // Parser la réponse JSON de l'IA
    let advice
    try {
      // Nettoyer la réponse si elle contient des balises markdown
      let cleanResponse = aiResponse.trim()
      
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '')
      }
      
      const parsed = JSON.parse(cleanResponse)
      advice = parsed.advice || cleanResponse
    } catch (parseError) {
      console.log('AI returned text instead of JSON:', parseError)
      advice = aiResponse.trim()
    }

    return new Response(
      JSON.stringify({ advice }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )

  } catch (error) {
    console.error('Erreur lors de la génération des conseils:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message,
        advice: null
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

function buildAdvicePrompt(template: string, booking: any): string {
  // Préparer les variables pour le template
  const variables: Record<string, string> = {
    animal_name: booking.animal_name || 'l\'animal',
    animal_species: booking.animal_species || 'Non spécifié',
    consultation_reason: booking.consultation_reason || 'Non spécifié',
    selected_symptoms: (booking.selected_symptoms || []).join(', ') || 'Aucun',
    custom_symptom: booking.custom_symptom || '',
    symptom_duration: booking.symptom_duration || '',
    convenience_options: (booking.convenience_options || []).join(', ') || '',
    client_comment: booking.client_comment || '',
    additional_points: (booking.additional_points || []).join(', ') || '',
    second_animal_name: booking.second_animal_name || '',
    second_animal_species: booking.second_animal_species || '',
    second_animal_different_reason: booking.second_animal_different_reason ? 'true' : 'false',
    second_animal_consultation_reason: booking.second_animal_consultation_reason || '',
    second_animal_selected_symptoms: (booking.second_animal_selected_symptoms || []).join(', ') || '',
    second_animal_custom_symptom: booking.second_animal_custom_symptom || '',
    second_animal_convenience_options: (booking.second_animal_convenience_options || []).join(', ') || ''
  }

  // Remplacer les variables simples {{variable}}
  let prompt = template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    prompt = prompt.replace(regex, value)
  })

  // Gérer les conditions {{#variable}} et {{/variable}}
  prompt = prompt.replace(/{{#if (\w+)}}(.*?){{\/if}}/gs, (match, varName, content) => {
    const value = variables[varName]
    return value && value.trim() && value !== 'false' ? content : ''
  })

  return prompt
}
