import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Invoice } from "@/pages/Invoicing";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { X, ArrowLeft } from "lucide-react";

const PaymentTerms = ["Net 30", "Net 10", "Due on receipt"];

const STAFF_TYPES = [
  'Brand Ambassadors',
  'Bartenders',
  'Production Assistants',
  'Catering Staff',
  'Model Staff',
  'Registration Staff',
  'Convention Staff'
] as const;

const STAFF_RATES: Record<typeof STAFF_TYPES[number], number> = {
  'Brand Ambassadors': 18,
  'Bartenders': 25,
  'Production Assistants': 20,
  'Catering Staff': 18,
  'Model Staff': 19,
  'Registration Staff': 18,
  'Convention Staff': 18
};

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

export function CreateInvoiceForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [staffRequirements, setStaffRequirements] = useState<StaffRequirement[]>([]);
  const [editingTimes, setEditingTimes] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState<Partial<Invoice>>({
    client_name: '',
    company_name: '',
    client_email: '',
    ship_to: '',
    due_date: new Date().toISOString().split('T')[0],
    payment_terms: 'Net 30',
    status: 'pending',
    notes: '',
    discount_type: null,
    discount_value: 0,
    shipping_cost: 0,
    staff_requirements_with_rates: [],
    event_location: '',
    branch: '',
    subtotal: 0,
    service_fee: 0,
    transaction_fee: 0,
    amount: 0,
    balance: 0,
  });

  const calculateHours = (startTime: string, endTime: string): number => {
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    let startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);

    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    return Number(((endMinutes - startMinutes) / 60).toFixed(2));
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

    const subtotal = Number(updatedRequirements.reduce((sum, req) => sum + req.subtotal, 0).toFixed(2));

    let discountAmount = 0;
    if (formData.discount_type && formData.discount_value) {
      discountAmount = formData.discount_type === 'flat'
        ? formData.discount_value
        : (subtotal * (formData.discount_value / 100));
      discountAmount = Number(discountAmount.toFixed(2));
    }

    const shippingCost = Number(formData.shipping_cost || 0);
    const adjustedSubtotal = subtotal - discountAmount + shippingCost;
    const transactionFee = Number((adjustedSubtotal * 0.035).toFixed(2));
    const serviceFee = Number(((adjustedSubtotal + transactionFee) * 1.5 - (adjustedSubtotal + transactionFee)).toFixed(2));
    const fullAmount = Number((adjustedSubtotal + serviceFee + transactionFee).toFixed(2));

    return {
      requirements: updatedRequirements,
      subtotal,
      serviceFee,
      transactionFee,
      fullAmount,
      discountAmount
    };
  };

  const handleChange = (field: string, value: any, index?: number) => {
    if (field === 'staff_requirements_with_rates' && typeof index === 'number') {
      const updatedRequirements = [...staffRequirements];
      
      if (index >= 0 && index < updatedRequirements.length) {
        if (typeof value === 'object') {
          if (value.field === 'position') {
            const defaultRate = STAFF_RATES[value.value as keyof typeof STAFF_RATES];
            updatedRequirements[index] = {
              ...updatedRequirements[index],
              [value.field]: value.value,
              rate: defaultRate
            };
          } else {
            updatedRequirements[index] = {
              ...updatedRequirements[index],
              [value.field]: value.value
            };
          }
        } else {
          updatedRequirements[index].count = parseInt(value);
        }

        const { requirements, subtotal, serviceFee, transactionFee, fullAmount } = 
          recalculateInvoiceTotals(updatedRequirements);

        setStaffRequirements(requirements);
        setFormData(prev => ({
          ...prev,
          staff_requirements_with_rates: requirements,
          subtotal,
          service_fee: serviceFee,
          transaction_fee: transactionFee,
          amount: fullAmount,
          balance: fullAmount
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddStaff = () => {
    const newStaffRequirement: StaffRequirement = {
      position: STAFF_TYPES[0],
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      rate: STAFF_RATES[STAFF_TYPES[0]],
      count: 1,
      hours: 8,
      subtotal: STAFF_RATES[STAFF_TYPES[0]] * 8
    };
    
    const updatedRequirements = [...staffRequirements, newStaffRequirement];
    const { requirements, subtotal, serviceFee, transactionFee, fullAmount } = 
      recalculateInvoiceTotals(updatedRequirements);
    
    setStaffRequirements(requirements);
    setFormData(prev => ({
      ...prev,
      staff_requirements_with_rates: requirements,
      subtotal,
      service_fee: serviceFee,
      transaction_fee: transactionFee,
      amount: fullAmount,
      balance: fullAmount
    }));
  };

  const handleRemoveStaff = (index: number) => {
    const updatedRequirements = staffRequirements.filter((_, i) => i !== index);
    const { requirements, subtotal, serviceFee, transactionFee, fullAmount } = 
      recalculateInvoiceTotals(updatedRequirements);
    
    setStaffRequirements(requirements);
    setFormData(prev => ({
      ...prev,
      staff_requirements_with_rates: requirements,
      subtotal,
      service_fee: serviceFee,
      transaction_fee: transactionFee,
      amount: fullAmount,
      balance: fullAmount
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // First create a Request
      const { data: requestData, error: requestError } = await supabase
        .from('Requests')
        .insert({
            first_name: formData.client_name?.split(' ')[0] || '',
            last_name: formData.client_name?.split(' ').slice(1).join(' ') || '',
            email: formData.client_email,
            company_name: formData.company_name || '',
            // phone_number: formData.phone_number || '',
            closest_branch: formData.branch,
            event_location: formData.event_location,
            event_date: formData.due_date,
        })
        .select()
        .single();

      if (requestError) throw requestError;

      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          ...formData,
          request_id: requestData.id,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      toast({
        title: "Invoice created",
        description: "Your invoice has been created successfully."
      });

      navigate(`/invoicing/${invoiceData.id}`, { state: { invoice: invoiceData } });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create invoice. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/invoicing')} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-[#E6F7ED] rounded-md p-2"
          >
            <ArrowLeft className="h-4 w-4 hover:text-foreground" />
            Back to invoices
          </button>
          <Separator orientation="vertical" className="h-6" />
          <CardTitle>Create New Invoice</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client Information */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Client Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Company Name</label>
                <Input 
                  value={formData.company_name || ''} 
                  onChange={e => handleChange('company_name', e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Client Name</label>
                <Input 
                  value={formData.client_name || ''} 
                  onChange={e => handleChange('client_name', e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input 
                  value={formData.client_email || ''} 
                  onChange={e => handleChange('client_email', e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Ship To</label>
                <Textarea 
                  value={formData.ship_to || ''} 
                  onChange={e => handleChange('ship_to', e.target.value)} 
                  className="mt-1"
                />
              </div>
              <label className="text-sm text-muted-foreground">Event Location</label>
              <Input 
                value={formData.event_location || ''} 
                onChange={e => handleChange('event_location', e.target.value)} 
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Invoice Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Branch</label>
                <Select 
                  value={formData.branch || ''} 
                  onValueChange={value => handleChange('branch', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Los Angeles, CA">Los Angeles</SelectItem>
                    <SelectItem value="New York City, NY">New York</SelectItem>
                    <SelectItem value="Atlanta, GA">Atlanta</SelectItem>
                    <SelectItem value="Houston, TX">Houston</SelectItem>
                    <SelectItem value="Washington, DC">Washington</SelectItem>
                    <SelectItem value="Orange County, CA">Orange County</SelectItem>
                    <SelectItem value="Chicago, IL">Chicago</SelectItem>
                    <SelectItem value="San Francisco, CA">San Francisco</SelectItem>
                    <SelectItem value="Miami, FL">Miami</SelectItem>
                    <SelectItem value="Las Vegas, NV">Las Vegas</SelectItem>
                    <SelectItem value="Salt Lake City, UT">Salt Lake City</SelectItem>
                    <SelectItem value="Seattle, WA">Seattle</SelectItem>
                    <SelectItem value="Orlando, FL">Orlando</SelectItem>
                    <SelectItem value="Charlotte, NC">Charlotte</SelectItem>
                    <SelectItem value="Boston, MA">Boston</SelectItem>
                    <SelectItem value="Dallas, TX">Dallas</SelectItem>
                    <SelectItem value="Austin, TX">Austin</SelectItem>
                    <SelectItem value="Tampa, FL">Tampa</SelectItem>
                    <SelectItem value="Phoenix, AZ">Phoenix</SelectItem>
                    <SelectItem value="San Diego, CA">San Diego</SelectItem>
                    <SelectItem value="New Orleans, LA">New Orleans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Due Date</label>
                <Input 
                  type="date" 
                  value={formData.due_date} 
                  onChange={e => handleChange('due_date', e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Payment Terms</label>
                <Select 
                  value={formData.payment_terms} 
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
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Discount Type</label>
                <Select 
                  value={formData.discount_type || 'none'} 
                  onValueChange={value => handleChange('discount_type', value === 'none' ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.discount_type && formData.discount_type !== 'none' && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    Discount Value {formData.discount_type === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <Input 
                    type="number"
                    value={formData.discount_value || ''}
                    onChange={e => handleChange('discount_value', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground">Shipping Cost</label>
                <Input 
                  type="number"
                  value={formData.shipping_cost || ''}
                  onChange={e => handleChange('shipping_cost', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <label className = "text-sm text-muted-foreground">PO Number</label>
              <Input 
                value={formData.po_number || ''} 
                onChange={e => handleChange('po_number', e.target.value)} 
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Staff Requirements */}
        <div>
          <h3 className="font-medium mb-4">Staff Requirements</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffRequirements.map((requirement, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-2">
                      <Select
                        value={requirement.position}
                        onValueChange={(newValue) => {
                          handleChange('staff_requirements_with_rates', {
                            field: 'position',
                            value: newValue
                          }, index);
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select staff type" />
                        </SelectTrigger>
                        <SelectContent>
                          {STAFF_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input 
                        type="date" 
                        value={requirement.date}
                        onChange={e => handleChange('staff_requirements_with_rates', {
                          field: 'date',
                          value: e.target.value
                        }, index)}
                      />
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={editingTimes[`${index}-startTime`] || requirement.startTime}
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
                          value={editingTimes[`${index}-endTime`] || requirement.endTime}
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
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number"
                      min="0"
                      value={requirement.count}
                      onChange={e => handleChange('staff_requirements_with_rates', e.target.value, index)}
                      className="w-16 text-right"
                    />
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                  <TableCell className="text-right">
                    ${calculateSubtotal(requirement).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStaff(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddStaff}
                    className="w-full"
                  >
                    Add Staff Requirement
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Notes */}
        <div>
          <h3 className="font-medium mb-2">Notes</h3>
          <Textarea 
            value={formData.notes || ''} 
            onChange={e => handleChange('notes', e.target.value)} 
            className="w-full"
            placeholder="Enter any additional notes here"
            rows={4}
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col items-end space-y-2">
          <div className="flex w-full max-w-[200px] justify-between">
            <span>Subtotal:</span>
            <span>${formData.subtotal?.toFixed(2)}</span>
          </div>
          {formData.discount_type && formData.discount_value > 0 && (
            <div className="flex w-full max-w-[200px] justify-between text-red-600">
              <span>Discount:</span>
              <span>-${(formData.discount_type === 'flat' 
                ? formData.discount_value 
                : (formData.subtotal * (formData.discount_value / 100))).toFixed(2)}</span>
            </div>
          )}
          {formData.shipping_cost > 0 && (
            <div className="flex w-full max-w-[200px] justify-between">
              <span>Shipping:</span>
              <span>${formData.shipping_cost.toFixed(2)}</span>
            </div>
          )}
          <div className="flex w-full max-w-[200px] justify-between">
            <span>Service Fee:</span>
            <span>${formData.service_fee?.toFixed(2)}</span>
          </div>
          <div className="flex w-full max-w-[200px] justify-between">
            <span>Transaction Fee:</span>
            <span>${formData.transaction_fee?.toFixed(2)}</span>
          </div>
          <div className="flex w-full max-w-[200px] justify-between font-bold">
            <span>Total Amount:</span>
            <span>${formData.amount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/invoicing')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 