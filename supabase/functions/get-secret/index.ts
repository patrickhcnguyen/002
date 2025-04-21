import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName } = await req.json()
    console.log('Request received for secret:', secretName)

    // Get the secret value from environment variables
    const secretValue = Deno.env.get(secretName)
    console.log('Secret exists:', !!secretValue)

    if (!secretValue) {
      console.error(`Secret ${secretName} not found in environment`)
      return new Response(
        JSON.stringify({
          error: `Secret ${secretName} not found`,
          available_secrets: Object.keys(Deno.env.toObject())
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Return the secret value
    return new Response(
      JSON.stringify({ [secretName]: secretValue }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in get-secret function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})