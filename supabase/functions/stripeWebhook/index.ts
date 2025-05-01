import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { Stripe } from "https://esm.sh/stripe@14.0.0"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
  // apiVersion: '2024-11-20'
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, x-requested-with',
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Webhook received')
    
    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No signature provided')
    }

    const body = await req.text()
    console.log('Request body:', body)

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!
    )

    console.log('Event type:', event.type)
    console.log('Event data:', event.data.object)

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      console.log('Payment Intent:', paymentIntent)
      console.log('Metadata:', paymentIntent.metadata)

      // Connect to Supabase
      const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
      
      // Update invoice status
      const { data: invoice, error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          amount_paid: (paymentIntent.amount / 100).toFixed(2),
          balance: 0,
          payment_intent_id: paymentIntent.id
        })
        .eq('id', paymentIntent.metadata.invoice_id)
        .select('*, client_name, client_email')
        .single()

      console.log('Update result:', { data: invoice, error })
      
      if (error) {
        throw error
      }

      // Now call sendAdminNotification with the correct parameters
      try {
        console.log('Sending admin notification with metadata:', paymentIntent.metadata);
        
        const response = await fetch('https://huydudorftiektexxpei.supabase.co/functions/v1/sendAdminPaymentEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({
            invoice_id: paymentIntent.metadata.invoice_id,
            amount_paid: (paymentIntent.amount / 100),
            admin_email: paymentIntent.metadata.admin_email,
            client_name: invoice.client_name,
            company_name: invoice.company_name
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to send admin notification email:', errorText);
        } else {
          console.log('Admin notification email sent successfully');
        }
      } catch (error) {
        console.error('Error sending admin notification:', error)
      }

      console.log(`Invoice ${paymentIntent.metadata.invoice_id} marked as paid`)
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

      console.log(`Invoice ${paymentIntent.metadata.invoice_id} payment failed`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})


