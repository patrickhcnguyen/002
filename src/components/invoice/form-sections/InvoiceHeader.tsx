import { Input } from "@/components/ui/input";

interface InvoiceHeaderProps {
  companyName: string;
  invoiceNumber: string;
  documentType?: string;
  onCompanyNameChange: (value: string) => void;
  onInvoiceNumberChange: (value: string) => void;
  onDocumentTypeChange: (value: string) => void;
}

export function InvoiceHeader({ 
  companyName, 
  invoiceNumber,
  documentType = "QUOTE",
  onCompanyNameChange,
  onInvoiceNumberChange,
  onDocumentTypeChange
}: InvoiceHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-2">
        <Input
          className="text-2xl font-bold border-0 px-0 text-foreground w-[300px]"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Your Company Name"
        />
      </div>
      <div className="text-right space-y-1">
        <Input
          className="!text-[3rem] !h-auto font-black mb-4 text-right border-0 uppercase w-[300px]"
          value={documentType}
          onChange={(e) => onDocumentTypeChange(e.target.value)}
          placeholder="QUOTE"
        />
        <div className="flex items-center justify-end gap-2">
          <span className="text-muted-foreground">#</span>
          <Input
            className="w-24 text-right"
            value={invoiceNumber}
            onChange={(e) => onInvoiceNumberChange(e.target.value)}
            placeholder="Invoice #"
          />
        </div>
      </div>
    </div>
  );
}