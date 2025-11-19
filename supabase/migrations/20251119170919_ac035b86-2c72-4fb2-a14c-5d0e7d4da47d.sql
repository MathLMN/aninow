-- Créer une policy pour permettre l'insertion de photos dans le bucket consultation-photos
-- Les clients non authentifiés peuvent uploader des photos lors de la prise de rendez-vous

-- Policy pour INSERT (upload)
CREATE POLICY "Allow public upload to consultation-photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'consultation-photos');

-- Policy pour SELECT (lecture)
CREATE POLICY "Allow authenticated users to view consultation photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'consultation-photos');