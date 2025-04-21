import { Input } from "@/components/ui/input";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadSectionProps {
  file: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export function FileUploadSection({ file, onFileUpload, onRemoveFile }: FileUploadSectionProps) {
  return (
    <div className="border-2 border-dashed rounded-lg p-12 text-center">
      <Input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={onFileUpload}
        className="hidden"
        id="csv-upload"
      />
      <label
        htmlFor="csv-upload"
        className="cursor-pointer text-primary hover:text-primary/80"
      >
        <div className="flex flex-col items-center gap-2">
          <FileUp className="h-8 w-8" />
          <span>Choose a file</span>
        </div>
      </label>
      <p className="text-sm text-muted-foreground mt-2">
        or drag and drop
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        CSV, XLSX, XLS up to 10MB
      </p>
      {file && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}