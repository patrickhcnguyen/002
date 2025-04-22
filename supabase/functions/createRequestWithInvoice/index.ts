import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
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
    

    const invoicePayload = {
      request_id: requestData.id,
      branch: requestData.closest_branch,
      client_name: `${requestData.first_name} ${requestData.last_name}`,
      due_date: requestData.event_date,
      amount: 500.0,
      balance: 500.0,
      status: "pending",
    };

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
    });
  } catch (error) {
    console.error('Caught error:', error);
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message,
          stack: error.stack
        }
      }),
      { status: 500 }
    );
  }
});

/**
supabase functions deploy createRequestWithInvoice
curl -i -X POST 'http://localhost:54321/functions/v1/createRequestWithInvoice' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
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