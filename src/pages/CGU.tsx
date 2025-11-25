import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CGU = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-vet-navy mb-8">Conditions Générales d'Utilisation</h1>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 1 - Objet</h2>
            <p className="text-vet-brown">
              Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation 
              de la plateforme AniNow ainsi que les droits et obligations des utilisateurs dans ce cadre.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 2 - Acceptation des CGU</h2>
            <p className="text-vet-brown">
              L'utilisation de la plateforme AniNow implique l'acceptation pleine et entière des présentes CGU. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 3 - Description du service</h2>
            <p className="text-vet-brown">
              AniNow est une plateforme de prise de rendez-vous vétérinaires en ligne permettant aux propriétaires d'animaux 
              de prendre rendez-vous auprès de cliniques vétérinaires partenaires. La plateforme propose :
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li>Une interface de prise de rendez-vous en ligne</li>
              <li>Un système de description des symptômes et motifs de consultation</li>
              <li>Un système d'analyse et de priorisation des demandes</li>
              <li>Une gestion des plannings pour les cliniques vétérinaires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 4 - Accès au service</h2>
            <p className="text-vet-brown">
              L'accès à la plateforme est gratuit pour les propriétaires d'animaux. L'utilisation nécessite une connexion Internet 
              et un navigateur web compatible. AniNow se réserve le droit de suspendre temporairement l'accès au service 
              pour des raisons de maintenance ou de mises à jour.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 5 - Obligations de l'utilisateur</h2>
            <p className="text-vet-brown">L'utilisateur s'engage à :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1">
              <li>Fournir des informations exactes et sincères lors de la prise de rendez-vous</li>
              <li>Ne pas utiliser le service de manière abusive ou frauduleuse</li>
              <li>Respecter les horaires de rendez-vous confirmés</li>
              <li>Informer la clinique en cas d'annulation ou de retard</li>
              <li>Ne pas transmettre de contenu illicite, offensant ou contraire aux bonnes mœurs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 6 - Confirmation des rendez-vous</h2>
            <p className="text-vet-brown">
              Les rendez-vous pris via la plateforme sont soumis à validation par la clinique vétérinaire. 
              La demande de rendez-vous ne constitue pas une confirmation automatique. L'utilisateur recevra un email 
              de confirmation une fois le rendez-vous validé par la clinique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 7 - Responsabilité</h2>
            <p className="text-vet-brown">
              AniNow est un intermédiaire technique facilitant la prise de rendez-vous. La responsabilité des soins vétérinaires 
              et du diagnostic médical incombe exclusivement aux cliniques vétérinaires et aux praticiens. 
              AniNow ne peut être tenu responsable de la qualité des soins fournis, des erreurs de diagnostic 
              ou de tout dommage résultant de la consultation vétérinaire.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 8 - Protection des données</h2>
            <p className="text-vet-brown">
              Les données personnelles collectées sont traitées conformément au RGPD. 
              Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-vet-blue hover:underline">Politique de confidentialité</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 9 - Modification des CGU</h2>
            <p className="text-vet-brown">
              AniNow se réserve le droit de modifier les présentes CGU à tout moment. 
              Les utilisateurs seront informés de toute modification substantielle. 
              La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 10 - Droit applicable</h2>
            <p className="text-vet-brown">
              Les présentes CGU sont régies par le droit français. Tout litige relatif à l'interprétation 
              ou à l'exécution des présentes sera soumis aux tribunaux compétents.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CGU;
