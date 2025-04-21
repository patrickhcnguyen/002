import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CustomField } from "@/types/customFields";

interface CustomFieldPreviewProps {
  field: CustomField;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function CustomFieldPreview({ field, onDelete, onToggle }: CustomFieldPreviewProps) {
  const renderFieldPreview = () => {
    switch (field.type) {
      case "text":
        return <Input type="text" placeholder={`Enter ${field.label}`} disabled />;
      case "textarea":
        return <Textarea placeholder={`Enter ${field.label}`} disabled />;
      case "number":
        return <Input type="number" placeholder={`Enter ${field.label}`} disabled />;
      case "dropdown":
      case "select":
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "multiselect":
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select options" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "file":
        return <Input type="file" disabled />;
      case "address":
        return (
          <div className="space-y-2">
            <Input placeholder="Street Address" disabled />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" disabled />
              <Input placeholder="State" disabled />
            </div>
            <Input placeholder="ZIP Code" disabled />
          </div>
        );
      default:
        return <Input type={field.type} placeholder={`Enter ${field.label}`} disabled />;
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{field.label}</h4>
          <p className="text-sm text-muted-foreground">Type: {field.type}</p>
          {(field.type === "dropdown" || field.type === "multiselect" || field.type === "select") && (
            <p className="text-sm text-muted-foreground">
              Options: {field.options?.join(", ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={field.enabled}
            onCheckedChange={() => onToggle(field.id)}
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(field.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>{renderFieldPreview()}</div>
    </div>
  );
}