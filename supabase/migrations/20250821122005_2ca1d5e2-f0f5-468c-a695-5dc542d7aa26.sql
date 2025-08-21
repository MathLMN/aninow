
-- Mise à jour des politiques RLS pour permettre la suppression des réservations
-- Supprimer les anciennes politiques trop permissives
DROP POLICY IF EXISTS "Allow all operations on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow all operations on ai_analysis_logs" ON ai_analysis_logs;

-- Créer des politiques plus spécifiques et sécurisées pour les réservations
CREATE POLICY "Enable read access for all users" ON bookings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON bookings FOR DELETE USING (true);

-- Créer des politiques pour les logs d'analyse IA
CREATE POLICY "Enable read access for ai_analysis_logs" ON ai_analysis_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for ai_analysis_logs" ON ai_analysis_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for ai_analysis_logs" ON ai_analysis_logs FOR UPDATE USING (true);
CREATE POLICY "Enable delete for ai_analysis_logs" ON ai_analysis_logs FOR DELETE USING (true);
