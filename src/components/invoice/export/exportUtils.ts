import { Invoice } from "@/pages/Invoicing";

export const exportInvoices = (invoices: Invoice[], startDate: string, endDate: string) => {
  // Filter invoices by date range
  const filteredInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return invoiceDate >= start && invoiceDate <= end;
  });

  // Convert to CSV format
  const headers = ["Invoice Number", "Date", "Client Name", "Amount", "Status"];
  const rows = filteredInvoices.map(invoice => [
    invoice.invoiceNumber,
    invoice.date,
    invoice.clientName,
    invoice.amount.toFixed(2),
    invoice.status
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `invoices_${startDate}_to_${endDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};