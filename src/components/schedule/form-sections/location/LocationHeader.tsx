
import React from 'react';
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export function LocationHeader() {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Label>Location</Label>
    </div>
  );
}
