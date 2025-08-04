
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

interface CreateVetAccountRequest {
  email: string
  password: string
  veterinarian_id: string
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
      case 'change_password':
        return await handleChangePassword(supabaseClient, req, data as ChangePasswordRequest)
      case 'create_vet_account':
        return await handleCreateVetAccount(supabaseClient, data as CreateVetAccountRequest)
      case 'deactivate_account':
        return await handleDeactivateAccount(supabaseClient, req)
      default:
        throw new Error('Action non supportée')
    }

  } catch (error) {
    console.error('Erreur dans vet-auth-advanced:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleChangePassword(
  supabase: any, 
  req: Request, 
  { current_password, new_password }: ChangePasswordRequest
) {
  console.log('🔄 Changement de mot de passe demandé')
  
  // Get the user from the JWT token
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('Token d\'autorisation manquant')
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  
  if (userError || !user) {
    throw new Error('Utilisateur non authentifié')
  }

  // Validate the current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current_password,
  })

  if (signInError) {
    throw new Error('Mot de passe actuel incorrect')
  }

  // Validation du nouveau mot de passe
  if (!new_password || new_password.length < 6) {
    throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères')
  }

  // Update the password using the service role key
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: new_password
  })

  if (updateError) {
    console.error('❌ Erreur lors de la mise à jour du mot de passe:', updateError)
    throw new Error('Erreur lors de la mise à jour du mot de passe')
  }

  console.log('✅ Mot de passe changé avec succès pour:', user.email)

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

async function handleCreateVetAccount(
  supabase: any, 
  { email, password, veterinarian_id }: CreateVetAccountRequest
) {
  console.log('🔄 Création d\'un compte vétérinaire pour:', email)
  
  // Verify that the veterinarian exists
  const { data: vet, error: vetError } = await supabase
    .from('clinic_veterinarians')
    .select('*')
    .eq('id', veterinarian_id)
    .single()

  if (vetError || !vet) {
    throw new Error('Vétérinaire non trouvé')
  }

  // Check if there's already an auth link for this veterinarian
  const { data: existingLink, error: linkError } = await supabase
    .from('veterinarian_auth_users')
    .select('*')
    .eq('veterinarian_id', veterinarian_id)
    .single()

  if (existingLink) {
    throw new Error('Ce vétérinaire a déjà un compte associé')
  }

  // Create the user account
  const { data: authData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Skip email confirmation for admin-created accounts
  })

  if (createError) {
    console.error('❌ Erreur lors de la création du compte:', createError)
    throw new Error(`Erreur lors de la création du compte: ${createError.message}`)
  }

  // Create the link in veterinarian_auth_users
  const { error: linkInsertError } = await supabase
    .from('veterinarian_auth_users')
    .insert({
      user_id: authData.user.id,
      veterinarian_id: veterinarian_id
    })

  if (linkInsertError) {
    // If linking fails, clean up the created user
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw new Error(`Erreur lors de la liaison: ${linkInsertError.message}`)
  }

  // Update veterinarian record with email and migration status
  await supabase
    .from('clinic_veterinarians')
    .update({
      email,
      auth_migration_status: 'migrated'
    })
    .eq('id', veterinarian_id)

  console.log('✅ Compte vétérinaire créé avec succès:', email)

  return new Response(
    JSON.stringify({
      success: true,
      user_id: authData.user.id,
      veterinarian: vet,
      message: 'Compte créé avec succès'
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleDeactivateAccount(supabase: any, req: Request) {
  console.log('🔄 Désactivation de compte demandée')
  
  // Get the user from the JWT token
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('Token d\'autorisation manquant')
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  
  if (userError || !user) {
    throw new Error('Utilisateur non authentifié')
  }

  // Find the veterinarian link
  const { data: authLink, error: linkError } = await supabase
    .from('veterinarian_auth_users')
    .select('veterinarian_id')
    .eq('user_id', user.id)
    .single()

  if (linkError || !authLink) {
    throw new Error('Liaison vétérinaire non trouvée')
  }

  // Deactivate the veterinarian instead of deleting the user
  const { error: deactivateError } = await supabase
    .from('clinic_veterinarians')
    .update({ is_active: false })
    .eq('id', authLink.veterinarian_id)

  if (deactivateError) {
    throw new Error('Erreur lors de la désactivation')
  }

  console.log('✅ Compte désactivé avec succès')

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Compte désactivé avec succès'
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}
