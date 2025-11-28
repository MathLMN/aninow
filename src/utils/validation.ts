import { z } from 'zod';

// Validation pour les créneaux bloqués
export const blockSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (format YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Heure de début invalide (format HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Heure de fin invalide (format HH:MM)'),
  veterinarianId: z.string().uuid('ID vétérinaire invalide'),
  clinicId: z.string().uuid('ID clinique invalide'),
  reason: z.string().max(500, 'Raison trop longue (max 500 caractères)').optional(),
});

// Validation pour la création de clinique
export const createClinicSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Nom de clinique trop court (min 2 caractères)')
    .max(100, 'Nom de clinique trop long (max 100 caractères)'),
  slug: z.string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug invalide (uniquement lettres minuscules, chiffres et tirets)')
    .min(3, 'Slug trop court (min 3 caractères)')
    .max(50, 'Slug trop long (max 50 caractères)'),
});

// Validation pour la mise à jour de clinique
export const updateClinicSchema = createClinicSchema.partial();

// Validation pour la création de vétérinaire
export const createVeterinarianSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Nom trop court (min 2 caractères)')
    .max(100, 'Nom trop long (max 100 caractères)'),
  specialty: z.string()
    .trim()
    .max(100, 'Spécialité trop longue (max 100 caractères)')
    .optional(),
  is_active: z.boolean(),
});

// Validation pour les types de consultation
export const consultationTypeSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Nom trop court (min 2 caractères)')
    .max(100, 'Nom trop long (max 100 caractères)'),
  duration_minutes: z.number()
    .int('Durée doit être un nombre entier')
    .min(5, 'Durée minimale : 5 minutes')
    .max(480, 'Durée maximale : 480 minutes (8 heures)'),
  description: z.string()
    .max(500, 'Description trop longue (max 500 caractères)')
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide (format #RRGGBB)')
    .optional(),
});

// Validation pour création de clinique admin
export const adminCreateClinicSchema = z.object({
  clinicName: z.string()
    .trim()
    .min(2, 'Nom de clinique trop court')
    .max(100, 'Nom de clinique trop long'),
  userEmail: z.string()
    .trim()
    .email('Email invalide')
    .max(255, 'Email trop long'),
  userName: z.string()
    .trim()
    .min(2, 'Nom utilisateur trop court')
    .max(100, 'Nom utilisateur trop long'),
  customSlug: z.string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug invalide')
    .min(3, 'Slug trop court')
    .max(50, 'Slug trop long')
    .optional(),
});

// Validation pour email logs
export const emailLogSchema = z.object({
  booking_id: z.string().uuid('ID booking invalide').optional(),
  recipient_email: z.string().email('Email destinataire invalide').max(255),
  email_type: z.enum(['confirmation', 'cancellation', 'reminder']),
  status: z.enum(['pending', 'sent', 'failed']),
  error_message: z.string().max(1000).optional(),
});
