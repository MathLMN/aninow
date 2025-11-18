import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CancellationEmailRequest {
  booking_id: string;
  client_email: string;
  client_name: string;
  animal_name: string;
  appointment_date: string;
  appointment_time: string;
  clinic_id: string;
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
      clinic_id,
    }: CancellationEmailRequest = await req.json();

    console.log(`Sending cancellation email for booking ${booking_id} to ${client_email}`);

    // Get clinic settings using clinic_id
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch clinic and settings
    const { data: clinic, error: clinicError } = await supabase
      .from("clinics")
      .select("*")
      .eq("id", clinic_id)
      .maybeSingle();

    if (clinicError) {
      console.error("Error fetching clinic:", clinicError);
    }

    // Fetch clinic settings
    const { data: clinicSettings, error: settingsError } = await supabase
      .from("clinic_settings")
      .select("*")
      .eq("clinic_id", clinic_id)
      .maybeSingle();

    if (settingsError) {
      console.error("Error fetching clinic settings:", settingsError);
      // Don't fail, just log the error and continue with default values
    }

    // Format date
    const formattedDate = new Date(appointment_date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Get clinic information
    const clinicName = clinicSettings?.clinic_name || clinic?.name || "Clinique Vétérinaire";
    const clinicAddress = clinicSettings?.clinic_address_street
      ? `${clinicSettings.clinic_address_street}, ${clinicSettings.clinic_address_postal_code} ${clinicSettings.clinic_address_city}`
      : "";
    const clinicPhone = clinicSettings?.clinic_phone || "";

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
              background-color: #DC2626;
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
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
              border-left: 4px solid #DC2626;
            }
            .info-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: bold;
              width: 150px;
              color: #666;
            }
            .info-value {
              flex: 1;
              color: #333;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
            .alert-box {
              background-color: #FEE2E2;
              border: 1px solid #DC2626;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Annulation de rendez-vous</h1>
          </div>
          
          <div class="content">
            <p>Bonjour ${client_name},</p>
            
            <div class="alert-box">
              <strong>Votre rendez-vous a été annulé</strong>
            </div>
            
            <p>Nous vous confirmons l'annulation du rendez-vous suivant :</p>
            
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">Animal :</div>
                <div class="info-value">${animal_name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Date :</div>
                <div class="info-value">${formattedDate}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Heure :</div>
                <div class="info-value">${appointment_time}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Clinique :</div>
                <div class="info-value">${clinicName}</div>
              </div>
            </div>
            
            <p>Si vous souhaitez reprendre rendez-vous, n'hésitez pas à nous contacter.</p>
            
            ${clinicPhone ? `<p><strong>Téléphone :</strong> ${clinicPhone}</p>` : ""}
            ${clinicAddress ? `<p><strong>Adresse :</strong> ${clinicAddress}</p>` : ""}
            
            <p>Cordialement,<br>L'équipe de ${clinicName}</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </body>
      </html>
    `;

    // Determine the sender name and email
    const fromName = clinicSettings?.clinic_name || booking.clinic?.name || "Clinique par défaut";
    console.log(`Clinic name used as sender: ${fromName}`);

    const fromAddress = `${fromName} <notifications@aninow.fr>`;
    console.log(`From address: ${fromAddress}`);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [client_email],
      subject: `Annulation de votre rendez-vous pour ${animal_name}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log email sending to database
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        booking_id: booking_id,
        recipient_email: client_email,
        email_type: "cancellation",
        status: emailResponse.error ? "failed" : "sent",
        resend_id: emailResponse.data?.id,
        error_message: emailResponse.error?.message,
      });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cancellation email sent successfully",
        email_id: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-cancellation-email function:", error);

    // Try to log the error to database if we have the booking_id
    try {
      const body = await new Request(error.request?.url || "", {
        method: "POST",
        body: await error.request?.text(),
      }).json();

      if (body.booking_id) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        await supabase.from("email_logs").insert({
          booking_id: body.booking_id,
          recipient_email: body.client_email,
          email_type: "cancellation",
          status: "failed",
          error_message: error.message,
        });
      }
    } catch (logError) {
      console.error("Error logging failed email:", logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
