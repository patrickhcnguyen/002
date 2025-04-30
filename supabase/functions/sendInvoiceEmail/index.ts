// supabase/functions/sendInvoiceEmail/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      invoiceId, 
      paymentUrl, 
      adminEmail, 
      adminName,
      subtotal,
      serviceFee,
      transactionFee,
      fullAmount,
      staff_requirements_with_rates 
    } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();
      
    if (error) throw error;

    // Create email with the data we have
    const formData = new FormData();
    formData.append('from', 'Evershift Invoicing <invoicing@evershift.co>');
    formData.append('to', invoice.client_email);
    formData.append('subject', `Invoice #${invoice.request_id} from Evershift`);
    
    // Update invoice with latest calculations before generating email
    const updatedInvoice = {
      ...invoice,
      subtotal,
      service_fee: serviceFee,
      transaction_fee: transactionFee,
      amount: fullAmount,
      staff_requirements_with_rates
    };
    
    formData.append('html', generateEmailHtml(updatedInvoice, paymentUrl));
    
    // Set Reply-To header using the admin info from the frontend
    if (adminEmail && adminName) {
      formData.append('h:Reply-To', `${adminName} <${adminEmail}>`);
    } else {
      // Fallback to default
      formData.append('h:Reply-To', 'Evershift Support <support@evershift.co>');
    }
    
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

function generateEmailHtml(invoice: any, paymentUrl: string) {
  const staffRows = invoice.staff_requirements_with_rates.map((req: any) => `
    <tr>
      <td>
        <strong>${req.position}</strong><br>
        <small>${new Date(req.date).toLocaleDateString()} (${req.startTime} - ${req.endTime})</small>
      </td>
      <td class="amount">${req.count}</td>
      <td class="amount">$${req.rate} / hr</td>
      <td class="amount">$${req.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .invoice-details { margin: 20px 0; }
        .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .invoice-table th, .invoice-table td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
        .invoice-table th { background-color: #f8f8f8; }
        .amount { text-align: right; }
        .total { font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
        .payment-button { 
          display: block; 
          text-align: center; 
          padding: 15px; 
          background: #0070f3; 
          color: #ffffff !important; /* Force white text */
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0;
        }
        /* Ensure link stays white even after being visited */
        .payment-button:visited,
        .payment-button:hover,
        .payment-button:active {
          color: #ffffff !important;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice from Evershift</h1>
          <p>Request #${invoice.request_id}</p>
          <p>Branch: ${invoice.branch}</p>
        </div>
        
        <div class="invoice-details">
          <p><strong>To:</strong> ${invoice.company_name ? invoice.company_name : invoice.client_name}</p>
          <p><strong>Email:</strong> ${invoice.client_email}</p>
          <p><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>
          <p><strong>Payment Terms:</strong> ${invoice.payment_terms || 'Due on receipt'}</p>
          ${invoice.po_number ? `<p><strong>PO Number:</strong> ${invoice.po_number}</p>` : ''}
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="amount">Quantity</th>
              <th class="amount">Rate</th>
              <th class="amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${staffRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="amount">Subtotal:</td>
              <td class="amount">${formatCurrency(invoice.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" class="amount">Service Fee:</td>
              <td class="amount">${formatCurrency(invoice.service_fee)}</td>
            </tr>
            <tr>
              <td colspan="3" class="amount">Transaction Fee (3.5%):</td>
              <td class="amount">${formatCurrency(invoice.transaction_fee)}</td>
            </tr>
            <tr class="total">
              <td colspan="3" class="amount">Total Amount:</td>
              <td class="amount">${formatCurrency(invoice.amount)}</td>
            </tr>
            <tr class="total">
              <td colspan="3" class="amount">Balance Due:</td>
              <td class="amount">${formatCurrency(invoice.balance)}</td>
            </tr>
          </tfoot>
        </table>
        
        ${invoice.notes ? `
        <div class="notes">
          <h3>Notes</h3>
          <p>${invoice.notes}</p>
        </div>` : ''}
        
        ${paymentUrl ? `
        <a href="${paymentUrl}" class="payment-button">
          Pay Invoice Now
        </a>
        ` : ''}
        
        <div class="footer">
          <p>If you have any questions about this invoice, please contact us at support@evershift.co</p>
          <p>Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}