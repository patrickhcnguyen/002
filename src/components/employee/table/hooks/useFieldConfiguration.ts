import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_VISIBLE_FIELDS = [
  "name",
  "email",
  "createdAt",
  "positions",
  "lastActivity",
  "downloadedApp",
  "branches"
];

export function useFieldConfiguration() {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Fetch custom fields
  const { data: customFields } = useQuery({
    queryKey: ['customFieldsConfig'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No user session found');
      }

      const { data, error } = await supabase
        .from('custom_field_configs')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('enabled', true);

      if (error) {
        console.error('Error fetching custom fields:', error);
        return [];
      }

      console.log('Fetched custom fields:', data);
      return data;
    }
  });

  // Fetch table configuration
  const { data: tableConfig, isLoading } = useQuery({
    queryKey: ['tableConfiguration'],
    queryFn: async () => {
      console.log('Fetching table configuration...');
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No user session found');
      }

      const { data, error } = await supabase
        .from('table_configurations')
        .select('*')
        .eq('table_name', 'employees')
        .eq('user_id', session.session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching table configuration:', error);
        throw error;
      }

      console.log('Fetched table configuration:', data);
      return data;
    }
  });

  // Update configuration mutation
  const updateConfig = useMutation({
    mutationFn: async (fields: string[]) => {
      console.log('Updating table configuration with fields:', fields);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('No user session found');
      }

      const updateData = {
        user_id: session.session.user.id,
        table_name: 'employees',
        visible_fields: fields,
        updated_at: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      const { data, error } = await supabase
        .from('table_configurations')
        .upsert(updateData, {
          onConflict: 'user_id,table_name'
        });

      if (error) {
        console.error('Error updating table configuration:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableConfiguration'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  // Set initial fields when configuration is loaded
  useEffect(() => {
    if (tableConfig) {
      console.log('Setting selected fields from config:', tableConfig.visible_fields);
      setSelectedFields(tableConfig.visible_fields);
    } else if (!isLoading) {
      console.log('Setting default selected fields');
      setSelectedFields(DEFAULT_VISIBLE_FIELDS);
    }
  }, [tableConfig, isLoading]);

  // Get all available fields including custom fields
  const allFields = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "createdAt", label: "Created At" },
    { id: "department", label: "Department" },
    { id: "positions", label: "Positions" },
    { id: "lastActivity", label: "Last Activity" },
    { id: "downloadedApp", label: "Downloaded App" },
    { id: "branches", label: "Branches" },
    { id: "status", label: "Status" },
    // Add custom fields to the available fields
    ...(customFields?.map(field => ({
      id: field.field_id,
      label: field.label
    })) || [])
  ];

  return {
    selectedFields,
    setSelectedFields,
    allFields,
    isLoading,
    updateConfig,
    DEFAULT_VISIBLE_FIELDS
  };
}