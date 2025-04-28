import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Invoice } from "@/pages/Invoicing";
import supabase from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function InvoiceTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminBranch, setAdminBranch] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRowClick = (invoice: Invoice) => {
    navigate(`/invoicing/${invoice.id}`, { state: { invoice } });
  };

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Full session data:', sessionData);
        
        const { data: userData } = await supabase.auth.getUser();
        console.log('Full user data:', userData);
        
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('email', userData.user?.email)
          .single();
        
        
        const branch = adminData?.branch || userData.user?.user_metadata?.branch;

        if (!branch) {
          console.error('No branch found for admin');
          setIsLoading(false);
          return;
        }

        setAdminBranch(branch);

        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('id, request_id, branch, client_name, company_name, due_date, amount, balance, status, payment_terms, notes, ship_to, po_number, amount_paid, transaction_fee, client_email')
          .eq('branch', branch)
          .order('due_date', { ascending: false });

        console.log('Invoices query:', {
          branch: branch,
          result: invoicesData,
          error: invoicesError
        });

        if (invoicesError) {
          console.error('Error fetching invoices:', invoicesError);
          return;
        }

        setInvoices((invoicesData || []) as Invoice[]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center p-4">Loading invoices...</div>;
  }

  if (!adminBranch) {
    return <div className="flex justify-center items-center p-4">No branch assigned to admin</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No invoices found for {adminBranch}
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow 
                key={invoice.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(invoice)}
              >
                <TableCell>{invoice.request_id}</TableCell>
                <TableCell>
                  {invoice.company_name ? invoice.company_name : invoice.client_name}
                </TableCell>
                <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.balance)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      invoice.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {invoice.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
