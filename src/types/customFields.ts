import { Json } from "@/integrations/supabase/types";

export type FieldType = 
  | "text" 
  | "textarea" 
  | "dropdown" 
  | "multiselect" 
  | "number" 
  | "file" 
  | "address"
  | "email"
  | "tel"
  | "date"
  | "select";

export interface CustomField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  enabled: boolean;
  required?: boolean;
}

export interface CustomFieldConfig {
  id?: string;
  user_id: string;
  field_id: string;
  label: string;
  type: string;
  options?: Json;
  enabled?: boolean;
  required?: boolean;
  created_at?: string;
  updated_at?: string;
}