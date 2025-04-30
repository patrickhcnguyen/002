import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Invoice } from "@/pages/Invoicing";
import supabase from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortConfig = {
  key: keyof Invoice | null;
  direction: 'asc' | 'desc';
};

export function InvoiceTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminBranch, setAdminBranch] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  const handleSort = (key: keyof Invoice) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedInvoices = () => {
    if (!sortConfig.key) return invoices;

    return [...invoices].sort((a, b) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'due_date') {
        aValue = new Date(a.due_date).getTime();
        bValue = new Date(b.due_date).getTime();
      } else if (sortConfig.key === 'amount' || sortConfig.key === 'balance') {
        aValue = Number(a[sortConfig.key]) || 0;
        bValue = Number(b[sortConfig.key]) || 0;
      } else if (sortConfig.key === 'client_name') {
        aValue = a.company_name || a.client_name;
        bValue = b.company_name || b.client_name;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (key: keyof Invoice) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

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
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('request_id')}
                className="h-8 flex items-center gap-1"
              >
                Request ID
                {getSortIcon('request_id')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('client_name')}
                className="h-8 flex items-center gap-1"
              >
                Client
                {getSortIcon('client_name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('due_date')}
                className="h-8 flex items-center gap-1"
              >
                Due Date
                {getSortIcon('due_date')}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort('amount')}
                className="h-8 flex items-center gap-1 ml-auto"
              >
                Amount
                {getSortIcon('amount')}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort('balance')}
                className="h-8 flex items-center gap-1 ml-auto"
              >
                Balance
                {getSortIcon('balance')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('status')}
                className="h-8 flex items-center gap-1"
              >
                Status
                {getSortIcon('status')}
              </Button>
            </TableHead>
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
            getSortedInvoices().map((invoice) => (
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
