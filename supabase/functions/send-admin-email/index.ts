import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const FROM_EMAIL = "In Him Daily <onboarding@resend.dev>";

async function getResendApiKey(): Promise<string> {
  if (!supabaseUrl || !supabaseServiceKey) return "";
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", "RESEND_API_KEY")
    .maybeSingle();
  if (error || !data) return "";
  return data.value;
}

interface RequestBody {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();

    if (!body.to || !body.subject || !body.html) {
      return new Response(
        JSON.stringify({ error: "To, subject, and html are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const RESEND_API_KEY = await getResendApiKey();

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service is not configured. Add your Resend API key in Email Settings." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [body.to],
        subject: body.subject,
        html: body.html,
        reply_to: body.replyTo ? [body.replyTo] : undefined,
      }),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.json().catch(() => null);
      const message = errorBody?.message ?? `Email service returned ${emailResponse.status}`;
      return new Response(
        JSON.stringify({ error: message }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
