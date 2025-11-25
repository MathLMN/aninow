import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-vet-navy mb-8">Politique de confidentialité</h1>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Introduction</h2>
            <p className="text-vet-brown">
              La protection de vos données personnelles est une priorité pour AniNow. Cette politique de confidentialité 
              explique quelles données nous collectons, pourquoi nous les collectons et comment nous les utilisons, 
              conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Responsable du traitement</h2>
            <p className="text-vet-brown">
              Le responsable du traitement des données est :<br />
              <strong>[Nom de l'entreprise]</strong><br />
              [Adresse]<br />
              Email : [email de contact]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Données collectées</h2>
            <p className="text-vet-brown">Nous collectons les données suivantes lors de la prise de rendez-vous :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li><strong>Informations personnelles :</strong> nom, prénom, email, téléphone</li>
              <li><strong>Informations sur l'animal :</strong> nom, espèce, race, âge, poids, sexe, statut de stérilisation</li>
              <li><strong>Informations médicales :</strong> motif de consultation, symptômes, durée des symptômes, historique vaccinal</li>
              <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages consultées</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Finalités du traitement</h2>
            <p className="text-vet-brown">Les données collectées sont utilisées pour :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li>Gérer les demandes de rendez-vous vétérinaires</li>
              <li>Permettre aux cliniques vétérinaires de préparer les consultations</li>
              <li>Envoyer des confirmations et rappels de rendez-vous</li>
              <li>Améliorer la qualité de nos services</li>
              <li>Analyser et prioriser les urgences vétérinaires</li>
              <li>Assurer la sécurité et le bon fonctionnement de la plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Base légale du traitement</h2>
            <p className="text-vet-brown">
              Le traitement de vos données repose sur les bases légales suivantes :
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li><strong>Exécution d'un contrat :</strong> gestion de votre demande de rendez-vous</li>
              <li><strong>Intérêt légitime :</strong> amélioration de nos services et prévention de la fraude</li>
              <li><strong>Consentement :</strong> pour l'envoi de communications marketing (si applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Destinataires des données</h2>
            <p className="text-vet-brown">
              Vos données personnelles sont destinées aux cliniques vétérinaires auprès desquelles vous prenez rendez-vous. 
              Elles peuvent également être partagées avec :
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li>Nos prestataires techniques (hébergement, maintenance)</li>
              <li>Les autorités compétentes en cas d'obligation légale</li>
            </ul>
            <p className="text-vet-brown mt-2">
              Nous ne vendons ni ne louons vos données personnelles à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Durée de conservation</h2>
            <p className="text-vet-brown">
              Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li>Données de rendez-vous : 3 ans après le dernier rendez-vous</li>
              <li>Données de connexion : 1 an</li>
              <li>Données de facturation : selon les obligations légales (10 ans)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Vos droits</h2>
            <p className="text-vet-brown">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> supprimer vos données dans certains cas</li>
              <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
            </ul>
            <p className="text-vet-brown mt-4">
              Pour exercer ces droits, contactez-nous à : [email de contact]
            </p>
            <p className="text-vet-brown mt-2">
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL : 
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-vet-blue hover:underline ml-1">
                www.cnil.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Sécurité des données</h2>
            <p className="text-vet-brown">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données 
              contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération ou la destruction. 
              Nos serveurs sont hébergés par Lovable (Supabase) qui applique des normes de sécurité strictes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Cookies</h2>
            <p className="text-vet-brown">
              Notre site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement de la plateforme. 
              Aucun cookie publicitaire ou de traçage n'est utilisé sans votre consentement préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Modifications</h2>
            <p className="text-vet-brown">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              Toute modification sera publiée sur cette page avec une date de mise à jour.
            </p>
            <p className="text-vet-brown mt-2">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
