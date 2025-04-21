import { useState } from "react";
import { FileUploadSection } from "@/components/employee/import/FileUploadSection";
import { ColumnMappingSection } from "@/components/employee/import/ColumnMappingSection";
import { ImportSummary } from "@/components/employee/import/ImportSummary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { extractColumnsFromFile, processFile, processEmployeeData } from "@/components/employee/import/FileProcessor";

export function EmployeeUploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [showMapping, setShowMapping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState({
    totalEmployees: 0,
    successCount: 0,
    errorCount: 0,
    errors: [] as string[]
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isExcel = /\.(xlsx|xls)$/i.test(file.name);
      const isCsv = file.name.endsWith('.csv');
      
      if (!isExcel && !isCsv) {
        toast.error("Please upload a CSV or Excel file");
        return;
      }
      
      if (file.size > 5000000) {
        toast.error("File size too large. Please upload a file under 5MB.");
        return;
      }

      setFile(file);
      try {
        const headers = await extractColumnsFromFile(file);
        setFileColumns(headers);
        initializeColumnMapping(headers);
        toast.success("File selected successfully!");
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error("Error processing file");
      }
    }
  };

  const initializeColumnMapping = (headers: string[]) => {
    const mapping = headers.reduce((acc, header) => {
      acc[header] = "do_not_import";
      return acc;
    }, {} as Record<string, string>);
    setColumnMapping(mapping);
    setShowMapping(true);
  };

  const handleColumnMap = (fileColumn: string, employeeField: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [fileColumn]: employeeField
    }));
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    // Validate that required fields are mapped
    const requiredFields = ["firstName", "lastName", "email"];
    const mappedFields = Object.values(columnMapping);
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));

    if (missingRequired.length > 0) {
      toast.error(`Please map the following required fields: ${missingRequired.join(", ")}`);
      return;
    }

    setIsProcessing(true);
    try {
      const rawData = await processFile(file);
      const importedEmployees = await processEmployeeData(rawData, columnMapping);
      
      setImportResults({
        totalEmployees: rawData.length,
        successCount: importedEmployees.length,
        errorCount: 0,
        errors: []
      });
      
      toast.success(`Successfully imported ${importedEmployees.length} employees`);
      
      // Reset form
      setFile(null);
      setShowMapping(false);
      setFileColumns([]);
      setColumnMapping({});
      
      if (event.target) {
        (event.target as HTMLInputElement).value = '';
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setImportResults(prev => ({
        ...prev,
        errorCount: prev.totalEmployees,
        errors: [(error as Error).message]
      }));
      toast.error('Failed to process employees');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Employee Upload</h3>
        <p className="text-sm text-muted-foreground">
          Upload a CSV or Excel file containing employee information. The file should include columns for name, email, phone, and other relevant details.
        </p>
      </div>

      <FileUploadSection
        file={file}
        onFileUpload={handleFileUpload}
        onRemoveFile={() => {
          setFile(null);
          setShowMapping(false);
          setFileColumns([]);
          setColumnMapping({});
        }}
      />

      {showMapping && fileColumns.length > 0 && (
        <div className="border rounded-lg p-6">
          <ColumnMappingSection 
            csvColumns={fileColumns}
            columnMapping={columnMapping}
            onColumnMap={handleColumnMap}
          />
        </div>
      )}

      <Button 
        onClick={handleImport} 
        disabled={!file || isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Upload and Process"}
      </Button>

      <ImportSummary {...importResults} />
    </div>
  );
}