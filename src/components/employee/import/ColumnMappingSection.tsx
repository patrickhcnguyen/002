import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ColumnMappingProps {
  csvColumns: string[];
  columnMapping: Record<string, string>;
  onColumnMap: (csvColumn: string, evershiftField: string) => void;
}

const EVERSHIFT_FIELDS = [
  { value: "firstName", label: "First Name", required: true },
  { value: "lastName", label: "Last Name", required: true },
  { value: "email", label: "Email", required: true },
  { value: "phone", label: "Phone Number" },
  { value: "birthDate", label: "Birth Date" },
  { value: "gender", label: "Gender" },
  { value: "notes", label: "Notes" },
  { value: "department", label: "Department" },
  { value: "employmentStartDate", label: "Employment Start Date" },
  { value: "employmentEndDate", label: "Employment End Date" },
  { value: "employeeType", label: "Employee Type" }
];

export function ColumnMappingSection({ csvColumns, columnMapping, onColumnMap }: ColumnMappingProps) {
  const [isCreatingField, setIsCreatingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<string>("text");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const handleCreateField = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("You must be logged in to create custom fields");
        return;
      }

      const fieldId = newFieldLabel.toLowerCase().replace(/\s+/g, '_');
      
      const { error } = await supabase
        .from('custom_field_configs')
        .insert({
          user_id: session.session.user.id,
          field_id: fieldId,
          label: newFieldLabel,
          type: newFieldType,
          options: newFieldType === 'select' ? options : null,
          enabled: true,
          required: false
        });

      if (error) throw error;

      toast.success("Custom field created successfully");
      onColumnMap(selectedColumn, fieldId);
      setIsCreatingField(false);
      setNewFieldLabel("");
      setNewFieldType("text");
      setOptions([]);
    } catch (error) {
      console.error('Error creating custom field:', error);
      toast.error("Failed to create custom field");
    }
  };

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter(option => option !== optionToRemove));
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium mb-4">Map Your Spreadsheet Columns to Employee Fields</h4>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-muted-foreground mb-4">Your Spreadsheet Columns</h5>
          {csvColumns.map((column) => (
            <div key={column} className="py-2 px-3 bg-accent/10 rounded-md">
              {column}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-muted-foreground mb-4">Map to Employee Fields</h5>
          {csvColumns.map((column) => (
            <div key={column} className="flex gap-2">
              <Select
                value={columnMapping[column]}
                onValueChange={(value) => {
                  if (value === "create_custom_field") {
                    setSelectedColumn(column);
                    setIsCreatingField(true);
                  } else {
                    onColumnMap(column, value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="do_not_import">Do not import</SelectItem>
                  <SelectItem value="create_custom_field" className="text-primary">
                    Create Custom Field
                  </SelectItem>
                  <SelectItem value="separator" disabled className="border-b" />
                  {EVERSHIFT_FIELDS.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isCreatingField} onOpenChange={setIsCreatingField}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Field Label</Label>
              <Input
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="Enter field label"
              />
            </div>
            <div>
              <Label>Field Type</Label>
              <RadioGroup value={newFieldType} onValueChange={setNewFieldType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="textarea" id="textarea" />
                  <Label htmlFor="textarea">Text Area</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="select" id="select" />
                  <Label htmlFor="select">Select</Label>
                </div>
              </RadioGroup>
            </div>

            {newFieldType === 'select' && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add option"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                  />
                  <Button onClick={addOption} type="button">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-1 bg-accent/10 rounded-full px-3 py-1"
                    >
                      <span>{option}</span>
                      <button
                        onClick={() => removeOption(option)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreatingField(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateField}>
                Create Field
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
