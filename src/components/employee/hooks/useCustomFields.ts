import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustomField, FieldType } from '@/types/customFields';

export function useCustomFields() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const { data: customFieldConfigs, error } = await supabase
          .from('custom_field_configs')
          .select('*')
          .eq('enabled', true);

        if (error) throw error;

        const fields: CustomField[] = customFieldConfigs.map(config => ({
          id: config.field_id,
          label: config.label,
          type: config.type as FieldType,
          enabled: config.enabled,
          required: config.required,
          options: config.options as string[],
        }));

        setCustomFields(fields);
      } catch (err) {
        console.error('Error fetching custom fields:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomFields();
  }, []);

  return { customFields, isLoading, error };
}