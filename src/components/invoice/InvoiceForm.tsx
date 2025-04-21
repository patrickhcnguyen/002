import { useState } from "react";
import { Invoice, InvoiceItem } from "@/pages/Invoicing";
import { InvoiceHeader } from "./form-sections/InvoiceHeader";
import { ClientInfo } from "./form-sections/ClientInfo";
import { InvoiceItems } from "./form-sections/InvoiceItems";
import { InvoiceNotes } from "./form-sections/InvoiceNotes";
import { InvoiceTotals } from "./form-sections/InvoiceTotals";
import { InvoiceDetails } from "./form-sections/InvoiceDetails";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useInvoiceFormLogic } from "./hooks/useInvoiceFormLogic";

const formSchema = z.object({
  companyName: z.string(),
  invoiceNumber: z.string(),
  documentType: z.string(),
  clientName: z.string(),
  clientCompany: z.string(),
  clientPhone: z.string(),
  clientEmail: z.string(),
  shipTo: z.string(),
  date: z.string(),
  paymentTerms: z.string(),
  dueDate: z.string(),
  poNumber: z.string(),
  branchId: z.string().optional(),
  notes: z.string(),
  terms: z.string()
});

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onClose: () => void;
}

export function InvoiceForm({ invoice, onClose }: InvoiceFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [defaultTerms] = useState({
    paymentTerms: "Net 30",
    terms: ""
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: invoice?.companyName || "Morningstar Design Inc. DBA Elevate Events",
      invoiceNumber: invoice?.invoiceNumber || "64",
      documentType: invoice?.documentType || "QUOTE",
      clientName: invoice?.clientName || "",
      clientCompany: invoice?.clientCompany || "",
      clientPhone: invoice?.clientPhone || "",
      clientEmail: invoice?.clientEmail || "",
      shipTo: invoice?.shipTo || "",
      date: invoice?.date || new Date().toISOString().split("T")[0],
      paymentTerms: invoice?.paymentTerms || defaultTerms.paymentTerms,
      dueDate: invoice?.dueDate || "",
      poNumber: invoice?.poNumber || "",
      branchId: invoice?.branchId || "",
      notes: invoice?.notes || "",
      terms: invoice?.terms || defaultTerms.terms
    }
  });

  const {
    items,
    transactionFee,
    amountPaid,
    subtotal,
    transactionFeeAmount,
    total,
    balanceDue,
    handleAddItem,
    handleAddDate,
    handleDeleteItem,
    handleItemChange,
    setTransactionFee,
    setAmountPaid,
    handleSubmit
  } = useInvoiceFormLogic(form, invoice, navigate, toast);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-12">
        <InvoiceHeader 
          companyName={form.watch('companyName')}
          invoiceNumber={form.watch('invoiceNumber')}
          documentType={form.watch('documentType')}
          onCompanyNameChange={(value) => form.setValue('companyName', value)}
          onInvoiceNumberChange={(value) => form.setValue('invoiceNumber', value)}
          onDocumentTypeChange={(value) => form.setValue('documentType', value)}
        />
        
        <div className="grid grid-cols-2 gap-8">
          <ClientInfo form={form} />
          <InvoiceDetails form={form} />
        </div>
        
        <InvoiceItems
          items={items}
          onAddItem={handleAddItem}
          onItemChange={handleItemChange}
          onDeleteItem={handleDeleteItem}
          onAddDate={handleAddDate}
        />
        
        <div className="grid grid-cols-2 gap-8">
          <InvoiceNotes 
            notes={form.watch('notes')}
            terms={form.watch('terms')}
            onNotesChange={(value) => form.setValue('notes', value)}
            onTermsChange={(value) => form.setValue('terms', value)}
          />
          <InvoiceTotals
            subtotal={subtotal}
            transactionFee={transactionFee}
            transactionFeeAmount={transactionFeeAmount}
            total={total}
            amountPaid={amountPaid}
            balanceDue={balanceDue}
            onTransactionFeeChange={setTransactionFee}
            onAmountPaidChange={setAmountPaid}
          />
        </div>
      </form>
    </Form>
  );
}