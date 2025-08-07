
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to generate a URL-friendly slug from clinic name
function generateSlug(clinicName: string): string {
  return clinicName
    .toLowerCase()
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Function to ensure slug uniqueness
async function ensureUniqueSlug(supabase: any, baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const { data } = await supabase
      .from('clinics')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (!data) {
      // Slug is available
      return slug
    }
    
    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { clinicName, userEmail, userName } = await req.json()

    console.log('Creating clinic with data:', { clinicName, userEmail, userName })

    if (!clinicName || !userEmail || !userName) {
      throw new Error('Missing required fields: clinicName, userEmail, userName')
    }

    // Generate unique slug
    const baseSlug = generateSlug(clinicName)
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug)
    
    console.log('Generated unique slug:', uniqueSlug)

    // Generate a random password
    const provisionalPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)

    // Create user in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: provisionalPassword,
      user_metadata: {
        name: userName,
        provisionalPassword: true
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(`Failed to create user: ${authError.message}`)
    }

    console.log('Created auth user:', authUser.user?.id)

    // Create clinic with slug
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: clinicName,
        slug: uniqueSlug
      })
      .select()
      .single()

    if (clinicError) {
      console.error('Clinic creation error:', clinicError)
      // Cleanup: delete the auth user if clinic creation fails
      await supabase.auth.admin.deleteUser(authUser.user!.id)
      throw new Error(`Failed to create clinic: ${clinicError.message}`)
    }

    console.log('Created clinic:', clinic.id)

    // Create user-clinic access
    const { error: accessError } = await supabase
      .from('user_clinic_access')
      .insert({
        user_id: authUser.user!.id,
        clinic_id: clinic.id,
        created_by_admin: authUser.user!.id,
        provisional_password_set: true,
        role: 'veterinarian'
      })

    if (accessError) {
      console.error('User clinic access error:', accessError)
      // Cleanup: delete both user and clinic if access creation fails
      await supabase.auth.admin.deleteUser(authUser.user!.id)
      await supabase.from('clinics').delete().eq('id', clinic.id)
      throw new Error(`Failed to create user clinic access: ${accessError.message}`)
    }

    // Create admin_clinic_creations record for tracking
    const { error: trackingError } = await supabase
      .from('admin_clinic_creations')
      .insert({
        admin_user_id: authUser.user!.id, // We'll need to get the actual admin user ID
        clinic_user_id: authUser.user!.id,
        clinic_id: clinic.id,
        provisional_password: provisionalPassword
      })

    if (trackingError) {
      console.error('Tracking error (non-critical):', trackingError)
      // Don't throw error for tracking failure
    }

    // Create default clinic settings
    const { error: settingsError } = await supabase
      .from('clinic_settings')
      .insert({
        clinic_id: clinic.id,
        clinic_name: clinicName
      })

    if (settingsError) {
      console.error('Settings error (non-critical):', settingsError)
      // Don't throw error for settings failure
    }

    console.log('Clinic creation completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        clinicId: clinic.id,
        userId: authUser.user!.id,
        provisionalPassword,
        slug: uniqueSlug
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in admin-create-clinic:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
