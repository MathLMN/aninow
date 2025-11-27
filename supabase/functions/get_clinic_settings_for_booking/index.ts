
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { clinic_slug } = await req.json()

    if (!clinic_slug) {
      return new Response(
        JSON.stringify({ error: 'clinic_slug is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get clinic by slug
    const { data: clinic, error: clinicError } = await supabaseClient
      .from('clinics')
      .select('id, name, slug')
      .eq('slug', clinic_slug)
      .single()

    if (clinicError || !clinic) {
      return new Response(
        JSON.stringify({ error: 'Clinic not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get clinic settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('clinic_settings')
      .select('*')
      .eq('clinic_id', clinic.id)
      .single()

    // Get recurring blocks
    const { data: recurringBlocks } = await supabaseClient
      .from('recurring_slot_blocks')
      .select('*')
      .eq('clinic_id', clinic.id)
      .eq('is_active', true)

    // Get vet schedules
    const { data: vetSchedules } = await supabaseClient
      .from('veterinarian_schedules')
      .select('*')
      .eq('clinic_id', clinic.id)

    // Get vet absences (future only)
    const today = new Date().toISOString().split('T')[0]
    const { data: vetAbsences } = await supabaseClient
      .from('veterinarian_absences')
      .select('*')
      .eq('clinic_id', clinic.id)
      .gte('end_date', today)

    if (settingsError) {
      console.error('Settings error:', settingsError)
      // Return default settings if none found
      const defaultSettings = {
        clinic_name: clinic.name,
        asv_enabled: true,
        default_slot_duration_minutes: 30,
        daily_schedules: {
          monday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
          tuesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
          wednesday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
          thursday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
          friday: { isOpen: true, morning: { start: '08:00', end: '12:00' }, afternoon: { start: '14:00', end: '18:00' } },
          saturday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } },
          sunday: { isOpen: false, morning: { start: '', end: '' }, afternoon: { start: '', end: '' } }
        }
      }
      
      return new Response(
        JSON.stringify({ 
          clinic, 
          settings: defaultSettings,
          recurringBlocks: recurringBlocks || [],
          vetSchedules: vetSchedules || [],
          vetAbsences: vetAbsences || []
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        clinic, 
        settings,
        recurringBlocks: recurringBlocks || [],
        vetSchedules: vetSchedules || [],
        vetAbsences: vetAbsences || []
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
