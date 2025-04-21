import { MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationIconProps {
  location: string;
}

export function LocationIcon({ location }: LocationIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Clocked in at: {location}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}