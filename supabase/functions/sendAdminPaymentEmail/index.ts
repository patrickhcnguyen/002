import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { admin_email, invoice_id, amount_paid, client_name, company_name } = await req.json()

    if (!admin_email || typeof admin_email !== 'string' || !admin_email.includes('@')) {
      throw new Error(`Invalid admin email: ${admin_email}`);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoice_id)
      .single();

    if (error) throw error;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    const formData = new FormData();
    formData.append('from', 'Evershift Payments <payments@evershift.co>');
    formData.append('to', admin_email);
    formData.append('subject', `Payment Received - Invoice #${invoice.request_id}`);
    formData.append('html', `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { margin-bottom: 20px; }
          .details { background: #f9f9f9; padding: 15px; border-radius: 5px; }
          .amount { font-size: 24px; color: #0070f3; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Payment Received! 🎉</h2>
          </div>
          
          <div class="details">
            <p>A payment has been received for Invoice #${invoice.request_id}</p>
            <p><strong>Client:</strong> ${company_name || client_name}</p>
            <p><strong>Amount Paid:</strong> <span class="amount">${formatCurrency(amount_paid)}</span></p>
            <p><strong>Invoice Total:</strong> ${formatCurrency(invoice.amount)}</p>
            <p><strong>Remaining Balance:</strong> ${formatCurrency(invoice.amount - amount_paid)}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <p>The payment has been processed successfully and the invoice has been updated.</p>
            ${
              invoice.amount - amount_paid > 0 
                ? `<p>Note: This is a partial payment. The remaining balance is ${formatCurrency(invoice.amount - amount_paid)}.</p>`
                : `<p>The invoice has been paid in full.</p>`
            }
          </div>
          
          <div style="margin-top: 30px; font-size: 14px; color: #666;">
            <p>You received this email because you are the admin who sent the invoice.</p>
          </div>
        </div>
      </body>
      </html>
    `);

    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN') || '';
    
    const mailgunResponse = await fetch(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`api:${Deno.env.get('MAILGUN_API_KEY')}`)}`
        },
        body: formData
      }
    );
    
    if (!mailgunResponse.ok) {
      const errorText = await mailgunResponse.text();
      console.error('Mailgun error:', errorText);
      throw new Error(`Mailgun error: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
});
