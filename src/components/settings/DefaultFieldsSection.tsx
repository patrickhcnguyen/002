import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CustomFieldForm } from "./CustomFieldForm";
import { CustomFieldPreview } from "./CustomFieldPreview";
import { supabase } from "@/integrations/supabase/client";
import { CustomField, FieldType, CustomFieldConfig } from "@/types/customFields";

export function DefaultFieldsSection() {
  const [defaultFields, setDefaultFields] = useState<CustomField[]>([
    // Personal Information
    { id: "firstName", label: "First Name", type: "text" as FieldType, enabled: true, required: true },
    { id: "lastName", label: "Last Name", type: "text" as FieldType, enabled: true, required: true },
    { id: "email", label: "Email", type: "email" as FieldType, enabled: true, required: true },
    { id: "phone", label: "Phone Number", type: "tel" as FieldType, enabled: true, required: true },
    { id: "birthDate", label: "Birth Date", type: "date" as FieldType, enabled: true },
    { id: "gender", label: "Gender", type: "select" as FieldType, enabled: true },
    
    // Employment Information
    { id: "employeeType", label: "Employee Type", type: "select" as FieldType, enabled: true, required: true },
    { id: "employmentStartDate", label: "Employment Start Date", type: "date" as FieldType, enabled: true },
    { id: "employmentEndDate", label: "Employment End Date", type: "date" as FieldType, enabled: true },
    
    // Branch & Position Assignment
    { id: "branches", label: "Branches", type: "multiselect" as FieldType, enabled: true, required: true },
    { id: "positions", label: "Positions", type: "multiselect" as FieldType, enabled: true },
    
    // Payment Information
    { id: "accountNumber", label: "Account Number", type: "text" as FieldType, enabled: true },
    { id: "routingNumber", label: "Routing Number", type: "text" as FieldType, enabled: true },
    
    // Additional Information
    { id: "photos", label: "Photos", type: "file" as FieldType, enabled: true },
    { id: "notes", label: "Additional Notes", type: "textarea" as FieldType, enabled: true },
  ]);

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType>("text");
  const [newOption, setNewOption] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomFields();
  }, []);

  const fetchCustomFields = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('custom_field_configs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedFields: CustomField[] = (data || []).map((field: CustomFieldConfig) => ({
        id: field.id || '',
        label: field.label,
        type: field.type as FieldType,
        options: field.options as string[] || [],
        enabled: field.enabled || false,
        required: field.required || false
      }));

      setCustomFields(formattedFields);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast.error("Failed to load custom fields");
    }
  };

  const toggleField = async (id: string, isCustomField = false) => {
    if (!isCustomField) {
      const field = defaultFields.find(f => f.id === id);
      
      if (field?.required) {
        toast.error("This field cannot be disabled as it is required");
        return;
      }

      setDefaultFields(fields =>
        fields.map(field =>
          field.id === id ? { ...field, enabled: !field.enabled } : field
        )
      );
      toast.success("Field visibility updated");
    } else {
      try {
        const field = customFields.find(f => f.id === id);
        if (!field) return;

        const { error } = await supabase
          .from('custom_field_configs')
          .update({ enabled: !field.enabled })
          .eq('id', id);

        if (error) throw error;

        setCustomFields(fields =>
          fields.map(field =>
            field.id === id ? { ...field, enabled: !field.enabled } : field
          )
        );
        toast.success("Custom field visibility updated");
      } catch (error) {
        console.error('Error updating custom field:', error);
        toast.error("Failed to update custom field");
      }
    }
  };

  const deleteCustomField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_field_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomFields(fields => fields.filter(field => field.id !== id));
      toast.success("Custom field deleted");
    } catch (error) {
      console.error('Error deleting custom field:', error);
      toast.error("Failed to delete custom field");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Configure which fields are visible when viewing or editing employees. Required fields cannot be disabled.
        </p>
      </div>

      <div className="space-y-4">
        {defaultFields.map((field) => (
          <div key={field.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            <Label htmlFor={field.id} className="flex flex-col">
              <span>
                {field.label}
                {field.required && (
                  <span className="ml-2 text-xs text-muted-foreground">(Required)</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                Type: {field.type}
              </span>
            </Label>
            <Switch
              id={field.id}
              checked={field.enabled}
              onCheckedChange={() => toggleField(field.id)}
              disabled={field.required}
            />
          </div>
        ))}

        {customFields.map((field) => (
          <CustomFieldPreview
            key={field.id}
            field={field}
            onDelete={() => deleteCustomField(field.id)}
            onToggle={() => toggleField(field.id, true)}
          />
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Add Custom Field</h3>
        <CustomFieldForm
          newFieldLabel={newFieldLabel}
          setNewFieldLabel={setNewFieldLabel}
          selectedFieldType={selectedFieldType}
          setSelectedFieldType={setSelectedFieldType}
          newOption={newOption}
          setNewOption={setNewOption}
          dropdownOptions={dropdownOptions}
          setDropdownOptions={setDropdownOptions}
          onFieldAdded={fetchCustomFields}
        />
      </div>
    </div>
  );
}