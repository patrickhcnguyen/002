import { LogoDisplay } from "@/components/LogoDisplay";

interface InvoiceHeaderProps {
  companyName: string;
  documentType: string;
  invoiceNumber: string;
}

export function InvoiceHeader({ companyName, documentType, invoiceNumber }: InvoiceHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-12">
      <div>
        <LogoDisplay />
        <h2 className="text-xl font-semibold mt-4">{companyName}</h2>
      </div>
      <div className="text-right">
        <h1 className="text-4xl font-bold mb-2">{documentType}</h1>
        <p className="text-lg">#{invoiceNumber}</p>
      </div>
    </div>
  );
}