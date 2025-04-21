import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { toast } from "sonner";

export function TimeFormatSection() {
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h");

  const handleFormatChange = (value: "12h" | "24h") => {
    setTimeFormat(value);
    // In a real app, this would be persisted to a backend
    toast.success(`Time format updated to ${value === "24h" ? "24-hour" : "12-hour"}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Time Format</h3>
        <p className="text-sm text-muted-foreground">
          Choose how times are displayed throughout the schedule
        </p>
      </div>

      <RadioGroup
        value={timeFormat}
        onValueChange={handleFormatChange}
        className="grid gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="24h" id="24h" />
          <Label htmlFor="24h">24-hour (e.g., 13:00)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="12h" id="12h" />
          <Label htmlFor="12h">12-hour (e.g., 1:00 PM)</Label>
        </div>
      </RadioGroup>
    </div>
  );
}