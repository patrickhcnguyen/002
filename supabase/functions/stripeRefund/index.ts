import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { Stripe } from "https://esm.sh/stripe@14.0.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2025-03-31.basil',
})

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }
  // refund doesn't need to check if its paid because frontend already checks that
  try {
    const { payment_intent_id, amount } = await req.json();
    if (!payment_intent_id) {
      return new Response('Missing payment_intent_id', { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const refund = await stripe.refunds.create({
      payment_intent: payment_intent_id,
      amount: amount,
    });

    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        amount_paid: 0,
        balance: (amount / 100),
      })
      .eq("payment_intent_id", payment_intent_id)

    if (updateError) {
      throw updateError
    }

    return new Response(JSON.stringify({ success: true, refund }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error: any) {
    console.error('Refund error:', error?.raw ?? error?.message ?? error);
    return new Response(JSON.stringify({ error: error?.raw?.message ?? error?.message ?? "Unknown error" }), {
      headers: corsHeaders,
      status: 500,
    });
  }
})
