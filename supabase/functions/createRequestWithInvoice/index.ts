import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Environment check:', {
      url_exists: !!Deno.env.get('SUPABASE_URL'),
      anon_key_exists: !!Deno.env.get('SUPABASE_ANON_KEY'),
      service_role_exists: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! 
    );

    const requestPayload = await req.json();
    console.log('Request payload:', requestPayload);

    if (!requestPayload || Object.keys(requestPayload).length === 0) {
      return new Response(JSON.stringify({ error: "No request payload" }), {
        status: 400,
      });
    }

    const { data: requestData, error: requestError } = await supabase
      .from("Requests")
      .insert(requestPayload)
      .select()
      .single();

    if (requestError) {
      console.error('Request error:', JSON.stringify(requestError, null, 2));
      return new Response(
        JSON.stringify({ 
          error: {
            message: requestError.message,
            details: requestError.details,
            code: requestError.code
          }
        }),
        { status: 500 }
      );
    }

    // Create the invoice payload with proper handling of company name
    const invoicePayload = {
      request_id: requestData.id,
      branch: requestData.closest_branch,
      client_name: `${requestData.first_name} ${requestData.last_name}`,
      client_email: requestData.email,
      company_name: requestData.company_name,
      due_date: requestData.event_date,
      amount: 500.0,
      balance: 500.0,
      status: "pending",
      payment_terms: "Due on receipt",
    };

    // Log the invoice payload before insertion for debugging
    console.log("Invoice payload:", invoicePayload);

    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .insert(invoicePayload)
      .select()
      .single();

    if (invoiceError) {
      console.error("❌ Invoice insert error:", JSON.stringify(invoiceError, null, 2));
    
      return new Response(
        JSON.stringify({
          error: {
            message: invoiceError?.message ?? "Unknown error",
            details: invoiceError?.details ?? null,
            hint: invoiceError?.hint ?? null,
            code: invoiceError?.code ?? null,
          },
        }),
        { status: 500 }
      );
    }
    

    return new Response(JSON.stringify({ data: invoiceData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Caught error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
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