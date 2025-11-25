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
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 1 – Objet du service</h2>
            <p className="text-vet-brown mb-4">
              Les présentes Conditions Générales d'Utilisation encadrent l'accès et l'usage de la plateforme AniNow, solution mise à disposition des propriétaires d'animaux par les cliniques vétérinaires partenaires.
            </p>
            <p className="text-vet-brown mb-2">AniNow permet :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>la transmission d'une demande de rendez-vous auprès d'une clinique vétérinaire partenaire ;</li>
              <li>la saisie d'informations relatives au motif de consultation ;</li>
              <li>l'utilisation d'un outil d'aide à l'évaluation de la priorité du rendez-vous, fondé sur un algorithme de tri non médical ;</li>
              <li>la mise à disposition d'un planning centralisé pour les équipes vétérinaires.</li>
            </ul>
            <p className="text-vet-brown mt-4">
              Le service n'a pas vocation à fournir un diagnostic médical, ni une décision d'urgence. Il constitue un service d'intermédiation technique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 2 – Acceptation des conditions</h2>
            <p className="text-vet-brown">
              L'utilisation du service implique l'acceptation sans réserve des présentes CGU.
              Si l'utilisateur refuse ces conditions, il ne doit pas utiliser la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 3 – Description détaillée du service</h2>
            <p className="text-vet-brown mb-4">
              AniNow est un outil numérique permettant aux propriétaires d'animaux de solliciter un rendez-vous auprès d'une clinique vétérinaire partenaire.
            </p>
            <p className="text-vet-brown mb-2">Le service inclut :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>un questionnaire guidé destiné à transmettre les informations utiles à la clinique ;</li>
              <li>un module d'aide à la priorisation, non médical, destiné à signaler un potentiel besoin d'attention rapide ;</li>
              <li>un espace de sélection de créneau, sous réserve de validation par la clinique ;</li>
              <li>une interface permettant aux cliniques de consulter, prioriser et valider les demandes.</li>
            </ul>
            <p className="text-vet-brown mt-4">
              Le module d'aide à la priorisation ne constitue pas un dispositif médical, ne se substitue pas à l'évaluation d'un vétérinaire et n'engage en aucun cas la responsabilité d'AniNow.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 4 – Accès au service</h2>
            <p className="text-vet-brown">
              Le service est accessible gratuitement aux propriétaires d'animaux depuis un navigateur Internet compatible.
              AniNow peut restreindre ou suspendre temporairement l'accès pour maintenance, mise à jour ou raisons techniques, sans obligation d'information préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 5 – Engagements de l'utilisateur</h2>
            <p className="text-vet-brown mb-2">L'utilisateur s'engage à :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>fournir des informations exactes, complètes et actualisées ;</li>
              <li>ne pas utiliser la plateforme pour envoyer des demandes fictives, abusives ou répétées ;</li>
              <li>respecter les créneaux confirmés par la clinique ;</li>
              <li>prévenir la clinique en cas d'annulation ou de modification ;</li>
              <li>ne pas transmettre de contenu illégal, offensant ou portant atteinte à des tiers ;</li>
              <li>ne pas usurper l'identité d'une autre personne.</li>
            </ul>
            <p className="text-vet-brown mt-4">
              Toute utilisation abusive pourra entraîner le blocage de l'accès à la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 6 – Demande et confirmation des rendez-vous</h2>
            <p className="text-vet-brown mb-4">
              La sélection d'un créneau sur la plateforme ne constitue pas une confirmation du rendez-vous.
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>La clinique reçoit la demande, l'analyse et décide seule de sa validation, modification ou annulation.</li>
              <li>L'utilisateur est informé par email (ou SMS si applicable) une fois le rendez-vous accepté.</li>
              <li>En cas de suspicion d'urgence, les équipes vétérinaires peuvent contacter l'utilisateur pour proposer un autre créneau ou orienter vers une prise en charge immédiate.</li>
            </ul>
            <p className="text-vet-brown mt-4">
              AniNow n'intervient jamais dans la décision finale de validation ou de prise en charge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 7 – Nature du module d'aide à la priorisation</h2>
            <p className="text-vet-brown mb-2">Le module de qualification et de priorisation fourni par AniNow :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>repose sur les informations déclarées par l'utilisateur ;</li>
              <li>n'a aucune valeur médicale ou diagnostique ;</li>
              <li>ne remplace en aucun cas l'évaluation clinique d'un vétérinaire ;</li>
              <li>a pour seule fonction d'aider la clinique à organiser ses demandes.</li>
            </ul>
            <p className="text-vet-brown mt-4">
              AniNow recommande systématiquement, en cas de doute, de contacter directement un vétérinaire ou un service d'urgence.
            </p>
            <p className="text-vet-brown mt-4">
              AniNow ne peut être tenu responsable d'une mauvaise interprétation des signaux délivrés par l'outil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 8 – Responsabilité</h2>
            
            <h3 className="text-xl font-semibold text-vet-navy mb-3 mt-4">8.1 Responsabilité d'AniNow</h3>
            <p className="text-vet-brown mb-2">
              AniNow agit en tant que fournisseur d'un service d'intermédiation technique.
              À ce titre :
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>AniNow ne fournit aucun acte de soin ou diagnostic ;</li>
              <li>AniNow ne garantit pas la disponibilité des créneaux ;</li>
              <li>AniNow n'est pas responsable du contenu saisi par l'utilisateur ;</li>
              <li>AniNow n'est pas responsable des dommages liés à une indisponibilité temporaire du service ;</li>
              <li>AniNow n'est pas responsable des erreurs d'appréciation ou décisions prises par les cliniques vétérinaires.</li>
            </ul>
            <p className="text-vet-brown mt-4">
              AniNow ne peut être tenu responsable des conséquences médicales d'un retard, d'une absence de prise en charge ou d'un rendez-vous refusé.
            </p>

            <h3 className="text-xl font-semibold text-vet-navy mb-3 mt-6">8.2 Responsabilité des cliniques</h3>
            <p className="text-vet-brown mb-2">La clinique vétérinaire est seule responsable :</p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>de la validation des rendez-vous ;</li>
              <li>de l'interprétation des informations fournies ;</li>
              <li>des soins prodigués et décisions médicales ;</li>
              <li>de la gestion de ses urgences et priorités.</li>
            </ul>

            <h3 className="text-xl font-semibold text-vet-navy mb-3 mt-6">8.3 Responsabilité de l'utilisateur</h3>
            <p className="text-vet-brown">
              L'utilisateur est responsable de l'exactitude des données transmises.
              Toute fausse information peut altérer l'évaluation du besoin par la clinique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 9 – Protection des données à caractère personnel</h2>
            <p className="text-vet-brown mb-4">
              AniNow traite les données personnelles conformément au Règlement Général sur la Protection des Données et à la législation française applicable.
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>Les données collectées sont limitées au strict nécessaire pour transmettre la demande à la clinique.</li>
              <li>AniNow agit comme sous-traitant pour le compte de la clinique, responsable du traitement.</li>
              <li>Les données ne sont jamais utilisées à des fins commerciales sans consentement explicite.</li>
              <li>Les droits d'accès, rectification et suppression peuvent être exercés directement auprès de la clinique ou via le formulaire dédié.</li>
            </ul>
            <p className="text-vet-brown mt-4">
              La politique de confidentialité détaillée est accessible séparément.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 10 – Sécurité</h2>
            <p className="text-vet-brown">
              AniNow met en œuvre des mesures techniques et organisationnelles pour protéger les données.
              Aucune technologie n'étant infaillible, l'utilisateur reconnaît que le risque zéro n'existe pas et qu'AniNow ne peut garantir une sécurité absolue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 11 – Empreinte bancaire (si applicable)</h2>
            <p className="text-vet-brown mb-2">
              Certaines cliniques peuvent proposer la sécurisation des rendez-vous par empreinte bancaire.
            </p>
            <ul className="list-disc list-inside text-vet-brown mt-2 space-y-1 ml-4">
              <li>L'empreinte n'entraîne aucun débit automatique.</li>
              <li>Toute décision de facturation relève exclusivement de la clinique.</li>
              <li>AniNow ne gère ni les paiements, ni les remboursements, ni les litiges.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 12 – Propriété intellectuelle</h2>
            <p className="text-vet-brown">
              Tous les contenus de la plateforme (textes, visuels, algorithmes, interfaces) sont la propriété exclusive d'AniNow.
              Toute reproduction ou utilisation non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 13 – Modifications des CGU</h2>
            <p className="text-vet-brown">
              AniNow peut modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés en cas de modification substantielle.
              La poursuite de l'utilisation vaut acceptation de la version mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 14 – Droit applicable et juridiction</h2>
            <p className="text-vet-brown">
              Les CGU sont soumises au droit français.
              En cas de litige, et sauf dispositions impératives contraires, les tribunaux du ressort du siège social d'AniNow seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-vet-navy mb-4">Article 15 – Contact</h2>
            <p className="text-vet-brown">
              Pour toute question ou signalement concernant le service, l'utilisateur peut contacter : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CGU;
