import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-24 max-w-6xl">
        <h1 className="text-4xl font-bold text-vet-navy mb-8">Politique de confidentialité</h1>
        
        <p className="text-sm text-vet-brown/70 mb-8">
          Dernière mise à jour : 25/11/2025
        </p>

        <div className="space-y-8 text-vet-brown">
          <p>
            La présente politique décrit la manière dont AniNow collecte, utilise et protège les données personnelles 
            dans le cadre de l'utilisation de sa plateforme de demande de rendez-vous vétérinaires. Elle s'applique 
            aux utilisateurs particuliers et aux professionnels disposant d'un espace dédié.
          </p>

          <section className="mt-12">
            <h2 className="text-3xl font-bold text-vet-navy mb-6">
              MODULE 1 — UTILISATEURS PARTICULIERS (PROPRIÉTAIRES D'ANIMAUX)
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">1. Responsable du traitement</h3>
                <p className="mb-4">Dans le cadre d'une demande de rendez-vous :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>La clinique vétérinaire choisie est responsable du traitement des données personnelles.</li>
                  <li>AniNow agit comme sous-traitant, conformément à l'article 28 du RGPD.</li>
                </ul>
                <p className="mt-4">
                  Contact AniNow : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">2. Données collectées</h3>
                <p className="mb-4">
                  Lors de la demande de rendez-vous, AniNow collecte uniquement les données nécessaires à la 
                  transmission de la demande à la clinique :
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-vet-navy mb-2">2.1 Données personnelles de l'utilisateur</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Nom, prénom</li>
                      <li>Adresse électronique</li>
                      <li>Numéro de téléphone</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-vet-navy mb-2">2.2 Données sur l'animal</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Nom, espèce, race</li>
                      <li>Âge, poids, sexe</li>
                      <li>Statut de stérilisation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-vet-navy mb-2">2.3 Informations liées au motif de consultation</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Motif de rendez-vous</li>
                      <li>Symptômes décrits</li>
                      <li>Durée des symptômes</li>
                      <li>Historique ou informations complémentaires jugées utiles</li>
                    </ul>
                    <p className="mt-2 italic">
                      Ces données médicales sont déclaratives et ne font l'objet d'aucune analyse médicale automatisée.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-vet-navy mb-2">2.4 Données techniques</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Adresse IP</li>
                      <li>Navigateur utilisé</li>
                      <li>Journaux de connexion nécessaires à la sécurité</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">3. Finalités du traitement</h3>
                <p className="mb-4">Les données collectées servent à :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>transmettre la demande de rendez-vous à la clinique vétérinaire ;</li>
                  <li>permettre à la clinique de préparer la prise en charge ;</li>
                  <li>envoyer des notifications et rappels fonctionnels ;</li>
                  <li>garantir le bon fonctionnement, la sécurité et l'intégrité de la plateforme ;</li>
                  <li>établir des statistiques anonymisées pour améliorer le service.</li>
                </ul>
                <p className="mt-4">
                  AniNow n'effectue aucune prise de décision médicale.<br />
                  L'outil de qualification proposé n'est pas un dispositif médical.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">4. Base légale</h3>
                <p className="mb-4">Les traitements sont fondés sur :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>l'exécution d'un contrat (gestion de la demande de rendez-vous) ;</li>
                  <li>l'intérêt légitime (sécurité, amélioration du service) ;</li>
                  <li>le consentement lorsque requis (ex. communications marketing, si activées).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">5. Destinataires des données</h3>
                <p className="mb-4">Les données peuvent être transmises :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>à la clinique vétérinaire choisie par l'utilisateur ;</li>
                  <li>aux prestataires techniques d'AniNow (Lovable, Supabase) ;</li>
                  <li>aux autorités compétentes en cas d'obligation légale.</li>
                </ul>
                <p className="mt-4 font-semibold">
                  Aucune donnée n'est jamais vendue ou cédée à des tiers.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">6. Durée de conservation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Données liées aux demandes de rendez-vous : 3 ans après le dernier contact</li>
                  <li>Journaux techniques : 1 an</li>
                  <li>Données éventuellement liées à des opérations comptables : 10 ans (si applicable)</li>
                </ul>
                <p className="mt-4">
                  Au terme de ces délais, les données sont supprimées ou anonymisées.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">7. Droits des utilisateurs</h3>
                <p className="mb-4">Conformément au RGPD, l'utilisateur dispose de :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>droit d'accès ;</li>
                  <li>droit de rectification ;</li>
                  <li>droit d'effacement ;</li>
                  <li>droit d'opposition ;</li>
                  <li>droit à la limitation ;</li>
                  <li>droit à la portabilité ;</li>
                  <li>droit de retirer son consentement.</li>
                </ul>
                <p className="mt-4">
                  Demande par email : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>
                </p>
                <p className="mt-4">
                  Réclamation possible auprès de la CNIL : 
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-vet-blue hover:underline ml-1">
                    www.cnil.fr
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">8. Sécurité des données</h3>
                <p className="mb-4">AniNow met en œuvre des mesures techniques et organisationnelles adaptées :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>chiffrement des communications ;</li>
                  <li>hébergement sécurisé via Supabase ;</li>
                  <li>contrôles d'accès restreints ;</li>
                  <li>journalisation et surveillance des accès ;</li>
                  <li>sauvegardes et protection contre l'intrusion.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">9. Cookies</h3>
                <p>AniNow utilise uniquement :</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>des cookies techniques indispensables au fonctionnement du service.</li>
                </ul>
                <p className="mt-4">
                  Aucun cookie publicitaire ou de suivi n'est déployé sans consentement préalable.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">10. Transferts hors Union européenne</h3>
                <p className="mb-4">
                  Certains prestataires techniques peuvent traiter les données hors UE (ex. États-Unis).<br />
                  Ces transferts sont encadrés par :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>les clauses contractuelles types de la Commission européenne ;</li>
                  <li>des garanties de sécurité conformes au RGPD.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-bold text-vet-navy mb-6">
              MODULE 2 — PROFESSIONNELS (CLINIQUES VÉTÉRINAIRES – ESPACE PRO)
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">1. Responsable du traitement</h3>
                <p className="mb-4">
                  Les cliniques disposant d'un espace professionnel AniNow sont responsables du traitement 
                  des données relatives à :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>leurs membres ;</li>
                  <li>leurs patients ;</li>
                  <li>leurs utilisateurs internes (ASV, vétérinaires) ;</li>
                  <li>l'usage de l'espace pro.</li>
                </ul>
                <p className="mt-4">
                  AniNow agit comme sous-traitant pour la fourniture de l'infrastructure technique.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">2. Données collectées pour l'espace pro</h3>
                <p className="mb-4">AniNow collecte :</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-vet-navy mb-2">2.1 Données d'identification</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Nom et prénom du titulaire du compte</li>
                      <li>Adresse email professionnelle</li>
                      <li>Nom de la clinique</li>
                      <li>Coordonnées de contact</li>
                      <li>Spécialité et structure de rattachement</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-vet-navy mb-2">2.2 Données de connexion</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Identifiant</li>
                      <li>Mot de passe (via Supabase Auth, jamais lisible par AniNow)</li>
                      <li>Journaux d'accès, actions réalisées dans l'interface</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-vet-navy mb-2">2.3 Données opérationnelles</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Informations liées à la gestion des rendez-vous</li>
                      <li>Paramétrage des créneaux et des ressources</li>
                      <li>Historique interne de planification</li>
                      <li>Données d'usage du tableau de bord</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">3. Finalités du traitement (espace pro)</h3>
                <p className="mb-4">Les données sont utilisées pour :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>créer et maintenir l'accès au compte professionnel ;</li>
                  <li>permettre la gestion et la validation des demandes de rendez-vous ;</li>
                  <li>configurer le planning et les ressources de la clinique ;</li>
                  <li>sécuriser les accès (authentification, logs) ;</li>
                  <li>assurer la maintenance, le support et la sécurité technique ;</li>
                  <li>produire des statistiques anonymisées sur l'usage de la plateforme.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">4. Base légale</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Exécution du contrat (accès à l'espace pro AniNow) ;</li>
                  <li>Intérêt légitime (sécurité des accès, prévention des abus).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">5. Destinataires</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AniNow (sous-traitant) ;</li>
                  <li>Prestataires techniques : Lovable, Supabase ;</li>
                  <li>Autorités publiques si la loi l'exige.</li>
                </ul>
                <p className="mt-4 font-semibold">
                  Aucune donnée professionnelle n'est vendue à des tiers.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">6. Durée de conservation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compte pro : durée du contrat + 12 mois</li>
                  <li>Journaux techniques : 1 an</li>
                  <li>Paramétrages internes : suppression immédiate après résiliation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">7. Droits des professionnels</h3>
                <p className="mb-4">Conformément au RGPD, le titulaire du compte pro peut exercer :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>droit d'accès ;</li>
                  <li>droit à la rectification ;</li>
                  <li>droit à la limitation ;</li>
                  <li>droit d'opposition (selon contexte) ;</li>
                  <li>droit d'effacement ;</li>
                  <li>droit à la portabilité.</li>
                </ul>
                <p className="mt-4">
                  Demande : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-vet-navy mb-4">8. Sécurité – espace pro</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Authentification sécurisée (Supabase Auth)</li>
                  <li>Chiffrement des données en transit</li>
                  <li>Gestion stricte des permissions</li>
                  <li>Journalisation des accès et actions</li>
                  <li>Procédures de sauvegarde et prévention des intrusions</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-bold text-vet-navy mb-6">
              MODALITÉS COMMUNES
            </h2>
            <p className="mb-4">
              En cas de modification, AniNow mettra à jour cette page.<br />
              La poursuite d'utilisation de la plateforme vaut acceptation de la nouvelle version.
            </p>
            <p>
              Contact pour toute question : <a href="mailto:contact@aninow.fr" className="text-vet-blue hover:underline">contact@aninow.fr</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
