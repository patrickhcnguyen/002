import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/pages/Invoicing";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Mail, Printer, Share, Save, Edit, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const PaymentTerms = ["Net 30", "Net 10", "Due on receipt"];

export function InvoiceCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice>(location.state?.invoice as Invoice);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleChange = (field: keyof Invoice, value: any) => {
    setInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const paymentTermsValue = typeof invoice.payment_terms === 'number' 
        ? PaymentTerms[invoice.payment_terms as number] || "Due on receipt"
        : invoice.payment_terms;
      
      const { error } = await supabase
        .from('invoices')
        .update({
          client_name: invoice.client_name,
          company_name: invoice.company_name,
          client_email: invoice.client_email,
          ship_to: invoice.ship_to,
          due_date: invoice.due_date,
          payment_terms: paymentTermsValue,
          po_number: invoice.po_number,
          notes: invoice.notes,
          amount: invoice.amount,
          status: invoice.status
        })
        .eq('id', invoice.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Invoice updated",
        description: "Your changes have been saved successfully."
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update invoice. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

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
        
        <div className="ml-auto flex gap-2">
          {editMode ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditMode(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditMode(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
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
            </>
          )}
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
          {editMode ? (
            <Select 
              value={invoice.status} 
              onValueChange={value => handleChange('status', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={statusColor}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1).replace('_', ' ')}
            </Badge>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-2">Client Information</h3>
              {editMode ? (
                <>
                  <div className="mb-2">
                    <label className="text-sm text-muted-foreground">Company Name</label>
                    <Input 
                      value={invoice.company_name || ''} 
                      onChange={e => handleChange('company_name', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-sm text-muted-foreground">Client Name</label>
                    <Input 
                      value={invoice.client_name} 
                      onChange={e => handleChange('client_name', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-sm text-muted-foreground">Email</label>
                    <Input 
                      value={invoice.client_email} 
                      onChange={e => handleChange('client_email', e.target.value)} 
                      className="mt-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  {invoice.company_name && (
                    <p className="text-sm font-semibold">{invoice.company_name}</p>
                  )}
                  <p className="text-sm">{invoice.client_name}</p>
                  <p className="text-sm">{invoice.client_email}</p>
                </>
              )}
              
              <h3 className="font-medium mt-4 mb-2">Ship To</h3>
              {editMode ? (
                <Textarea 
                  value={invoice.ship_to || ''} 
                  onChange={e => handleChange('ship_to', e.target.value)} 
                  className="mt-1"
                />
              ) : (
                <p className="text-sm">{invoice.ship_to || "Not specified"}</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Due Date:</div>
                {editMode ? (
                  <Input 
                    type="date" 
                    value={invoice.due_date} 
                    onChange={e => handleChange('due_date', e.target.value)} 
                  />
                ) : (
                  <div>{new Date(invoice.due_date).toLocaleDateString()}</div>
                )}
                
                <div className="text-muted-foreground">Payment Terms:</div>
                {editMode ? (
                  <Select 
                    value={invoice.payment_terms || "Due on receipt"} 
                    onValueChange={value => handleChange('payment_terms', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PaymentTerms.map(term => (
                        <SelectItem key={term} value={term}>{term}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div>{invoice.payment_terms || "Due on receipt"}</div>
                )}
                
                <div className="text-muted-foreground">Transaction fee</div>
                <div>{formatCurrency(invoice.transaction_fee || 0)}</div>
                
                <div className="text-muted-foreground">PO Number:</div>
                {editMode ? (
                  <Input 
                    value={invoice.po_number || ''} 
                    onChange={e => handleChange('po_number', e.target.value)} 
                  />
                ) : (
                  <div>{invoice.po_number || "Not specified"}</div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Notes</h3>
            {editMode ? (
              <Textarea 
                value={invoice.notes || ''} 
                onChange={e => handleChange('notes', e.target.value)} 
                className="w-full"
                placeholder="Enter any additional notes here"
                rows={4}
              />
            ) : (
              <p className="text-sm">{invoice.notes || "No notes added"}</p>
            )}
          </div>

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
                <TableCell className="text-right">
                  {editMode ? (
                    <Input 
                      type="number" 
                      value={invoice.amount} 
                      onChange={e => handleChange('amount', parseFloat(e.target.value))} 
                      className="w-24 ml-auto"
                    />
                  ) : (
                    formatCurrency(invoice.amount)
                  )}
                </TableCell>
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
