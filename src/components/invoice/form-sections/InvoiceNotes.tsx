import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceNotesProps {
  notes: string;
  terms: string;
  onNotesChange: (value: string) => void;
  onTermsChange: (value: string) => void;
}

export function InvoiceNotes({ notes, terms, onNotesChange, onTermsChange }: InvoiceNotesProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Notes</Label>
        <Textarea
          placeholder="Notes - any relevant information not already covered"
          className="h-32"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
      <div>
        <Label>Terms</Label>
        <Textarea
          className="h-64"
          value={terms}
          onChange={(e) => onTermsChange(e.target.value)}
        />
      </div>
    </div>
  );
}