import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// subtotal = sum of all staff requirements
// amount = subtotal * 1.5
// balance = amount client still needs to pay off 

const STAFF_RATES = {
  'Brand Ambassadors': 18,
  'Bartenders': 25,
  'Production Assistants': 20,
  'Catering Staff': 18,
  'Model Staff': 19,
  'Registration Staff': 18,
  'Convention Staff': 18
} as const;

type StaffPosition = keyof typeof STAFF_RATES;

type StaffRequirement = {
  date: string;
  count: number;
  endTime: string;
  position: string;
  startTime: string;
}

// balance should subtotal * 1.5
const calculateBalance = (subtotal: number) => {
  return subtotal * 1.5;
}

const calculateStaffRates = (staff_requirements: StaffRequirement[]) => {
  return staff_requirements.map(requirement => {
    const hourlyRate = STAFF_RATES[requirement.position as StaffPosition] || 0;
    
    const formatTime = (timeStr: string) => {
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

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: request, error: requestError } = await supabase
      .from('Requests')
      .insert({
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
      })
      .select()
      .single();

    if (requestError) throw requestError;

    const staffWithRates = calculateStaffRates(requestData.staff_requirements);
    
    // subtotal (sum of all staff requirements)
    const subtotal = staffWithRates.reduce((sum, staff) => sum + staff.subtotal, 0);
    
    // transaction fee (3.5%)
    const transactionFee = Number((subtotal * 0.035).toFixed(2));
    
    // balance (subtotal * 1.5)
    const fullAmount = Number(calculateBalance(subtotal).toFixed(2));

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        request_id: request.id,
        client_name: `${requestData.first_name} ${requestData.last_name}`,
        client_email: requestData.email,
        company_name: requestData.company_name,
        branch: requestData.closest_branch,
        subtotal: subtotal,
        amount: fullAmount,
        balance: fullAmount, // use a stripe webbook to update balance accordingly 
        transaction_fee: transactionFee,
        status: 'pending',
        due_date: requestData.event_date,
        staff_requirements_with_rates: staffWithRates,
        payment_terms: 'Due on receipt'
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    return new Response(
      JSON.stringify({ success: true, data: invoice }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error details:', error); 
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});


/**
supabase functions deploy createRequestWithInvoice
curl -i -X POST 'https://huydudorftiektexxpei.supabase.co/functions/v1/createRequestWithInvoice' \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eWR1ZG9yZnRpZWt0ZXh4cGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyODAzMjYsImV4cCI6MjA2MDg1NjMyNn0.BZHCCicas24Zh6-5r_QqLq8QRYInx6D2zPHVsqYnovA" \
-H "Content-Type: application/json" \
--data '{
  "first_name": "Patrick",
  "last_name": "Nguyen",
  "email": "patrick@example.com",
  "phone_number": "1234567890",
  "type_of_staff": "Security",
  "type_of_event": "Concert",
  "event_location": "123 Fake St, SF",
  "closest_branch": "San Francisco",
  "event_date": "2025-05-01",
  "staff_requirements": {
    "staff_type": "security",
    "count": 5,
    "hours": 8
  }
}'
 */