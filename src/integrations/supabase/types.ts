export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_clinic_creations: {
        Row: {
          admin_user_id: string
          clinic_id: string
          clinic_user_id: string
          created_at: string
          first_login_completed: boolean | null
          id: string
          password_changed: boolean | null
          provisional_password: string
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          clinic_id: string
          clinic_user_id: string
          created_at?: string
          first_login_completed?: boolean | null
          id?: string
          password_changed?: boolean | null
          provisional_password: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          clinic_id?: string
          clinic_user_id?: string
          created_at?: string
          first_login_completed?: boolean | null
          id?: string
          password_changed?: boolean | null
          provisional_password?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_clinic_creations_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "admin_clinic_creations_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_analysis_logs: {
        Row: {
          analysis_type: string
          booking_id: string | null
          confidence_score: number
          created_at: string
          id: string
          input_data: Json
          output_data: Json
          processing_time_ms: number
        }
        Insert: {
          analysis_type: string
          booking_id?: string | null
          confidence_score: number
          created_at?: string
          id?: string
          input_data: Json
          output_data: Json
          processing_time_ms: number
        }
        Update: {
          analysis_type?: string
          booking_id?: string | null
          confidence_score?: number
          created_at?: string
          id?: string
          input_data?: Json
          output_data?: Json
          processing_time_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      available_slots: {
        Row: {
          booking_id: string | null
          clinic_id: string | null
          consultation_type_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          is_booked: boolean | null
          start_time: string
          updated_at: string
          veterinarian_id: string
        }
        Insert: {
          booking_id?: string | null
          clinic_id?: string | null
          consultation_type_id: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_booked?: boolean | null
          start_time: string
          updated_at?: string
          veterinarian_id: string
        }
        Update: {
          booking_id?: string | null
          clinic_id?: string | null
          consultation_type_id?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_booked?: boolean | null
          start_time?: string
          updated_at?: string
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "available_slots_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "available_slots_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "available_slots_consultation_type_id_fkey"
            columns: ["consultation_type_id"]
            isOneToOne: false
            referencedRelation: "consultation_types"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          additional_points: string[] | null
          ai_analysis: Json | null
          animal_age: string | null
          animal_breed: string | null
          animal_name: string
          animal_sex: string | null
          animal_species: string
          animal_sterilized: boolean | null
          animal_vaccines_up_to_date: boolean | null
          animal_weight: number | null
          appointment_date: string | null
          appointment_end_time: string | null
          appointment_time: string | null
          client_comment: string | null
          client_email: string
          client_name: string
          client_phone: string
          clinic_id: string
          conditional_answers: Json | null
          consultation_reason: string
          consultation_type_id: string | null
          convenience_options: string[] | null
          created_at: string
          custom_species: string | null
          custom_symptom: string | null
          custom_text: string | null
          duration_minutes: number | null
          id: string
          is_blocked: boolean | null
          multiple_animals: string[] | null
          preferred_contact_method: string
          recommended_actions: string[] | null
          second_animal_age: string | null
          second_animal_breed: string | null
          second_animal_consultation_reason: string | null
          second_animal_convenience_options: string[] | null
          second_animal_custom_symptom: string | null
          second_animal_custom_text: string | null
          second_animal_different_reason: boolean | null
          second_animal_name: string | null
          second_animal_selected_symptoms: string[] | null
          second_animal_sex: string | null
          second_animal_species: string | null
          second_animal_sterilized: boolean | null
          second_animal_vaccines_up_to_date: boolean | null
          second_animal_weight: number | null
          second_custom_species: string | null
          selected_symptoms: string[] | null
          status: string | null
          symptom_duration: string | null
          updated_at: string
          urgency_score: number | null
          vaccination_type: string | null
          veterinarian_id: string | null
        }
        Insert: {
          additional_points?: string[] | null
          ai_analysis?: Json | null
          animal_age?: string | null
          animal_breed?: string | null
          animal_name: string
          animal_sex?: string | null
          animal_species: string
          animal_sterilized?: boolean | null
          animal_vaccines_up_to_date?: boolean | null
          animal_weight?: number | null
          appointment_date?: string | null
          appointment_end_time?: string | null
          appointment_time?: string | null
          client_comment?: string | null
          client_email: string
          client_name: string
          client_phone: string
          clinic_id: string
          conditional_answers?: Json | null
          consultation_reason: string
          consultation_type_id?: string | null
          convenience_options?: string[] | null
          created_at?: string
          custom_species?: string | null
          custom_symptom?: string | null
          custom_text?: string | null
          duration_minutes?: number | null
          id?: string
          is_blocked?: boolean | null
          multiple_animals?: string[] | null
          preferred_contact_method: string
          recommended_actions?: string[] | null
          second_animal_age?: string | null
          second_animal_breed?: string | null
          second_animal_consultation_reason?: string | null
          second_animal_convenience_options?: string[] | null
          second_animal_custom_symptom?: string | null
          second_animal_custom_text?: string | null
          second_animal_different_reason?: boolean | null
          second_animal_name?: string | null
          second_animal_selected_symptoms?: string[] | null
          second_animal_sex?: string | null
          second_animal_species?: string | null
          second_animal_sterilized?: boolean | null
          second_animal_vaccines_up_to_date?: boolean | null
          second_animal_weight?: number | null
          second_custom_species?: string | null
          selected_symptoms?: string[] | null
          status?: string | null
          symptom_duration?: string | null
          updated_at?: string
          urgency_score?: number | null
          vaccination_type?: string | null
          veterinarian_id?: string | null
        }
        Update: {
          additional_points?: string[] | null
          ai_analysis?: Json | null
          animal_age?: string | null
          animal_breed?: string | null
          animal_name?: string
          animal_sex?: string | null
          animal_species?: string
          animal_sterilized?: boolean | null
          animal_vaccines_up_to_date?: boolean | null
          animal_weight?: number | null
          appointment_date?: string | null
          appointment_end_time?: string | null
          appointment_time?: string | null
          client_comment?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string
          clinic_id?: string
          conditional_answers?: Json | null
          consultation_reason?: string
          consultation_type_id?: string | null
          convenience_options?: string[] | null
          created_at?: string
          custom_species?: string | null
          custom_symptom?: string | null
          custom_text?: string | null
          duration_minutes?: number | null
          id?: string
          is_blocked?: boolean | null
          multiple_animals?: string[] | null
          preferred_contact_method?: string
          recommended_actions?: string[] | null
          second_animal_age?: string | null
          second_animal_breed?: string | null
          second_animal_consultation_reason?: string | null
          second_animal_convenience_options?: string[] | null
          second_animal_custom_symptom?: string | null
          second_animal_custom_text?: string | null
          second_animal_different_reason?: boolean | null
          second_animal_name?: string | null
          second_animal_selected_symptoms?: string[] | null
          second_animal_sex?: string | null
          second_animal_species?: string | null
          second_animal_sterilized?: boolean | null
          second_animal_vaccines_up_to_date?: boolean | null
          second_animal_weight?: number | null
          second_custom_species?: string | null
          selected_symptoms?: string[] | null
          status?: string | null
          symptom_duration?: string | null
          updated_at?: string
          urgency_score?: number | null
          vaccination_type?: string | null
          veterinarian_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_consultation_type_id_fkey"
            columns: ["consultation_type_id"]
            isOneToOne: false
            referencedRelation: "consultation_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "clinic_veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_settings: {
        Row: {
          asv_enabled: boolean
          clinic_address_city: string | null
          clinic_address_country: string | null
          clinic_address_postal_code: string | null
          clinic_address_street: string | null
          clinic_email: string | null
          clinic_id: string | null
          clinic_name: string
          clinic_phone: string | null
          created_at: string
          daily_schedules: Json | null
          default_slot_duration_minutes: number
          id: string
          updated_at: string
        }
        Insert: {
          asv_enabled?: boolean
          clinic_address_city?: string | null
          clinic_address_country?: string | null
          clinic_address_postal_code?: string | null
          clinic_address_street?: string | null
          clinic_email?: string | null
          clinic_id?: string | null
          clinic_name?: string
          clinic_phone?: string | null
          created_at?: string
          daily_schedules?: Json | null
          default_slot_duration_minutes?: number
          id?: string
          updated_at?: string
        }
        Update: {
          asv_enabled?: boolean
          clinic_address_city?: string | null
          clinic_address_country?: string | null
          clinic_address_postal_code?: string | null
          clinic_address_street?: string | null
          clinic_email?: string | null
          clinic_id?: string | null
          clinic_name?: string
          clinic_phone?: string | null
          created_at?: string
          daily_schedules?: Json | null
          default_slot_duration_minutes?: number
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_settings_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_veterinarians: {
        Row: {
          auth_migration_status: string | null
          clinic_id: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          specialty: string | null
          updated_at: string
        }
        Insert: {
          auth_migration_status?: string | null
          clinic_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          auth_migration_status?: string | null
          clinic_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          specialty?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_veterinarians_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      consultation_types: {
        Row: {
          clinic_id: string | null
          color: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          name: string
        }
        Insert: {
          clinic_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          name: string
        }
        Update: {
          clinic_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_types_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_performance_logs: {
        Row: {
          booking_id: string | null
          cost_cents: number | null
          created_at: string
          id: string
          processing_time_ms: number
          prompt_used: string
          response_quality_score: number | null
          template_id: string | null
          tokens_used: number | null
        }
        Insert: {
          booking_id?: string | null
          cost_cents?: number | null
          created_at?: string
          id?: string
          processing_time_ms: number
          prompt_used: string
          response_quality_score?: number | null
          template_id?: string | null
          tokens_used?: number | null
        }
        Update: {
          booking_id?: string | null
          cost_cents?: number | null
          created_at?: string
          id?: string
          processing_time_ms?: number
          prompt_used?: string
          response_quality_score?: number | null
          template_id?: string | null
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_performance_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_performance_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_rules: {
        Row: {
          conditions: Json
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          template_id: string | null
        }
        Insert: {
          conditions: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          template_id?: string | null
        }
        Update: {
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          system_prompt: string
          updated_at: string
          user_prompt_template: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          system_prompt: string
          updated_at?: string
          user_prompt_template: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          system_prompt?: string
          updated_at?: string
          user_prompt_template?: string
          variables?: Json | null
        }
        Relationships: []
      }
      slot_assignments: {
        Row: {
          assignment_type: string
          clinic_id: string | null
          created_at: string
          date: string
          id: string
          time_slot: string
          updated_at: string
          veterinarian_id: string
        }
        Insert: {
          assignment_type?: string
          clinic_id?: string | null
          created_at?: string
          date: string
          id?: string
          time_slot: string
          updated_at?: string
          veterinarian_id: string
        }
        Update: {
          assignment_type?: string
          clinic_id?: string | null
          created_at?: string
          date?: string
          id?: string
          time_slot?: string
          updated_at?: string
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slot_assignments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slot_assignments_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "clinic_veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      user_clinic_access: {
        Row: {
          clinic_id: string
          created_at: string
          created_by_admin: string | null
          id: string
          is_active: boolean
          provisional_password_set: boolean | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          created_by_admin?: string | null
          id?: string
          is_active?: boolean
          provisional_password_set?: boolean | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          created_by_admin?: string | null
          id?: string
          is_active?: boolean
          provisional_password_set?: boolean | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_clinic_access_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarian_absences: {
        Row: {
          absence_type: string
          clinic_id: string | null
          created_at: string
          end_date: string
          id: string
          is_recurring: boolean
          reason: string | null
          start_date: string
          updated_at: string
          veterinarian_id: string
        }
        Insert: {
          absence_type?: string
          clinic_id?: string | null
          created_at?: string
          end_date: string
          id?: string
          is_recurring?: boolean
          reason?: string | null
          start_date: string
          updated_at?: string
          veterinarian_id: string
        }
        Update: {
          absence_type?: string
          clinic_id?: string | null
          created_at?: string
          end_date?: string
          id?: string
          is_recurring?: boolean
          reason?: string | null
          start_date?: string
          updated_at?: string
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "veterinarian_absences_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinarian_absences_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "clinic_veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarian_schedules: {
        Row: {
          afternoon_end: string | null
          afternoon_start: string | null
          clinic_id: string | null
          created_at: string
          day_of_week: number
          id: string
          is_working: boolean
          morning_end: string | null
          morning_start: string | null
          updated_at: string
          veterinarian_id: string
        }
        Insert: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          clinic_id?: string | null
          created_at?: string
          day_of_week: number
          id?: string
          is_working?: boolean
          morning_end?: string | null
          morning_start?: string | null
          updated_at?: string
          veterinarian_id: string
        }
        Update: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          clinic_id?: string | null
          created_at?: string
          day_of_week?: number
          id?: string
          is_working?: boolean
          morning_end?: string | null
          morning_start?: string | null
          updated_at?: string
          veterinarian_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "veterinarian_schedules_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinarian_schedules_veterinarian_id_fkey"
            columns: ["veterinarian_id"]
            isOneToOne: false
            referencedRelation: "clinic_veterinarians"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_clinic_by_slug: {
        Args: { clinic_slug: string }
        Returns: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }[]
      }
      get_clinic_veterinarians_for_booking: {
        Args: { clinic_slug: string }
        Returns: {
          id: string
          is_active: boolean
          name: string
        }[]
      }
      get_user_clinic_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
