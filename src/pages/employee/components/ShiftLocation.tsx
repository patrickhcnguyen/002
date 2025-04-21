
import { MapPin } from "lucide-react";

interface ShiftLocationProps {
  location: string;
}

export function ShiftLocation({ location }: ShiftLocationProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Location</h3>
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
        <span>{location}</span>
      </div>
    </div>
  );
}
