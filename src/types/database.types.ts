export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          animal_species: string
          animal_name: string
          custom_species?: string
          multiple_animals: string[]
          second_animal_species?: string
          second_animal_name?: string
          second_custom_species?: string
          vaccination_type?: string
          consultation_reason: string
          convenience_options: string[]
          custom_text?: string
          selected_symptoms: string[]
          custom_symptom?: string
          second_animal_different_reason?: boolean
          second_animal_consultation_reason?: string
          second_animal_convenience_options?: string[]
          second_animal_custom_text?: string
          second_animal_selected_symptoms?: string[]
          second_animal_custom_symptom?: string
          conditional_answers?: Record<string, any>
          symptom_duration?: string
          additional_points?: string[]
          animal_age?: string
          animal_breed?: string
          animal_weight?: number
          animal_sex?: string
          animal_sterilized?: boolean
          animal_vaccines_up_to_date?: boolean
          second_animal_age?: string
          second_animal_breed?: string
          second_animal_weight?: number
          second_animal_sex?: string
          second_animal_sterilized?: boolean
          second_animal_vaccines_up_to_date?: boolean
          client_comment?: string
          client_name: string
          client_email: string
          client_phone: string
          preferred_contact_method: string
          appointment_date?: string
          appointment_time?: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          ai_analysis?: Record<string, any>
          urgency_score?: number
          recommended_actions?: string[]
          veterinarian_id?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          animal_species: string
          animal_name: string
          custom_species?: string
          multiple_animals?: string[]
          second_animal_species?: string
          second_animal_name?: string
          second_custom_species?: string
          vaccination_type?: string
          consultation_reason: string
          convenience_options?: string[]
          custom_text?: string
          selected_symptoms?: string[]
          custom_symptom?: string
          second_animal_different_reason?: boolean
          second_animal_consultation_reason?: string
          second_animal_convenience_options?: string[]
          second_animal_custom_text?: string
          second_animal_selected_symptoms?: string[]
          second_animal_custom_symptom?: string
          conditional_answers?: Record<string, any>
          symptom_duration?: string
          additional_points?: string[]
          animal_age?: string
          animal_breed?: string
          animal_weight?: number
          animal_sex?: string
          animal_sterilized?: boolean
          animal_vaccines_up_to_date?: boolean
          second_animal_age?: string
          second_animal_breed?: string
          second_animal_weight?: number
          second_animal_sex?: string
          second_animal_sterilized?: boolean
          second_animal_vaccines_up_to_date?: boolean
          client_comment?: string
          client_name: string
          client_email: string
          client_phone: string
          preferred_contact_method: string
          appointment_date?: string
          appointment_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          ai_analysis?: Record<string, any>
          urgency_score?: number
          recommended_actions?: string[]
          veterinarian_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          animal_species?: string
          animal_name?: string
          custom_species?: string
          multiple_animals?: string[]
          second_animal_species?: string
          second_animal_name?: string
          second_custom_species?: string
          vaccination_type?: string
          consultation_reason?: string
          convenience_options?: string[]
          custom_text?: string
          selected_symptoms?: string[]
          custom_symptom?: string
          second_animal_different_reason?: boolean
          second_animal_consultation_reason?: string
          second_animal_convenience_options?: string[]
          second_animal_custom_text?: string
          second_animal_selected_symptoms?: string[]
          second_animal_custom_symptom?: string
          conditional_answers?: Record<string, any>
          symptom_duration?: string
          additional_points?: string[]
          animal_age?: string
          animal_breed?: string
          animal_weight?: number
          animal_sex?: string
          animal_sterilized?: boolean
          animal_vaccines_up_to_date?: boolean
          second_animal_age?: string
          second_animal_breed?: string
          second_animal_weight?: number
          second_animal_sex?: string
          second_animal_sterilized?: boolean
          second_animal_vaccines_up_to_date?: boolean
          client_comment?: string
          client_name?: string
          client_email?: string
          client_phone?: string
          preferred_contact_method?: string
          appointment_date?: string
          appointment_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          ai_analysis?: Record<string, any>
          urgency_score?: number
          recommended_actions?: string[]
          veterinarian_id?: string
        }
      }
      ai_analysis_logs: {
        Row: {
          id: string
          booking_id: string
          analysis_type: string
          input_data: Record<string, any>
          output_data: Record<string, any>
          confidence_score: number
          processing_time_ms: number
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          analysis_type: string
          input_data: Record<string, any>
          output_data: Record<string, any>
          confidence_score: number
          processing_time_ms: number
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          analysis_type?: string
          input_data?: Record<string, any>
          output_data?: Record<string, any>
          confidence_score?: number
          processing_time_ms?: number
          created_at?: string
        }
      }
      clinic_veterinarians: {
        Row: {
          id: string
          name: string
          specialty?: string
          is_active: boolean
          created_at: string
          updated_at: string
          auth_migration_status: 'legacy' | 'migrated'
          email?: string
        }
        Insert: {
          id?: string
          name: string
          specialty?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          auth_migration_status?: 'legacy' | 'migrated'
          email?: string
        }
        Update: {
          id?: string
          name?: string
          specialty?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          auth_migration_status?: 'legacy' | 'migrated'
          email?: string
        }
      }
      veterinarian_auth_users: {
        Row: {
          id: string
          user_id: string
          veterinarian_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          veterinarian_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          veterinarian_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          email: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_booking_with_ai: {
        Args: {
          booking_data: Record<string, any>
        }
        Returns: {
          urgency_score: number
          recommended_actions: string[]
          analysis_summary: string
          confidence_score: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
