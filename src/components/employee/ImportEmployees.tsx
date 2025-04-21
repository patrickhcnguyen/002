import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileUploadSection } from "./import/FileUploadSection";
import { ColumnMappingSection } from "./import/ColumnMappingSection";
import * as XLSX from 'xlsx';

interface ImportEmployeesProps {
  onClose: () => void;
}

export function ImportEmployees({ onClose }: ImportEmployeesProps) {
  const [status, setStatus] = useState<'active' | 'deleted' | 'inactive'>('active');
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
        toast.error("Please upload a CSV or Excel file");
        return;
      }
      
      if (file.size > 10000000) { // 10MB limit
        toast.error("File size too large. Please upload a file under 10MB.");
        return;
      }

      setFile(file);
      
      // For CSV files, read headers directly
      if (file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const headers = text.split('\n')[0].split(',').map(header => 
            header.trim().replace(/['"]+/g, '')
          );
          setCsvColumns(headers);
          const initialMapping = headers.reduce((acc, header) => {
            acc[header] = "";
            return acc;
          }, {} as Record<string, string>);
          setColumnMapping(initialMapping);
        };
        reader.readAsText(file);
      } else {
        // For Excel files, use XLSX library
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
          
          setCsvColumns(headers);
          const initialMapping = headers.reduce((acc, header) => {
            acc[header] = "";
            return acc;
          }, {} as Record<string, string>);
          setColumnMapping(initialMapping);
        };
        reader.readAsBinaryString(file);
      }
      
      setStep(2);
    }
  };

  const handleColumnMap = (csvColumn: string, evershiftField: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [csvColumn]: evershiftField
    }));
  };

  const handleImport = () => {
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

    console.log("Importing with mapping:", columnMapping);
    toast.success("Starting import process...");
    onClose();
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Employee Status</h4>
          <RadioGroup defaultValue={status} onValueChange={(value: 'active' | 'deleted' | 'inactive') => setStatus(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deleted" id="deleted" />
              <Label htmlFor="deleted">Deleted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inactive" id="inactive" />
              <Label htmlFor="inactive">Inactive</Label>
            </div>
          </RadioGroup>
        </div>

        {step === 1 && (
          <FileUploadSection 
            file={file}
            onFileUpload={handleFileUpload}
            onRemoveFile={() => {
              setFile(null);
              setStep(1);
              setCsvColumns([]);
              setColumnMapping({});
            }}
          />
        )}

        {step === 2 && file && (
          <ColumnMappingSection 
            csvColumns={csvColumns}
            columnMapping={columnMapping}
            onColumnMap={handleColumnMap}
          />
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          disabled={!file || step !== 2} 
          onClick={handleImport}
        >
          Import
        </Button>
      </div>
    </div>
  );
}