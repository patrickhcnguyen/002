import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
});

const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:8080/';

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
    const { amount, client_email, invoiceId, admin_email } = await req.json();
    console.log('💳 Creating payment for:', { amount, client_email, invoiceId, admin_email });
    
    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          invoice_id: invoiceId,
          admin_email: admin_email
        }
      },
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: 'Event Staff Services',
          },
        },
        quantity: 1
      }],
      mode: 'payment',
      customer_email: client_email,
      success_url: siteUrl,
      cancel_url: siteUrl,
    });

    console.log('✅ Checkout session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});