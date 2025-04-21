import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  adminType: string;
  permissions: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, adminType, permissions } = await req.json() as InvitationRequest;
    
    // Create magic link for the user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (inviteError) throw inviteError;

    // Send invitation email using Mailgun
    const formData = new FormData();
    formData.append('from', 'Admin System <admin@yourdomain.com>');
    formData.append('to', email);
    formData.append('subject', "You've been invited as an Admin");
    formData.append('html', `
      <h2>Welcome to the Admin Team!</h2>
      <p>You've been invited as a ${adminType} with the following permissions:</p>
      <ul>
        ${Object.entries(permissions)
          .filter(([_, value]) => value === true)
          .map(([key]) => `<li>${key}</li>`)
          .join('')}
      </ul>
      <p>Click the link below to set up your account:</p>
      <p><a href="${inviteData?.user?.confirmation_sent_at}">Accept Invitation</a></p>
    `);

    const res = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);