import { useState } from "react";
import { CustomFieldForm } from "@/components/settings/CustomFieldForm";
import { CustomFieldPreview } from "@/components/settings/CustomFieldPreview";
import { toast } from "sonner";
import { CustomField, FieldType } from "@/types/customFields";

export function RecruitSettingsContent() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType>("text");
  const [newOption, setNewOption] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) {
      toast.error("Please enter a field label");
      return;
    }

    if ((selectedFieldType === "dropdown" || selectedFieldType === "select") && dropdownOptions.length === 0) {
      toast.error("Please add at least one option for the dropdown");
      return;
    }

    const newField: CustomField = {
      id: crypto.randomUUID(),
      label: newFieldLabel,
      type: selectedFieldType,
      enabled: true,
      ...(selectedFieldType === "dropdown" || selectedFieldType === "select" ? { options: dropdownOptions } : {}),
    };

    setCustomFields([...customFields, newField]);
    setNewFieldLabel("");
    setSelectedFieldType("text");
    setDropdownOptions([]);
    toast.success("Custom field added successfully");
  };

  const handleDeleteField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
    toast.success("Field removed successfully");
  };

  const handleToggleField = (id: string) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, enabled: !field.enabled } : field
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recruitment Form Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Add custom fields and questions to your recruitment form
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 space-y-4 bg-card">
          <h4 className="font-medium">Add New Field</h4>
          <CustomFieldForm
            newFieldLabel={newFieldLabel}
            setNewFieldLabel={setNewFieldLabel}
            selectedFieldType={selectedFieldType}
            setSelectedFieldType={setSelectedFieldType}
            newOption={newOption}
            setNewOption={setNewOption}
            dropdownOptions={dropdownOptions}
            setDropdownOptions={setDropdownOptions}
            onFieldAdded={handleAddCustomField}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Custom Fields Preview</h4>
          {customFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No custom fields added yet. Add your first field above.
            </p>
          ) : (
            <div className="space-y-4">
              {customFields.map((field) => (
                <CustomFieldPreview
                  key={field.id}
                  field={field}
                  onDelete={handleDeleteField}
                  onToggle={handleToggleField}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}