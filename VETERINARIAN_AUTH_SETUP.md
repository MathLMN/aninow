
# Guide de Configuration de l'Authentification Vétérinaire

Ce guide explique comment configurer manuellement les comptes vétérinaires avec Supabase Auth.

## Prérequis

- Accès à la console Supabase du projet
- Liste des vétérinaires à migrer depuis la table `clinic_veterinarians`

## Processus de Création d'un Compte Vétérinaire

### 1. Via Edge Function (Recommandé)

Utilisez la fonction `vet-auth-advanced` pour créer automatiquement les comptes :

```javascript
// Appel via l'interface ou directement
const response = await supabase.functions.invoke('vet-auth-advanced', {
  body: {
    action: 'create_vet_account',
    email: 'veterinaire@example.com',
    password: 'motdepasse123',
    veterinarian_id: 'uuid-du-veterinaire'
  }
});
```

### 2. Via la Console Supabase (Manuel)

Si vous devez créer des comptes manuellement :

#### Étape 1 : Créer l'utilisateur dans Auth
1. Aller dans **Authentication > Users** dans la console Supabase
2. Cliquer sur **"Add user"** ou **"Invite user"**
3. Entrer l'email et le mot de passe du vétérinaire
4. Cocher **"Auto Confirm User"** pour éviter l'envoi d'email
5. Cliquer sur **"Create user"**
6. Noter l'**User ID** généré (format UUID)

#### Étape 2 : Lier l'utilisateur au vétérinaire
1. Aller dans **Table Editor > veterinarian_auth_users**
2. Cliquer sur **"Insert row"**
3. Remplir :
   - `user_id` : L'UUID de l'utilisateur créé à l'étape 1
   - `veterinarian_id` : L'UUID du vétérinaire depuis `clinic_veterinarians`
4. Les champs `created_at` et `updated_at` se remplissent automatiquement

#### Étape 3 : Mettre à jour les informations du vétérinaire
1. Aller dans **Table Editor > clinic_veterinarians**
2. Trouver le vétérinaire par son ID
3. Mettre à jour :
   - `email` : L'email utilisé pour l'authentification
   - `auth_migration_status` : `'migrated'`

## Vérification

Pour vérifier qu'un compte fonctionne :
1. Aller sur `/vet/login`
2. Saisir l'email et mot de passe
3. La connexion doit rediriger vers `/vet/dashboard`

## Dépannage

### Erreur "Veterinarian not found"
- Vérifier que l'entrée existe dans `veterinarian_auth_users`
- Vérifier que le `veterinarian_id` correspond à un enregistrement actif dans `clinic_veterinarians`

### Erreur de connexion
- Vérifier l'email et mot de passe dans la console Auth
- S'assurer que l'utilisateur est confirmé (pas en attente)

### Problèmes de redirection
- Vérifier la configuration des URL dans **Authentication > Settings**
- La Site URL doit être configurée correctement

## Migration en Lot

Pour migrer plusieurs vétérinaires :

```sql
-- Exemple de requête pour identifier les vétérinaires à migrer
SELECT 
  id,
  name,
  email,
  auth_migration_status
FROM clinic_veterinarians 
WHERE auth_migration_status = 'legacy' 
AND is_active = true;
```

Utilisez ensuite l'Edge Function pour chaque vétérinaire ou le processus manuel décrit ci-dessus.

## Sécurité

- Les mots de passe sont hachés par Supabase Auth
- Les tokens JWT sont gérés automatiquement
- La fonction avancée permet de changer les mots de passe de façon sécurisée
- Row Level Security (RLS) est activée sur toutes les tables

## Support

Pour des questions spécifiques à l'implémentation, référez-vous au code des hooks :
- `useVetAuth.ts` : Authentification de base
- `useAdvancedVetAuth.ts` : Fonctionnalités avancées
