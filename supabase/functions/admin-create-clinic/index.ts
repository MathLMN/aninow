
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header to verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client with service role key for user creation
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Create regular client to verify admin status
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Get current user from the auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('❌ User verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is an admin
    const { data: adminProfile, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminProfile) {
      console.error('❌ Admin verification failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { clinicName, userEmail, userName } = await req.json();
    
    if (!clinicName?.trim() || !userEmail?.trim() || !userName?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔄 Creating manual clinic account:', { clinicName, userEmail, userName });

    // Generate a provisional password
    const provisionalPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
    
    // Create the user account with Admin API
    const { data: authResult, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail.trim(),
      password: provisionalPassword,
      email_confirm: true,
      user_metadata: {
        name: userName.trim(),
        provisional_password: true,
        first_login: true
      }
    });

    if (authError || !authResult.user) {
      console.error('❌ Error creating user:', authError);
      return new Response(
        JSON.stringify({ error: authError?.message || 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authResult.user.id;
    console.log('✅ User created with ID:', userId);

    // Create the clinic
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .insert([{ name: clinicName.trim() }])
      .select()
      .single();

    if (clinicError) {
      console.error('❌ Error creating clinic:', clinicError);
      // Try to clean up the created user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: 'Failed to create clinic' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Clinic created with ID:', clinic.id);

    // Create user clinic access
    const { error: accessError } = await supabaseAdmin
      .from('user_clinic_access')
      .insert([{
        user_id: userId,
        clinic_id: clinic.id,
        role: 'admin',
        is_active: true,
        created_by_admin: user.id,
        provisional_password_set: true
      }]);

    if (accessError) {
      console.error('❌ Error creating clinic access:', accessError);
      // Try to clean up created resources
      await supabaseAdmin.auth.admin.deleteUser(userId);
      await supabaseAdmin.from('clinics').delete().eq('id', clinic.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create clinic access' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Clinic access created');

    // Track the manual creation
    const { error: trackingError } = await supabaseAdmin
      .from('admin_clinic_creations')
      .insert([{
        clinic_id: clinic.id,
        admin_user_id: user.id,
        clinic_user_id: userId,
        provisional_password: provisionalPassword,
        password_changed: false,
        first_login_completed: false
      }]);

    if (trackingError) {
      console.error('❌ Error tracking manual creation:', trackingError);
      // Don't fail the whole process for tracking errors
    } else {
      console.log('✅ Manual creation tracked successfully');
    }

    console.log('✅ Manual clinic account created successfully');
    return new Response(
      JSON.stringify({
        clinicId: clinic.id,
        userId,
        provisionalPassword
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Unexpected error in admin-create-clinic:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
