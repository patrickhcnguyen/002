import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ImportSummaryProps {
  totalEmployees: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}

export function ImportSummary({ 
  totalEmployees, 
  successCount, 
  errorCount, 
  errors 
}: ImportSummaryProps) {
  if (totalEmployees === 0) return null;

  return (
    <div className="space-y-4 mt-4">
      <Alert variant={errorCount > 0 ? "destructive" : "default"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Import Results</AlertTitle>
        <AlertDescription>
          Successfully imported {successCount} out of {totalEmployees} employees.
          {errorCount > 0 && (
            <div className="mt-2">
              <p>Failed to import {errorCount} employees:</p>
              <ul className="list-disc list-inside mt-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}