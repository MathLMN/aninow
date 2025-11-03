import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  booking_id: string;
  client_email: string;
  client_name: string;
  animal_name: string;
  appointment_date: string;
  appointment_time: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      booking_id,
      client_email,
      client_name,
      animal_name,
      appointment_date,
      appointment_time,
    }: ConfirmationEmailRequest = await req.json();

    console.log(`Sending confirmation email for booking ${booking_id} to ${client_email}`);

    // Get additional booking details from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        clinic:clinics (name, slug),
        veterinarian:clinic_veterinarians (name),
        clinic_settings:clinic_settings (
          clinic_name,
          clinic_phone,
          clinic_email,
          clinic_address_street,
          clinic_address_city,
          clinic_address_postal_code
        )
      `)
      .eq("id", booking_id)
      .maybeSingle();

    if (bookingError) {
      console.error("Error fetching booking details:", bookingError);
      throw new Error(`Database error: ${bookingError.message}`);
    }

    if (!booking) {
      console.error("Booking not found for ID:", booking_id);
      throw new Error("Booking not found");
    }

    // Format date
    const formattedDate = new Date(appointment_date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Get clinic settings
    const clinicSettings = booking.clinic_settings?.[0] || {};
    const clinicName = clinicSettings.clinic_name || booking.clinic?.name || "Clinique Vétérinaire";
    const clinicAddress = clinicSettings.clinic_address_street
      ? `${clinicSettings.clinic_address_street}, ${clinicSettings.clinic_address_postal_code} ${clinicSettings.clinic_address_city}`
      : "";
    const clinicPhone = clinicSettings.clinic_phone || "";
    const vetName = booking.veterinarian?.name || "votre vétérinaire";

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #0F766E;
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .info-box {
              background-color: white;
              border-left: 4px solid #0F766E;
              padding: 15px;
              margin: 20px 0;
            }
            .info-row {
              margin: 10px 0;
            }
            .label {
              font-weight: bold;
              color: #0F766E;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
            .button {
              display: inline-block;
              background-color: #0F766E;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✓ Rendez-vous confirmé</h1>
          </div>
          <div class="content">
            <!-- Message d'avertissement "ne pas répondre" -->
            <div style="background-color: #FEF3C7; padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
              <p style="margin: 0; font-size: 14px; color: #92400E;">
                ⚠️ <strong>Email automatique - Ne pas répondre</strong><br>
                Pour toute question, contactez directement votre clinique${clinicPhone ? ` au <strong>${clinicPhone}</strong>` : ''}
              </p>
            </div>
            
            <p>Bonjour <strong>${client_name}</strong>,</p>
            
            <p>Nous avons le plaisir de confirmer votre rendez-vous pour <strong>${animal_name}</strong>.</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">📅 Date :</span> ${formattedDate}
              </div>
              <div class="info-row">
                <span class="label">🕐 Heure :</span> ${appointment_time}
              </div>
              <div class="info-row">
                <span class="label">👨‍⚕️ Vétérinaire :</span> ${vetName}
              </div>
              ${booking.consultation_reason ? `
              <div class="info-row">
                <span class="label">📋 Motif :</span> ${booking.consultation_reason}
              </div>
              ` : ''}
            </div>
            
            <h3>📍 Lieu du rendez-vous</h3>
            <div class="info-box">
              <div class="info-row"><strong>${clinicName}</strong></div>
              ${clinicAddress ? `<div class="info-row">${clinicAddress}</div>` : ''}
              ${clinicPhone ? `<div class="info-row">☎️ ${clinicPhone}</div>` : ''}
            </div>
            
            <h3>⚠️ Informations importantes</h3>
            <ul>
              <li>Merci d'arriver 5 minutes avant l'heure du rendez-vous</li>
              <li>N'oubliez pas le carnet de santé de votre animal</li>
              <li>Si vous devez annuler, merci de nous prévenir au plus tôt</li>
            </ul>
            
            <p>À très bientôt !</p>
            <p><em>L'équipe de ${clinicName}</em></p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            ${clinicPhone ? `<p>Pour toute question, contactez-nous au ${clinicPhone}</p>` : ''}
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: `${clinicName} <notifications@aninow.fr>`,
      replyTo: "noreply@aninow.fr",
      to: [client_email],
      subject: `Confirmation de votre rendez-vous - ${animal_name}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);
    console.log("Clinic name used as sender:", clinicName);
    console.log("From address:", `${clinicName} <notifications@aninow.fr>`);

    // Log the email in database
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        booking_id,
        email_type: "confirmation",
        recipient_email: client_email,
        status: "sent",
        resend_id: emailResponse.id,
      });

    if (logError) {
      console.error("Error logging email:", logError);
      // Don't fail the request if logging fails
    }

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    
    // Try to log the error in database
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { booking_id, client_email } = await req.json();
      
      await supabase
        .from("email_logs")
        .insert({
          booking_id,
          email_type: "confirmation",
          recipient_email: client_email,
          status: "failed",
          error_message: error.message,
        });
    } catch (logError) {
      console.error("Error logging failed email:", logError);
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
