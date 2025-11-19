-- Créer un bucket PRIVÉ pour les photos de consultation
INSERT INTO storage.buckets (id, name, public)
VALUES ('consultation-photos', 'consultation-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Permettre l'upload anonyme (pour les clients qui prennent RDV en ligne)
-- Les photos seront organisées par clinic_id/booking_id/
DROP POLICY IF EXISTS "Allow anonymous upload to consultation-photos" ON storage.objects;
CREATE POLICY "Allow anonymous upload to consultation-photos"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'consultation-photos' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- Permettre aux vétérinaires de voir UNIQUEMENT les photos de leur clinique
DROP POLICY IF EXISTS "Veterinarians can view their clinic photos" ON storage.objects;
CREATE POLICY "Veterinarians can view their clinic photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'consultation-photos' AND
  (storage.foldername(name))[1]::uuid = get_user_clinic_id()
);

-- Permettre aux vétérinaires de supprimer les photos de leur clinique
DROP POLICY IF EXISTS "Veterinarians can delete their clinic photos" ON storage.objects;
CREATE POLICY "Veterinarians can delete their clinic photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'consultation-photos' AND
  (storage.foldername(name))[1]::uuid = get_user_clinic_id()
);

-- Fonction pour supprimer automatiquement les photos d'un booking supprimé
CREATE OR REPLACE FUNCTION delete_booking_photos()
RETURNS TRIGGER AS $$
DECLARE
  folder_path text;
BEGIN
  folder_path := OLD.clinic_id::text || '/' || OLD.id::text;
  
  -- Supprimer tous les fichiers du dossier
  DELETE FROM storage.objects
  WHERE bucket_id = 'consultation-photos'
    AND name LIKE folder_path || '/%';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour nettoyer les photos lors de la suppression d'un booking
DROP TRIGGER IF EXISTS on_booking_deleted ON bookings;
CREATE TRIGGER on_booking_deleted
  BEFORE DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION delete_booking_photos();