export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          branch: string
          email: string
          id: string
          role: string | null
          username: string
        }
        Insert: {
          branch: string
          email: string
          id: string
          role?: string | null
          username: string
        }
        Update: {
          branch?: string
          email?: string
          id?: string
          role?: string | null
          username?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          amount_paid: number | null
          balance: number | null
          branch: string
          client_email: string | null
          client_name: string
          company_name: string | null
          discount_type: string | null
          discount_value: number | null
          due_date: string
          event_location: string | null
          id: string
          notes: string | null
          payment_intent_id: string | null
          payment_terms: string | null
          po_edit_counter: number | null
          po_number: string | null
          request_id: number | null
          service_fee: number | null
          ship_to: string | null
          shipping_cost: number | null
          staff_requirements_with_rates: Json | null
          status: string | null
          subtotal: number | null
          transaction_fee: number | null
        }
        Insert: {
          amount: number
          amount_paid?: number | null
          balance?: number | null
          branch: string
          client_email?: string | null
          client_name: string
          company_name?: string | null
          discount_type?: string | null
          discount_value?: number | null
          due_date: string
          event_location?: string | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          payment_terms?: string | null
          po_edit_counter?: number | null
          po_number?: string | null
          request_id?: number | null
          service_fee?: number | null
          ship_to?: string | null
          shipping_cost?: number | null
          staff_requirements_with_rates?: Json | null
          status?: string | null
          subtotal?: number | null
          transaction_fee?: number | null
        }
        Update: {
          amount?: number
          amount_paid?: number | null
          balance?: number | null
          branch?: string
          client_email?: string | null
          client_name?: string
          company_name?: string | null
          discount_type?: string | null
          discount_value?: number | null
          due_date?: string
          event_location?: string | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          payment_terms?: string | null
          po_edit_counter?: number | null
          po_number?: string | null
          request_id?: number | null
          service_fee?: number | null
          ship_to?: string | null
          shipping_cost?: number | null
          staff_requirements_with_rates?: Json | null
          status?: string | null
          subtotal?: number | null
          transaction_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "Requests"
            referencedColumns: ["id"]
          },
        ]
      }
      Requests: {
        Row: {
          closest_branch: string | null
          company_name: string | null
          created_at: string
          email: string | null
          event_date: string | null
          event_location: string | null
          first_name: string | null
          id: number
          is_company: boolean | null
          last_name: string | null
          phone_number: string | null
          staff_requirements: Json | null
          type_of_event: string | null
          type_of_staff: string | null
        }
        Insert: {
          closest_branch?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          event_date?: string | null
          event_location?: string | null
          first_name?: string | null
          id?: number
          is_company?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          staff_requirements?: Json | null
          type_of_event?: string | null
          type_of_staff?: string | null
        }
        Update: {
          closest_branch?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          event_date?: string | null
          event_location?: string | null
          first_name?: string | null
          id?: number
          is_company?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          staff_requirements?: Json | null
          type_of_event?: string | null
          type_of_staff?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
