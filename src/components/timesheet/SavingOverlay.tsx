
import { Loader2 } from "lucide-react";

export function SavingOverlay() {
  return (
    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Saving changes...</span>
      </div>
    </div>
  );
}
