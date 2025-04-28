// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs  
// stripe webhook to check if payment was successful, then updates the invoice status
// use ngrok to test on port 54321 https://a84e-2601-204-c282-790-501c-20fd-62a7-5b37.ngrok-free.app
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { Stripe } from "https://esm.sh/stripe@14.0.0"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-11-20'
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, x-requested-with',
}

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No signature provided')
    }

    const body = await req.text()

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!
    )

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object

      // Connect to Supabase
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          amount_paid: paymentIntent.amount / 100,
          payment_date: new Date().toISOString(),
          balance: 0
        })
        .eq('id', paymentIntent.metadata.invoice_id) 

      if (error) {
        throw error
      }

      console.log(`✅ Invoice ${paymentIntent.metadata.invoice_id} marked as paid`)
    }

    if (event.type === 'payment_intent.failed') {
      const paymentIntent = event.data.object

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'payment_failed'
        })
        .eq('id', paymentIntent.metadata.invoice_id)

      if (error) {
        throw error
      }

      console.log(`❌ Invoice ${paymentIntent.metadata.invoice_id} payment failed`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('❌ Error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripeWebhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
