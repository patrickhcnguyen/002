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
import { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useReactToPrint } from "react-to-print";

const PaymentTerms = ["Net 30", "Net 10", "Due on receipt"];

interface StaffRequirement {
  date: string;
  rate: number;
  count: number;
  hours: number;
  endTime: string;
  position: string;
  subtotal: number;
  startTime: string;
}

export function InvoiceCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [staffRequirements, setStaffRequirements] = useState<StaffRequirement[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: invoice?.id ? `Invoice ${invoice.id}` : 'Invoice',
    onAfterPrint: () => console.log('Printing complete'),
    onPrintError: (error) => console.error('Printing error:', error),
  });

  // const handleShare = async() => {
  //   const blob = new Blob([], { type: 'application/pdf' });
  //   const file = new File([blob], 'invoice.pdf', { type: 'application/pdf' });
  //   if (navigator.canShare && navigator.canShare({files: [file]})) {
  //     await navigator.share({
  //       title: `Invoice ${invoice?.id} from Evershift`,
  //       text: "Share Invoice",
  //       files: [file],
  //     })
  //   } else {
  //     console.log('Share not supported');
  //   }
  // }

  useEffect(() => {
    const fetchInvoice = async () => {
      const initialInvoice = location.state?.invoice as Invoice;
      if (!initialInvoice?.id) return;

      const { data, error } = await supabase
        .from('invoices')
        .select('*, staff_requirements_with_rates')
        .eq('id', initialInvoice.id)
        .single();

      if (error) {
        console.error('Error fetching invoice:', error);
        return;
      }

      console.log('Fetched invoice data:', data);
      setInvoice(data);
    };

    fetchInvoice();
  }, [location.state]);

  useEffect(() => {
    console.log('Raw invoice data:', invoice);
    console.log('Raw staff_requirements_with_rates:', invoice?.staff_requirements_with_rates);
    
    if (invoice?.staff_requirements_with_rates) {
      try {
        const requirements = typeof invoice.staff_requirements_with_rates === 'string'
          ? JSON.parse(invoice.staff_requirements_with_rates)
          : invoice.staff_requirements_with_rates;
          
        console.log('Parsed requirements:', requirements);
        console.log('Requirements type:', typeof requirements);
        console.log('Is Array?', Array.isArray(requirements));
        
        if (Array.isArray(requirements)) {
          console.log('First requirement:', requirements[0]);
          console.log('Requirements length:', requirements.length);
        }
        
        setStaffRequirements(requirements);
      } catch (error) {
        console.error('Error parsing staff requirements:', error);
      }
    }
  }, [invoice]);

  useEffect(() => {
    console.log('Current staffRequirements state:', staffRequirements);
  }, [staffRequirements]);

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
    
    const calculateHours = (startTime: string, endTime: string): number => {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
    
      const start = startHour * 60 + startMin;
      const end = endHour * 60 + endMin;
    
      return Math.max(0, (end - start) / 60);
    };
    
  

  const recalculateInvoiceTotals = (requirements: StaffRequirement[]) => {
    const subtotal = requirements.reduce((sum, req) => sum + req.subtotal, 0);
    const serviceFee = (subtotal * 1.5) - subtotal;
    const transactionFee = Number((subtotal * 0.035).toFixed(2));
    const fullAmount = Number((subtotal * 1.5).toFixed(2));

    return {
      subtotal,
      serviceFee,
      transactionFee,
      fullAmount
    };
  };

  const handleChange = (field: string, value: any, index: number) => {
    if (field === 'staff_requirements_with_rates') {
      const updatedRequirements = staffRequirements.map((req, i) => {
        if (i === index) {
          let updatedReq = { ...req };
          
          // Handle different field updates
          if (typeof value === 'object') {
            const { field: updateField, value: updateValue } = value;
            updatedReq[updateField] = updateValue;

            // Recalculate hours if time fields changed
            if (updateField === 'startTime' || updateField === 'endTime') {
              const hours = calculateHours(
                updateField === 'startTime' ? updateValue : req.startTime,
                updateField === 'endTime' ? updateValue : req.endTime
              );
              updatedReq.hours = hours;
            }

            // Recalculate subtotal for this requirement
            updatedReq.subtotal = updatedReq.rate * updatedReq.hours * updatedReq.count;
          } else {
            // For simple count updates
            updatedReq.count = parseInt(value) || 0;
            updatedReq.subtotal = updatedReq.rate * updatedReq.hours * updatedReq.count;
          }
          
          return updatedReq;
        }
        return req;
      });

      // Recalculate all invoice totals
      const { subtotal, serviceFee, transactionFee, fullAmount } = recalculateInvoiceTotals(updatedRequirements);

      setInvoice(prev => ({
        ...prev,
        staff_requirements_with_rates: updatedRequirements,
        subtotal: subtotal,
        service_fee: serviceFee,
        transaction_fee: transactionFee,
        amount: fullAmount,
        balance: fullAmount // Assuming balance starts as full amount
      }));
    } else {
      setInvoice(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
          service_fee: invoice.service_fee,
          staff_requirements_with_rates: invoice.staff_requirements_with_rates,
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

  const handleSendEmail = async () => {
    if (!invoice.client_email) {
      toast({
        variant: "destructive",
        title: "Missing Email",
        description: "This invoice doesn't have a client email address."
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to send emails');
      }

      // 1. First create Stripe checkout session
      const stripeResponse = await fetch('https://huydudorftiektexxpei.supabase.co/functions/v1/stripePayments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          amount: invoice.amount,
          client_email: invoice.client_email,
          company_name: invoice.company_name || invoice.client_name,
          invoiceId: invoice.id
        })
      });

      if (!stripeResponse.ok) {
        throw new Error('Failed to create payment link');
      }

      const { url: paymentUrl } = await stripeResponse.json();

      // 2. Then send email with the payment URL
      const emailResponse = await fetch('https://huydudorftiektexxpei.supabase.co/functions/v1/sendInvoiceEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          invoiceId: invoice.id,
          paymentUrl // Pass the payment URL to the email function
        })
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }

      toast({
        title: "Email Sent",
        description: `Invoice with payment link has been sent to ${invoice.client_email}`
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: error.message || "An error occurred"
      });
    } finally {
      setIsSendingEmail(false);
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
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSendEmail}
                disabled={isSendingEmail}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isSendingEmail ? "Sending..." : "Email"}
              </Button>
              {/* <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button> */}
              {/* <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button> */}
            </>
          )}
        </div>
      </div>

      <Card ref={componentRef}>
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
            onValueChange={value => handleChange('status', value, 0)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="partially_paid">Partially Paid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2">
            <Badge className={statusColor}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1).replace('_', ' ')}
            </Badge>

            {invoice.status === 'paid' && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={async () => {
                  try {
                    if (!invoice.payment_intent_id) {
                      throw new Error('No Payment Intent ID found on invoice');
                    }

                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                      throw new Error('Must be logged in');
                    }

                    const refundResponse = await fetch('https://huydudorftiektexxpei.supabase.co/functions/v1/stripeRefund', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                      },
                      body: JSON.stringify({
                        payment_intent_id: invoice.payment_intent_id,
                        amount: Math.round((invoice.amount || 0) * 100) // refund full amount
                      })
                    });

                    if (!refundResponse.ok) {
                      throw new Error('Failed to process refund');
                    }

                    const refundData = await refundResponse.json();
                    console.log('Refund successful:', refundData);

                    // After refund succeeds, update invoice status to unpaid
                    const { error } = await supabase
                      .from('invoices')
                      .update({ status: 'refunded' })
                      .eq('id', invoice.id);

                    if (error) throw error;

                    window.location.reload(); // or update local state if you want smoother UX

                  } catch (error) {
                    console.error('Refund error:', error);
                    alert(error.message || 'An error occurred while refunding');
                  }
                }}
              >
                Refund
              </Button>
            )}
          </div>
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
                      onChange={e => handleChange('company_name', e.target.value, 0)} 
                      className="mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-sm text-muted-foreground">Client Name</label>
                    <Input 
                      value={invoice.client_name} 
                      onChange={e => handleChange('client_name', e.target.value, 0)} 
                      className="mt-1"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-sm text-muted-foreground">Email</label>
                    <Input 
                      value={invoice.client_email} 
                      onChange={e => handleChange('client_email', e.target.value, 0)} 
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
                  onChange={e => handleChange('ship_to', e.target.value, 0)} 
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
                    onChange={e => handleChange('due_date', e.target.value, 0)} 
                  />
                ) : (
                  <div>{new Date(invoice.due_date).toLocaleDateString()}</div>
                )}
                
                <div className="text-muted-foreground">Payment Terms:</div>
                {editMode ? (
                  <Select 
                    value={invoice.payment_terms || "Due on receipt"} 
                    onValueChange={value => handleChange('payment_terms', value, 0)}
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
                    onChange={e => handleChange('po_number', e.target.value, 0)} 
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
                onChange={e => handleChange('notes', e.target.value, 0)} 
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
              {staffRequirements.map((requirement, index) => (
                <TableRow key={`${requirement.position}-${requirement.date}`}>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">{requirement.position}</span>
                      {editMode ? (
                        <div className="flex flex-col gap-2">
                          <Input 
                            type="date" 
                            value={requirement.date}
                            onChange={e => handleChange('staff_requirements_with_rates', {
                              field: 'date',
                              value: e.target.value
                            }, index)}
                            className="w-full"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={requirement.startTime.split(' ')[0]}
                              onChange={e => handleChange('staff_requirements_with_rates', {
                                field: 'startTime',
                                value: e.target.value
                              }, index)}
                              className="w-24"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={requirement.endTime.split(' ')[0]}
                              onChange={e => handleChange('staff_requirements_with_rates', {
                                field: 'endTime',
                                value: e.target.value
                              }, index)}
                              className="w-24"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {new Date(requirement.date).toLocaleDateString()} ({requirement.startTime} - {requirement.endTime})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {editMode ? (
                      <Input 
                        type="number"
                        min="0"
                        value={requirement.count}
                        onChange={e => handleChange('staff_requirements_with_rates', e.target.value, index)}
                        className="w-16 text-right"
                      />
                    ) : requirement.count}
                  </TableCell>
                  <TableCell className="text-right">
                    {editMode ? (
                      <div className="flex items-center justify-end gap-1">
                        $<Input 
                          type="number"
                          min="0"
                          value={requirement.rate}
                          onChange={e => handleChange('staff_requirements_with_rates', {
                            field: 'rate',
                            value: parseFloat(e.target.value) || 0
                          }, index)}
                          className="w-16 text-right"
                        />
                        <span>/ hr</span>
                      </div>
                    ) : (
                      `$${requirement.rate} / hr`
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    ${requirement.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Summary rows */}
              <TableRow className="border-t-2">
                <TableCell colSpan={3} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">
                  ${invoice?.subtotal?.toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Service Fee
                </TableCell>
                <TableCell className="text-right">
                  ${invoice?.service_fee?.toFixed(2)}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Transaction Fee (3.5%)
                </TableCell>
                <TableCell className="text-right">
                  ${invoice?.transaction_fee?.toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow className="border-t-2">
                <TableCell colSpan={3} className="text-right font-medium">
                  Total Amount
                </TableCell>
                <TableCell className="text-right font-bold">
                  ${invoice?.amount?.toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Balance Due
                </TableCell>
                <TableCell className="text-right font-bold">
                  ${invoice.balance?.toFixed(2) || '0.00'}
                </TableCell>
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

