import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/pages/Invoicing";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Mail, Printer, Share } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PaymentTerms = ["Net 30", "Net 10", "Due on receipt"]

export function InvoiceCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const invoice = location.state?.invoice as Invoice;

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
        <p className="text-muted-foreground mb-4">The invoice you're looking for could not be found.</p>
        <Button onClick={() => navigate('/invoicing')}>Return to Invoices</Button>
      </div>
    );
  }

  const statusColor = 
    invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
    invoice.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' : 
    'bg-red-100 text-red-800';

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate('/invoicing')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
        <h1 className="text-2xl font-bold">Invoice Details</h1>
        <p className="text-sm text-muted-foreground">
            {PaymentTerms[invoice.payment_terms]}
        </p>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              <span>Request #{invoice.request_id}</span>
            </CardTitle>
            <CardDescription>
              Branch: {invoice.branch}
            </CardDescription>
          </div>
          <Badge className={statusColor}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1).replace('_', ' ')}
          </Badge>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-2">Client Information</h3>
              {invoice.company_name && (
                <p className="text-sm font-semibold">{invoice.company_name}</p>
              )}
              <p className="text-sm">{invoice.client_name}</p>
              <p className="text-sm">{invoice.client_email}</p>
              
              {invoice.ship_to && (
                <>
                  <h3 className="font-medium mt-4 mb-2">Ship To</h3>
                  <p className="text-sm">{invoice.ship_to}</p>
                </>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Due Date:</div>
                <div>{new Date(invoice.due_date).toLocaleDateString()}</div>
                
                <div className="text-muted-foreground">Payment Terms:</div>
                <div>{invoice.payment_terms || "Due on receipt"}</div>
                
                {invoice.po_number && (
                  <>
                    <div className="text-muted-foreground">PO Number:</div>
                    <div>{invoice.po_number}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="mb-6">
            {invoice.notes && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* This would be replaced with actual invoice items */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Staffing Services</TableCell>
                <TableCell className="text-right">1</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="flex flex-col items-end space-y-2 pt-6">
          <div className="flex w-full max-w-[200px] justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.amount)}</span>
          </div>
          
          {invoice.transaction_fee && (
            <div className="flex w-full max-w-[200px] justify-between">
              <span>Transaction Fee:</span>
              <span>{formatCurrency(invoice.transaction_fee)}</span>
            </div>
          )}
          
          {invoice.amount_paid && (
            <div className="flex w-full max-w-[200px] justify-between">
              <span>Amount Paid:</span>
              <span>{formatCurrency(invoice.amount_paid)}</span>
            </div>
          )}
          
          <div className="flex w-full max-w-[200px] justify-between font-bold">
            <span>Balance Due:</span>
            <span>{formatCurrency(invoice.balance)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
