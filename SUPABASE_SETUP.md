
# Configuration Supabase pour le système de réservation vétérinaire

## Étapes de configuration

### 1. Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé publique

### 2. Configurer les variables d'environnement
Ajouter ces variables dans les secrets Supabase :
- `VITE_SUPABASE_URL` : URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé publique Supabase

### 3. Exécuter les migrations SQL
Dans l'éditeur SQL de Supabase, exécuter le contenu du fichier `src/sql/init.sql`

### 4. Déployer l'Edge Function
1. Installer Supabase CLI : `npm install -g supabase`
2. Connecter à votre projet : `supabase link --project-ref YOUR_PROJECT_REF`
3. Déployer la fonction : `supabase functions deploy analyze-booking`

### 5. Configurer les secrets de l'Edge Function
Si vous utilisez des APIs externes (OpenAI, etc.), ajouter les secrets :
```bash
supabase secrets set OPENAI_API_KEY=your_api_key_here
```

## Fonctionnalités

### Base de données
- **bookings** : Table principale des réservations avec analyse IA
- **ai_analysis_logs** : Logs des analyses IA pour monitoring

### Edge Functions
- **analyze-booking** : Analyse automatique des réservations avec scoring d'urgence

### Hooks React
- **useBookingSubmission** : Soumission des réservations avec analyse IA
- **useVetBookings** : Gestion des réservations côté vétérinaire
- **useBookingFormData** : Gestion des données de formulaire

### Analyse IA
- Score d'urgence de 1 à 10
- Détection automatique des symptômes critiques
- Recommandations d'actions
- Historique des analyses

## Sécurité

Les politiques RLS sont configurées pour permettre toutes les opérations (pour les tests).
En production, ajuster les politiques selon vos besoins :

```sql
-- Exemple de politique plus restrictive
DROP POLICY "Allow all operations on bookings" ON bookings;
CREATE POLICY "Allow booking creation" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow booking reading" ON bookings FOR SELECT USING (true);
```

## Monitoring

Consulter les logs d'analyse IA dans la table `ai_analysis_logs` pour :
- Surveiller les performances
- Analyser la précision des prédictions
- Optimiser les algorithmes
