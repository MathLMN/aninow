import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-vet-navy mb-8">Mentions légales</h1>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Éditeur du site</h2>
            <p className="text-vet-brown">
              <strong>Raison sociale :</strong> [À compléter]<br />
              <strong>Forme juridique :</strong> [À compléter]<br />
              <strong>Adresse :</strong> [À compléter]<br />
              <strong>Téléphone :</strong> [À compléter]<br />
              <strong>Email :</strong> [À compléter]<br />
              <strong>SIRET :</strong> [À compléter]<br />
              <strong>Numéro TVA intracommunautaire :</strong> [À compléter]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Directeur de la publication</h2>
            <p className="text-vet-brown">
              [Nom du directeur de publication]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Hébergement</h2>
            <p className="text-vet-brown">
              <strong>Hébergeur :</strong> Lovable (GPT Labs, Inc.)<br />
              <strong>Adresse :</strong> 2261 Market Street #4667, San Francisco, CA 94114, États-Unis<br />
              <strong>Site web :</strong> <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-vet-blue hover:underline">https://lovable.dev</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Propriété intellectuelle</h2>
            <p className="text-vet-brown">
              L'ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété exclusive de AniNow, sauf mention contraire. 
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de AniNow.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Protection des données personnelles</h2>
            <p className="text-vet-brown">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
              vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. 
              Pour exercer ces droits, veuillez nous contacter à l'adresse : [email de contact].
            </p>
            <p className="text-vet-brown mt-4">
              Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-vet-blue hover:underline">Politique de confidentialité</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Cookies</h2>
            <p className="text-vet-brown">
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. 
              Aucun cookie de suivi ou de publicité n'est utilisé sans votre consentement préalable.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
