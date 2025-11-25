import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-vet-navy mb-8">Mentions légales</h1>
        
        <div className="prose max-w-none space-y-6">
          <p className="text-sm text-vet-brown/70 mb-8">
            Dernière mise à jour : 25/11/2025
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">1. Éditeur du site</h2>
            <p className="text-vet-brown">
              Le site et la plateforme AniNow sont édités par :
            </p>
            <p className="text-vet-brown mt-2">
              <strong>Mathilde Lammin – Entrepreneur individuel</strong><br />
              10 rue Martin Luther King, 59250 Halluin<br />
              Adresse de contact : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">2. Direction de la publication</h2>
            <p className="text-vet-brown">
              Directrice de la publication : Mathilde Lammin
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">3. Hébergement</h2>
            <p className="text-vet-brown">
              Le site est hébergé par :
            </p>
            <p className="text-vet-brown mt-2">
              <strong>Lovable (GPT Labs, Inc.)</strong><br />
              2261 Market Street #4667, San Francisco, CA 94114, États-Unis<br />
              Infrastructure technique : Supabase<br />
              Site : <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-vet-blue hover:underline">https://lovable.dev</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">4. Objet du service</h2>
            <p className="text-vet-brown">
              AniNow fournit une plateforme numérique permettant aux propriétaires d'animaux de transmettre une demande de rendez-vous à une clinique vétérinaire partenaire.
            </p>
            <p className="text-vet-brown mt-2">
              AniNow agit exclusivement comme intermédiaire technique et ne fournit aucun diagnostic, acte médical ou conseil vétérinaire.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">5. Responsabilités</h2>
            <ul className="list-disc pl-6 text-vet-brown space-y-2">
              <li>L'utilisateur est responsable de l'exactitude des informations qu'il renseigne.</li>
              <li>La clinique vétérinaire est responsable de la validation, de la gestion et des décisions liées au rendez-vous, ainsi que des données personnelles qu'elle traite.</li>
              <li>AniNow n'est responsable ni des décisions prises par les cliniques, ni des soins prodigués, ni de tout dommage résultant d'une utilisation médicale des informations fournies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">6. Propriété intellectuelle</h2>
            <p className="text-vet-brown">
              Le contenu du site (textes, interfaces, éléments graphiques, algorithmes) est la propriété d'AniNow.
            </p>
            <p className="text-vet-brown mt-2">
              Toute reproduction ou réutilisation sans autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">7. Données personnelles</h2>
            <p className="text-vet-brown">
              Le traitement des données est régi par la <a href="/politique-confidentialite" className="text-vet-blue hover:underline">Politique de confidentialité</a> accessible sur le site.
            </p>
            <p className="text-vet-brown mt-2">
              Pour toute demande liée à vos données : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">8. Cookies</h2>
            <p className="text-vet-brown">
              AniNow utilise uniquement des cookies techniques indispensables au fonctionnement du service.
            </p>
            <p className="text-vet-brown mt-2">
              Aucun cookie publicitaire ou de suivi n'est utilisé sans consentement explicite.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
