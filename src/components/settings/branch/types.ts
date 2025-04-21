import { Json } from "@/integrations/supabase/types";

export interface Branch {
  id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  user_id?: string;
  locations: Location[];
}

export interface Location {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Position {
  id: string;
  branch_id: string;
  title: string;
  pay_rate: number;
  charge_rate: number;
  notes?: string;
  created_at: string;
}

// Helper function to convert Location array to Json
export const locationToJson = (locations: Location[]): Json => {
  return locations.map(loc => ({
    name: loc.name,
    address: loc.address,
    coordinates: loc.coordinates
  })) as unknown as Json;
};

// Helper function to convert Json to Location array
export const jsonToLocation = (json: Json): Location[] => {
  if (!Array.isArray(json)) return [];
  return json.map(loc => {
    if (typeof loc === 'object' && loc !== null && 'name' in loc && 'address' in loc) {
      return {
        name: String(loc.name || ''),
        address: String(loc.address || ''),
        coordinates: loc.coordinates as { lat: number; lng: number } | undefined
      };
    }
    return { name: '', address: '' };
  });
};