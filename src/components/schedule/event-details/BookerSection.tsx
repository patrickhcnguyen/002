import { FileText, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface BookerSectionProps {
  booker?: string;
  bookerNotes: string;
  onNotesChange: (notes: string) => void;
}

export function BookerSection({ 
  booker = "John Smith", // Default value for demo
  bookerNotes,
  onNotesChange 
}: BookerSectionProps) {
  const handleNotesChange = (newNotes: string) => {
    onNotesChange(newNotes);
    toast.success("Booker notes updated successfully");
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5" />
        <h3 className="text-lg font-medium">Event Booker</h3>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{booker}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Booker Notes</span>
        </div>
        <Textarea
          value={bookerNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Add notes from the booker..."
          className="min-h-[100px] bg-background"
        />
      </div>
    </div>
  );
}