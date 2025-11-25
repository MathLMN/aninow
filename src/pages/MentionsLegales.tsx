import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-vet-navy mb-8">Mentions légales</h1>
        
        <div className="prose max-w-none space-y-6">
          <p className="text-vet-brown mb-8">
            Le site AniNow est édité par Mathilde Lammin, micro-entreprise (entrepreneur individuel) 
            dont le siège social est situé 10 rue Martin Luther King 59250 Halluin, 
            adresse de courrier électronique : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Directeur de la publication</h2>
            <p className="text-vet-brown">
              Le Directeur de la publication des pages gérées par AniNow est : Mathilde Lammin.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Responsabilité</h2>
            <p className="text-vet-brown">
              Chaque utilisateur des services du site AniNow est qualifié d'éditeur concernant ses pages dédiées et informations communiquées.
            </p>
            <p className="text-vet-brown mt-4">
              Chaque professionnel utilisant le service de prise de rendez-vous en ligne de AniNow peut être joint 
              aux coordonnées renseignées dans son espace personnel.
            </p>
            <p className="text-vet-brown mt-4">
              Chaque professionnel est responsable des données personnelles qu'il collecte lors de la prise de 
              rendez-vous en ligne et doit se conformer à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
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
              Pour exercer ces droits, veuillez nous contacter à l'adresse : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>.
            </p>
            <p className="text-vet-brown mt-4">
              Les présentes CGU sont complétées de la <a href="/politique-confidentialite" className="text-vet-blue hover:underline">Politique relative à la protection des données personnelles</a>.
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
