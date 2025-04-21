
interface ShiftNotesProps {
  notes?: string | null;
  thingsToKnow?: string | null;
}

export function ShiftNotes({ notes, thingsToKnow }: ShiftNotesProps) {
  if (!notes && !thingsToKnow) return null;
  
  return (
    <>
      {notes && (
        <div>
          <h3 className="font-medium mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{notes}</p>
        </div>
      )}

      {thingsToKnow && (
        <div>
          <h3 className="font-medium mb-2">Things to know</h3>
          <p className="text-sm text-muted-foreground">{thingsToKnow}</p>
        </div>
      )}
    </>
  );
}
