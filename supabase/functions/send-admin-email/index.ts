import { createClient } from "npm:@supabase/supabase-js@2.58.0";
import { Resend } from "npm:resend@6.25.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const DEFAULT_FROM_EMAIL = "In Him Daily <onboarding@resend.dev>";

async function getConfig(supabase: ReturnType<typeof createClient>, key: string): Promise<string> {
  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return "";
  return data.value as string;
}

interface AttachmentMeta {
  filename: string;
  url: string;
  content_type: string;
  size: number;
}

interface RequestBody {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: AttachmentMeta[];
  in_reply_to?: string;
  thread_id?: string;
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const RESEND_API_KEY = await getConfig(supabase, "RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service is not configured. Add your Resend API key in Email Settings." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const FROM_EMAIL = (await getConfig(supabase, "RESEND_FROM_EMAIL")) || DEFAULT_FROM_EMAIL;

    const resend = new Resend(RESEND_API_KEY);

    const emailParams: Parameters<typeof resend.emails.send>[0] = {
      from: FROM_EMAIL,
      to: body.to,
      subject: body.subject,
      html: body.html,
    };

    if (body.replyTo) {
      emailParams.reply_to = body.replyTo;
    }

    if (body.attachments && body.attachments.length > 0) {
      emailParams.attachments = body.attachments.map((a) => ({
        filename: a.filename,
        path: a.url,
      }));
    }

    const { error: sendError } = await resend.emails.send(emailParams);

    if (sendError) {
      return new Response(
        JSON.stringify({ error: sendError.message ?? "Email service returned an error." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Save outbound email to admin_emails for the inbox trail
    if (supabaseUrl && supabaseServiceKey) {
      await supabase.from("admin_emails").insert({
        direction: "outbound",
        from_email: FROM_EMAIL,
        from_name: "In Him Daily",
        to_email: body.to,
        subject: body.subject,
        body_text: body.text ?? null,
        body_html: body.html,
        attachments: body.attachments ?? [],
        status: "sent",
        in_reply_to: body.in_reply_to ?? null,
        thread_id: body.thread_id ?? null,
        source: "admin_compose",
      });
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
