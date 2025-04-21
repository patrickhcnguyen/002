import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FieldType, CustomFieldConfig } from "@/types/customFields";

interface CustomFieldFormProps {
  newFieldLabel: string;
  setNewFieldLabel: (value: string) => void;
  selectedFieldType: FieldType;
  setSelectedFieldType: (value: FieldType) => void;
  newOption: string;
  setNewOption: (value: string) => void;
  dropdownOptions: string[];
  setDropdownOptions: (options: string[]) => void;
  onFieldAdded: () => void;
}

export function CustomFieldForm({
  newFieldLabel,
  setNewFieldLabel,
  selectedFieldType,
  setSelectedFieldType,
  newOption,
  setNewOption,
  dropdownOptions,
  setDropdownOptions,
  onFieldAdded,
}: CustomFieldFormProps) {
  const addOption = () => {
    if (!newOption.trim()) {
      toast.error("Please enter an option");
      return;
    }

    setDropdownOptions([...dropdownOptions, newOption.trim()]);
    setNewOption("");
  };

  const removeOption = (optionToRemove: string) => {
    setDropdownOptions(dropdownOptions.filter(option => option !== optionToRemove));
  };

  const addCustomField = async () => {
    if (!newFieldLabel.trim()) {
      toast.error("Please enter a field label");
      return;
    }

    if ((selectedFieldType === "dropdown" || selectedFieldType === "multiselect") && dropdownOptions.length === 0) {
      toast.error("Please add at least one option");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add custom fields");
        return;
      }

      const fieldId = newFieldLabel.toLowerCase().replace(/\s+/g, '_');
      
      const newField: CustomFieldConfig = {
        user_id: user.id,
        field_id: fieldId,
        label: newFieldLabel,
        type: selectedFieldType,
        options: selectedFieldType === "dropdown" || selectedFieldType === "multiselect" ? dropdownOptions : null,
        enabled: true,
        required: false
      };

      const { error } = await supabase
        .from('custom_field_configs')
        .insert(newField);

      if (error) throw error;

      toast.success("Custom field added successfully");
      onFieldAdded();
    } catch (error) {
      console.error('Error adding custom field:', error);
      toast.error("Failed to add custom field");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Input
            placeholder="Field Label"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <Select
            value={selectedFieldType}
            onValueChange={(value) => setSelectedFieldType(value as FieldType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Field Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Field</SelectItem>
              <SelectItem value="textarea">Text Area</SelectItem>
              <SelectItem value="dropdown">Dropdown</SelectItem>
              <SelectItem value="multiselect">Multi Select</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="file">File Upload</SelectItem>
              <SelectItem value="address">Address</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="tel">Phone</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(selectedFieldType === "dropdown" || selectedFieldType === "multiselect") && (
        <div className="space-y-4 border rounded-lg p-4 bg-accent/50">
          <h4 className="font-medium">Options</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Add option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOption();
                }
              }}
            />
            <Button onClick={addOption} type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {dropdownOptions.map((option) => (
              <div
                key={option}
                className="flex items-center gap-1 bg-background rounded-full px-3 py-1"
              >
                <span>{option}</span>
                <button
                  onClick={() => removeOption(option)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={addCustomField} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>
    </div>
  );
}