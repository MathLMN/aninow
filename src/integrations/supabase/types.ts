export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
          appointment_time: string | null
          client_comment: string | null
          client_email: string
          client_name: string
          client_phone: string
          conditional_answers: Json | null
          consultation_reason: string
          convenience_options: string[] | null
          created_at: string
          custom_species: string | null
          custom_symptom: string | null
          custom_text: string | null
          id: string
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
          appointment_time?: string | null
          client_comment?: string | null
          client_email: string
          client_name: string
          client_phone: string
          conditional_answers?: Json | null
          consultation_reason: string
          convenience_options?: string[] | null
          created_at?: string
          custom_species?: string | null
          custom_symptom?: string | null
          custom_text?: string | null
          id?: string
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
          appointment_time?: string | null
          client_comment?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string
          conditional_answers?: Json | null
          consultation_reason?: string
          convenience_options?: string[] | null
          created_at?: string
          custom_species?: string | null
          custom_symptom?: string | null
          custom_text?: string | null
          id?: string
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
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
