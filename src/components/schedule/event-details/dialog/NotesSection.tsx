import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface NotesSectionProps {
  shiftNotes: string;
  onNotesChange: (notes: string) => void;
}

export function NotesSection({ shiftNotes, onNotesChange }: NotesSectionProps) {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5" />
        <h3 className="text-lg font-medium">Shift Notes</h3>
      </div>
      <Textarea
        value={shiftNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add notes about the shift..."
        className="min-h-[100px] bg-background"
      />
    </div>
  );
}