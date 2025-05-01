import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const STAFF_RATES = {
  'Brand Ambassadors': 18,
  'Bartenders': 25,
  'Production Assistants': 20,
  'Catering Staff': 18,
  'Model Staff': 19,
  'Registration Staff': 18,
  'Convention Staff': 18
};

async function generateUniquePONumber(supabase: any) {
  const year = new Date().getFullYear();
  let poNumber;
  let exists = true;

  while (exists) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000); 
    poNumber = `EV-${year}-${randomDigits}`;
    
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .eq('po_number', poNumber)
      .maybeSingle();

    if (error) throw error;
    exists = !!data;
  }
  return poNumber;
}


const calculateStaffRates = (staff_requirements)=>{
  return staff_requirements.map((requirement)=>{
    const hourlyRate = STAFF_RATES[requirement.position] || 0;
    const formatTime = (timeStr)=>{
      if (!timeStr.toLowerCase().includes('pm') && !timeStr.toLowerCase().includes('am')) {
        const [hours, minutes] = timeStr.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      let [time, period] = timeStr.toLowerCase().split(' ');
      let [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      return `${String(hour).padStart(2, '0')}:${minutes}`;
    };
    const startTime = new Date(`2000-01-01T${formatTime(requirement.startTime)}`);
    const endTime = new Date(`2000-01-01T${formatTime(requirement.endTime)}`);
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const subtotal = hourlyRate * hours * requirement.count;
    return {
      ...requirement,
      rate: hourlyRate,
      hours: Number(hours.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2))
    };
  });
};
serve(async (req)=>{
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const requestData = await req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: request, error: requestError } = await supabase.from('Requests').insert({
      first_name: requestData.first_name,
      last_name: requestData.last_name,
      email: requestData.email,
      phone_number: requestData.phone_number,
      type_of_staff: requestData.type_of_staff,
      type_of_event: requestData.type_of_event,
      event_location: requestData.event_location,
      closest_branch: requestData.closest_branch,
      event_date: requestData.event_date,
      staff_requirements: requestData.staff_requirements,
      created_at: requestData.created_at,
      is_company: requestData.is_company,
      company_name: requestData.company_name
    }).select().single();
    if (requestError) throw requestError;
    const staffWithRates = calculateStaffRates(requestData.staff_requirements);
    // subtotal (sum of all staff requirements)
    const subtotal = staffWithRates.reduce((sum, staff)=>sum + staff.subtotal, 0);
    // transaction fee (3.5%)
    const transactionFee = Number((subtotal * 0.035).toFixed(2));
    // service fee (subtotal + transactionFee) * 1.5 - subtotal
    const serviceFee = (subtotal + transactionFee) * 1.5 - (subtotal + transactionFee);
    // balance (subtotal + transactionFee + serviceFee)
    const fullAmount = Number((subtotal + transactionFee + serviceFee).toFixed(2));
    // unique po number
    const po_number = await generateUniquePONumber(supabase);
    const { data: invoice, error: invoiceError } = await supabase.from('invoices').insert({
      request_id: request.id,
      client_name: `${requestData.first_name} ${requestData.last_name}`,
      client_email: requestData.email,
      company_name: requestData.company_name,
      event_location: requestData.event_location,
      branch: requestData.closest_branch,
      subtotal: subtotal,
      amount: fullAmount,
      balance: fullAmount,
      transaction_fee: transactionFee,
      service_fee: serviceFee,
      status: 'pending',
      due_date: requestData.event_date,
      staff_requirements_with_rates: staffWithRates,
      payment_terms: 'Due on receipt',
      po_number: po_number
    }).select().single();
    if (invoiceError) throw invoiceError;
    return new Response(JSON.stringify({
      success: true,
      data: invoice
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
