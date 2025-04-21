interface NotesSectionProps {
  notes?: string;
  terms?: string;
}

export function NotesSection({ notes, terms }: NotesSectionProps) {
  if (!notes && !terms) return null;
  
  return (
    <div className="w-1/2">
      <div className="mt-8">
        {notes && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Notes:</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{notes}</p>
          </div>
        )}
        {terms && (
          <div>
            <h3 className="font-medium mb-2">Terms:</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{terms}</p>
          </div>
        )}
      </div>
    </div>
  );
}