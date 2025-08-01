
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

interface ChangePasswordRequest {
  session_token: string
  email: string
  current_password: string
  new_password: string
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
      case 'change_password':
        return await handleChangePassword(supabaseClient, data as ChangePasswordRequest)
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

async function handleChangePassword(supabase: any, { session_token, email, current_password, new_password }: ChangePasswordRequest) {
  console.log('🔄 Changement de mot de passe pour:', email)
  
  // Vérifier la session
  const { data: session, error: sessionError } = await supabase
    .from('vet_sessions')
    .select('*')
    .eq('session_token', session_token)
    .eq('clinic_email', email)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (sessionError || !session) {
    console.log('❌ Session invalide ou expirée')
    throw new Error('Session invalide ou expirée')
  }

  // Vérifier l'ancien mot de passe
  if (current_password !== 'vet123') {
    console.log('❌ Mot de passe actuel incorrect')
    throw new Error('Mot de passe actuel incorrect')
  }

  // Validation du nouveau mot de passe
  if (!new_password || new_password.length < 6) {
    throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères')
  }

  // Simuler le changement de mot de passe
  // Dans un système réel, vous stockeriez le hash du nouveau mot de passe
  console.log('✅ Mot de passe changé avec succès pour:', email)

  // Mettre à jour la dernière activité de la session
  await supabase
    .from('vet_sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('session_token', session_token)

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Mot de passe modifié avec succès'
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleLogin(supabase: any, { email, password }: LoginRequest) {
  console.log('🔄 Tentative de connexion pour:', email)
  
  // Vérifier que c'est le mot de passe de démo
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
