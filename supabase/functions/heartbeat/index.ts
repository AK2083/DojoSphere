import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

serve(() => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString()
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})
