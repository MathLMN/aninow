
export interface Veterinarian {
  id: string;
  name: string;
  specialty?: string;
  is_active: boolean;
  clinic_id: string;
  created_at: string;
  updated_at: string;
  auth_migration_status?: string;
  email?: string;
}
