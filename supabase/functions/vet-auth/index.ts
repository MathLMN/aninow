
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  email: string
  password: string
}

interface VetSession {
  id: string
  veterinarian_id: string
  session_token: string
  expires_at: string
  created_at: string
  last_activity: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { action, ...data } = await req.json()

    switch (action) {
      case 'login':
        return await handleLogin(supabaseClient, data as LoginRequest)
      case 'logout':
        return await handleLogout(supabaseClient, data.session_token)
      case 'verify':
        return await handleVerifySession(supabaseClient, data.session_token)
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans vet-auth:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleLogin(supabase: any, { email, password }: LoginRequest) {
  console.log('🔄 Tentative de connexion pour:', email)
  
  // Vérifier d'abord si c'est le mot de passe de démo
  if (password !== 'vet123') {
    console.log('❌ Mot de passe invalide')
    throw new Error('Identifiants invalides')
  }

  // Chercher le vétérinaire ou en créer un pour la démo
  let { data: veterinarian, error: vetError } = await supabase
    .from('clinic_veterinarians')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single()

  if (vetError || !veterinarian) {
    console.log('⚠️ Vétérinaire non trouvé, création d\'un compte démo pour:', email)
    
    // Créer un vétérinaire de démo s'il n'existe pas
    const { data: newVet, error: createError } = await supabase
      .from('clinic_veterinarians')
      .insert({
        email: email,
        name: 'Dr. ' + email.split('@')[0],
        specialty: 'Médecine générale',
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('❌ Erreur lors de la création du vétérinaire:', createError)
      throw new Error('Erreur lors de la création du compte')
    }

    veterinarian = newVet
    console.log('✅ Vétérinaire créé:', veterinarian.name)
  }

  console.log('✅ Vétérinaire trouvé:', veterinarian.name)

  // Supprimer les sessions existantes pour ce vétérinaire
  await supabase
    .from('vet_sessions')
    .delete()
    .eq('veterinarian_id', veterinarian.id)

  // Créer une nouvelle session
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  const { data: session, error: sessionError } = await supabase
    .from('vet_sessions')
    .insert({
      veterinarian_id: veterinarian.id,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      last_activity: new Date().toISOString()
    })
    .select()
    .single()

  if (sessionError) {
    console.error('❌ Erreur lors de la création de la session:', sessionError)
    throw new Error('Erreur lors de la création de la session')
  }

  console.log('✅ Session créée avec succès')

  return new Response(
    JSON.stringify({
      success: true,
      session_token: sessionToken,
      veterinarian: {
        id: veterinarian.id,
        name: veterinarian.name,
        email: veterinarian.email,
        specialty: veterinarian.specialty
      },
      expires_at: expiresAt.toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleLogout(supabase: any, sessionToken: string) {
  if (!sessionToken) {
    throw new Error('Token de session manquant')
  }

  const { error } = await supabase
    .from('vet_sessions')
    .delete()
    .eq('session_token', sessionToken)

  if (error) {
    throw new Error('Erreur lors de la déconnexion')
  }

  return new Response(
    JSON.stringify({ success: true }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleVerifySession(supabase: any, sessionToken: string) {
  if (!sessionToken) {
    throw new Error('Token de session manquant')
  }

  const { data: session, error } = await supabase
    .from('vet_sessions')
    .select(`
      *,
      veterinarian:clinic_veterinarians(id, name, email, specialty, is_active)
    `)
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !session) {
    throw new Error('Session invalide ou expirée')
  }

  // Mettre à jour la dernière activité
  await supabase
    .from('vet_sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('session_token', sessionToken)

  return new Response(
    JSON.stringify({
      valid: true,
      veterinarian: session.veterinarian,
      expires_at: session.expires_at
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

function generateSessionToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36)
}
