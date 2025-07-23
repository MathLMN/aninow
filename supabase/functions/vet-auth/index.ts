
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

interface CreateAccountRequest {
  email: string
  password: string
  clinic_name: string
  clinic_phone?: string
  clinic_address?: string
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
      case 'create_account':
        return await handleCreateAccount(supabaseClient, data as CreateAccountRequest)
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

async function handleCreateAccount(supabase: any, { email, password, clinic_name, clinic_phone, clinic_address }: CreateAccountRequest) {
  console.log('🔄 Création de compte pour:', email)
  
  // Vérifier le mot de passe de démo
  if (password !== 'vet123') {
    console.log('❌ Mot de passe invalide pour la création de compte')
    throw new Error('Le mot de passe doit être "vet123" pour la démo')
  }

  // Vérifier si l'email existe déjà
  const { data: existingSession, error: checkError } = await supabase
    .from('vet_sessions')
    .select('clinic_email')
    .eq('clinic_email', email)
    .single()

  if (existingSession) {
    console.log('❌ Email déjà utilisé')
    throw new Error('Un compte existe déjà avec cet email')
  }

  // Mettre à jour les paramètres de la clinique avec le nouvel email
  const { error: clinicError } = await supabase
    .from('clinic_settings')
    .upsert({
      clinic_email: email,
      clinic_name: clinic_name,
      clinic_phone: clinic_phone,
      clinic_address_street: clinic_address
    })

  if (clinicError) {
    console.error('❌ Erreur lors de la mise à jour des paramètres de la clinique:', clinicError)
    throw new Error('Erreur lors de la configuration de la clinique')
  }

  // Créer une nouvelle session avec les informations de la clinique
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  const { data: session, error: sessionError } = await supabase
    .from('vet_sessions')
    .insert({
      clinic_email: email,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      last_activity: new Date().toISOString(),
      clinic_name: clinic_name,
      clinic_phone: clinic_phone,
      clinic_address: clinic_address,
      account_status: 'active',
      registration_date: new Date().toISOString()
    })
    .select()
    .single()

  if (sessionError) {
    console.error('❌ Erreur lors de la création de la session:', sessionError)
    throw new Error('Erreur lors de la création du compte')
  }

  console.log('✅ Compte créé avec succès')

  return new Response(
    JSON.stringify({
      success: true,
      session_token: sessionToken,
      clinic: {
        email: email,
        name: clinic_name,
        phone: clinic_phone,
        address: clinic_address
      },
      expires_at: expiresAt.toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleLogin(supabase: any, { email, password }: LoginRequest) {
  console.log('🔄 Tentative de connexion pour:', email)
  
  // Vérifier d'abord si c'est le mot de passe de démo
  if (password !== 'vet123') {
    console.log('❌ Mot de passe invalide')
    throw new Error('Identifiants invalides')
  }

  // Vérifier que l'email correspond à l'email de la clinique
  const { data: clinicSettings, error: clinicError } = await supabase
    .from('clinic_settings')
    .select('clinic_email')
    .single()

  if (clinicError) {
    console.error('❌ Erreur lors de la récupération des paramètres de la clinique:', clinicError)
    throw new Error('Erreur de configuration de la clinique')
  }

  if (!clinicSettings.clinic_email || clinicSettings.clinic_email !== email) {
    console.log('❌ Email ne correspond pas à celui de la clinique')
    throw new Error('Identifiants invalides')
  }

  console.log('✅ Email de la clinique vérifié')

  // Récupérer les informations de la clinique depuis vet_sessions
  const { data: clinicInfo, error: clinicInfoError } = await supabase
    .from('vet_sessions')
    .select('clinic_name, clinic_phone, clinic_address')
    .eq('clinic_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Supprimer les sessions existantes pour cette clinique
  await supabase
    .from('vet_sessions')
    .delete()
    .eq('clinic_email', email)

  // Créer une nouvelle session
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  const { data: session, error: sessionError } = await supabase
    .from('vet_sessions')
    .insert({
      clinic_email: email,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      last_activity: new Date().toISOString(),
      clinic_name: clinicInfo?.clinic_name || 'Clinique Vétérinaire',
      clinic_phone: clinicInfo?.clinic_phone,
      clinic_address: clinicInfo?.clinic_address,
      account_status: 'active'
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
      clinic: {
        email: email,
        name: clinicInfo?.clinic_name || 'Clinique Vétérinaire',
        phone: clinicInfo?.clinic_phone,
        address: clinicInfo?.clinic_address
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
    .select('*')
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
      clinic: {
        email: session.clinic_email,
        name: session.clinic_name || 'Clinique Vétérinaire',
        phone: session.clinic_phone,
        address: session.clinic_address
      },
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
