
-- Vérifier les comptes créés manuellement pour la clinique "Clinique coeur joyeux"
SELECT 
  acc.provisional_password,
  c.name as clinic_name,
  acc.created_at,
  acc.password_changed,
  acc.first_login_completed
FROM admin_clinic_creations acc
JOIN clinics c ON c.id = acc.clinic_id
WHERE c.name ILIKE '%coeur%joyeux%' OR c.name ILIKE '%cœur%joyeux%'
ORDER BY acc.created_at DESC
LIMIT 1;
