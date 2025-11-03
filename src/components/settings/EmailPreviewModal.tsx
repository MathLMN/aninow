import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface EmailPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicName: string;
  clinicPhone?: string;
  clinicAddress?: string;
}

export const EmailPreviewModal = ({ 
  open, 
  onOpenChange, 
  clinicName,
  clinicPhone,
  clinicAddress 
}: EmailPreviewModalProps) => {
  // Example data for preview
  const exampleData = {
    clientName: "Sophie Martin",
    animalName: "Max",
    date: new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: "14:30",
    vetName: "Dr. Dupont",
    reason: "Vaccination annuelle",
  };

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
          
          <p>Bonjour <strong>${exampleData.clientName}</strong>,</p>
          
          <p>Nous avons le plaisir de confirmer votre rendez-vous pour <strong>${exampleData.animalName}</strong>.</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">📅 Date :</span> ${exampleData.date}
            </div>
            <div class="info-row">
              <span class="label">🕐 Heure :</span> ${exampleData.time}
            </div>
            <div class="info-row">
              <span class="label">👨‍⚕️ Vétérinaire :</span> ${exampleData.vetName}
            </div>
            <div class="info-row">
              <span class="label">📋 Motif :</span> ${exampleData.reason}
            </div>
          </div>
          
          <h3>📍 Lieu du rendez-vous</h3>
          <div class="info-box">
            <div class="info-row"><strong>${clinicName || "Votre clinique"}</strong></div>
            ${clinicAddress ? `<div class="info-row">${clinicAddress}</div>` : '<div class="info-row"><em>Adresse de votre clinique</em></div>'}
            ${clinicPhone ? `<div class="info-row">☎️ ${clinicPhone}</div>` : '<div class="info-row"><em>Téléphone de votre clinique</em></div>'}
          </div>
          
          <h3>⚠️ Informations importantes</h3>
          <ul>
            <li>Merci d'arriver 5 minutes avant l'heure du rendez-vous</li>
            <li>N'oubliez pas le carnet de santé de votre animal</li>
            <li>Si vous devez annuler, merci de nous prévenir au plus tôt</li>
          </ul>
          
          <p>À très bientôt !</p>
          <p><em>L'équipe de ${clinicName || "Votre clinique"}</em></p>
        </div>
        
        <div class="footer">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          ${clinicPhone ? `<p>Pour toute question, contactez-nous au ${clinicPhone}</p>` : ''}
        </div>
      </body>
    </html>
  `;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Aperçu de l'email de confirmation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">De :</span> {clinicName || "Votre clinique"} &lt;notifications@aninow.fr&gt;
              </div>
              <div>
                <span className="font-semibold">Objet :</span> Confirmation de votre rendez-vous - {exampleData.animalName}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                ℹ️ Ceci est un aperçu avec des données d'exemple
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg bg-white">
            <iframe
              srcDoc={emailHtml}
              className="w-full h-[600px] border-0"
              title="Email Preview"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
