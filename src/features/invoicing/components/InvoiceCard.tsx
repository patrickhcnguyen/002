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
  const [editingDates, setEditingDates] = useState<{[key: string]: string}>({});
  const [editingTimes, setEditingTimes] = useState<{[key: string]: string}>({});
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: invoice?.id ? `Invoice ${invoice.id}` : 'Invoice',
    onAfterPrint: () => console.log('Printing complete'),
    onPrintError: (error) => console.error('Printing error:', error),
  });

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

      const requirements = typeof data.staff_requirements_with_rates === 'string'
        ? JSON.parse(data.staff_requirements_with_rates)
        : data.staff_requirements_with_rates;

      setInvoice(data);
      setStaffRequirements(requirements || []);
    };

    fetchInvoice();
  }, [location.state]);

  useEffect(() => {
    if (!editMode) {
      setEditingDates({});
      setEditingTimes({});
    }
  }, [editMode]);

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
      const convertTo24Hour = (timeStr: string) => {
        if (!timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
          return timeStr;
        }

        let [time, period] = timeStr.toLowerCase().split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'pm' && hours !== 12) {
          hours += 12;
        } else if (period === 'am' && hours === 12) {
          hours = 0;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };

      const timeToMinutes = (time: string) => {
        const [hours, minutes] = convertTo24Hour(time).split(':').map(Number);
        return hours * 60 + minutes;
      };

      let startMinutes = timeToMinutes(startTime);
      let endMinutes = timeToMinutes(endTime);

      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60; 
      }

      const hours = (endMinutes - startMinutes) / 60;
      
      return Number(Math.max(0, hours).toFixed(2));
    };
    
  const calculateSubtotal = (requirement: StaffRequirement) => {
    const hours = calculateHours(requirement.startTime, requirement.endTime);
    return Number((requirement.rate * hours * requirement.count).toFixed(2));
  };

  const recalculateInvoiceTotals = (requirements: StaffRequirement[]) => {
    const updatedRequirements = requirements.map(req => ({
      ...req,
      subtotal: calculateSubtotal(req)
    }));

    // cost of staff
    const subtotal = Number(updatedRequirements.reduce((sum, req) => sum + req.subtotal, 0).toFixed(2));

    // subtotal * 0.035
    const transactionFee = Number((subtotal * 0.035).toFixed(2)); 
    
    // (subtotal + transactionFee) * 1.5 - subtotal
    const serviceFee = Number(((subtotal + transactionFee) * 1.5 - (subtotal + transactionFee)).toFixed(2));
    
    const fullAmount = Number((subtotal + serviceFee + transactionFee).toFixed(2));

    return {
      requirements: updatedRequirements,
      subtotal,
      serviceFee,
      transactionFee,
      fullAmount
    };
  };

  const handleChange = (field: string, value: any, index?: number) => {
    if (field === 'staff_requirements_with_rates' && typeof index === 'number') {
      const updatedRequirements = [...staffRequirements];
      
      if (index >= 0 && index < updatedRequirements.length) {
        if (typeof value === 'object') {
          updatedRequirements[index] = {
            ...updatedRequirements[index],
            [value.field]: value.value
          };
        } else {
          updatedRequirements[index].count = parseInt(value);
        }

        // Recalculate all totals
        const {
          requirements,
          subtotal,
          serviceFee,
          transactionFee,
          fullAmount
        } = recalculateInvoiceTotals(updatedRequirements);

        setStaffRequirements(requirements);
        setInvoice(prev => ({
          ...prev,
          staff_requirements_with_rates: requirements,
          subtotal,
          service_fee: serviceFee,
          transaction_fee: transactionFee,
          amount: fullAmount,
          balance: fullAmount // Update balance to match full amount if no payments
        }));
      }
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
      // Recalculate all totals to ensure consistency
      const {
        requirements: updatedRequirements,
        subtotal,
        serviceFee,
        transactionFee,
        fullAmount
      } = recalculateInvoiceTotals(staffRequirements);

      const paymentTermsValue = typeof invoice.payment_terms === 'number' 
        ? PaymentTerms[invoice.payment_terms as number] || "Due on receipt"
        : invoice.payment_terms;
      
      const { error } = await supabase
        .from('invoices')
        .update({
          client_name: invoice.client_name,
          company_name: invoice.company_name,
          client_email: invoice.client_email,
          service_fee: serviceFee,
          transaction_fee: transactionFee,
          staff_requirements_with_rates: updatedRequirements,
          ship_to: invoice.ship_to,
          due_date: invoice.due_date,
          payment_terms: paymentTermsValue,
          po_number: invoice.po_number,
          notes: invoice.notes,
          amount: fullAmount,
          balance: fullAmount - (invoice.amount_paid || 0),
          subtotal: subtotal,
          status: invoice.status
        })
        .eq('id', invoice.id);

      if (error) {
        throw error;
      }

      // Update local state with the recalculated values
      setStaffRequirements(updatedRequirements);
      setInvoice(prev => ({
        ...prev,
        staff_requirements_with_rates: updatedRequirements,
        subtotal,
        service_fee: serviceFee,
        transaction_fee: transactionFee,
        amount: fullAmount,
        balance: fullAmount - (prev.amount_paid || 0)
      }));

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

      const { subtotal, serviceFee, transactionFee, fullAmount } = recalculateInvoiceTotals(staffRequirements);

      const stripeResponse = await fetch('https://huydudorftiektexxpei.supabase.co/functions/v1/stripePayments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          amount: fullAmount,
          client_email: invoice.client_email,
          company_name: invoice.company_name || invoice.client_name,
          invoiceId: invoice.id,
          subtotal: subtotal,
          serviceFee: serviceFee,
          transactionFee: transactionFee,
          staff_requirements_with_rates: staffRequirements
        })
      });

      if (!stripeResponse.ok) {
        throw new Error('Failed to create payment link');
      }

      const { url: paymentUrl } = await stripeResponse.json();

      const emailResponse = await fetch('https://huydudorftiektexxpei.supabase.co/functions/v1/sendInvoiceEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          invoiceId: invoice.id,
          paymentUrl,
          subtotal: subtotal,
          serviceFee: serviceFee,
          transactionFee: transactionFee,
          fullAmount: fullAmount,
          staff_requirements_with_rates: staffRequirements
        })
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }

      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          subtotal,
          service_fee: serviceFee,
          transaction_fee: transactionFee,
          amount: fullAmount,
          balance: fullAmount,
          staff_requirements_with_rates: staffRequirements
        })
        .eq('id', invoice.id);

      if (updateError) throw updateError;

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

                    const { error } = await supabase
                      .from('invoices')
                      .update({ status: 'refunded' })
                      .eq('id', invoice.id);

                    if (error) throw error;

                    window.location.reload(); 

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
                    onChange={e => handleChange('due_date', e.target.value)} 
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
              {staffRequirements?.map((requirement, index) => (
                <TableRow key={`${requirement.position}-${requirement.date}`}>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">{requirement.position}</span>
                      <div className="flex flex-col gap-2">
                        {editMode ? (
                          <>
                            <Input 
                              type="date" 
                              defaultValue={requirement.date}
                              onBlur={e => handleChange('staff_requirements_with_rates', {
                                field: 'date',
                                value: e.target.value
                              }, index)}
                              className="w-full"
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={editingTimes[`${index}-startTime`] || requirement.startTime.split(' ')[0]}
                                onChange={e => {
                                  setEditingTimes(prev => ({
                                    ...prev,
                                    [`${index}-startTime`]: e.target.value
                                  }));
                                  handleChange('staff_requirements_with_rates', {
                                    field: 'startTime',
                                    value: e.target.value
                                  }, index);
                                }}
                                className="w-28"
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={editingTimes[`${index}-endTime`] || requirement.endTime.split(' ')[0]}
                                onChange={e => {
                                  setEditingTimes(prev => ({
                                    ...prev,
                                    [`${index}-endTime`]: e.target.value
                                  }));
                                  handleChange('staff_requirements_with_rates', {
                                    field: 'endTime',
                                    value: e.target.value
                                  }, index);
                                }}
                                className="w-28"
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {new Date(requirement.date).toLocaleDateString()} ({requirement.startTime} - {requirement.endTime})
                          </span>
                        )}
                      </div>
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
                    ${calculateSubtotal(requirement).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Summary rows */}
              <TableRow className="border-t-2">
                <TableCell colSpan={3} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">
                  ${invoice.subtotal?.toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Service Fee
                </TableCell>
                <TableCell className="text-right">
                  ${invoice.service_fee?.toFixed(2)}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Transaction Fee (3.5%)
                </TableCell>
                <TableCell className="text-right">
                  ${invoice.transaction_fee?.toFixed(2)}
                </TableCell>
              </TableRow>

              <TableRow className="border-t-2">
                <TableCell colSpan={3} className="text-right font-medium">
                  Total Amount
                </TableCell>
                <TableCell className="text-right font-bold">
                  ${invoice.amount?.toFixed(2)}
                </TableCell>
              </TableRow>

              {invoice.amount_paid > 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Amount Paid
                  </TableCell>
                  <TableCell className="text-right">
                    ${invoice.amount_paid.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="flex flex-col items-end space-y-2 pt-6">
          <div className="flex w-full max-w-[200px] justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal || 0)}</span>
          </div>
          
          <div className="flex w-full max-w-[200px] justify-between">
            <span>Transaction Fee:</span>
            <span>{formatCurrency(invoice.transaction_fee || 0)}</span>
          </div>
          
          {invoice.amount_paid > 0 && (
            <div className="flex w-full max-w-[200px] justify-between">
              <span>Amount Paid:</span>
              <span>{formatCurrency(invoice.amount_paid)}</span>
            </div>
          )}

          <div className="flex w-full max-w-[200px] justify-between">
            <span>Service Fee:</span>
            <span>{formatCurrency(invoice.service_fee || 0)}</span>
          </div>
          
          <div className="flex w-full max-w-[200px] justify-between font-bold">
            <span>Balance Due:</span>
            <span>{formatCurrency(invoice.balance || 0)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}