import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

interface InboundAttachment {
  filename?: string;
  content_type?: string;
  size?: number;
  url?: string;
  content?: string;
}

interface InboundEmailPayload {
  from?: string;
  from_name?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: InboundAttachment[];
  in_reply_to?: string;
  thread_id?: string;
  source?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const body: InboundEmailPayload = await req.json();

    if (!body.from || !body.to) {
      return new Response(
        JSON.stringify({ error: "From and to are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const attachments = (body.attachments ?? []).map((a) => ({
      filename: a.filename ?? "attachment",
      url: a.url ?? "",
      content_type: a.content_type ?? "application/octet-stream",
      size: a.size ?? 0,
    }));

    const { error } = await supabase.from("admin_emails").insert({
      direction: "inbound",
      from_email: body.from,
      from_name: body.from_name ?? null,
      to_email: body.to,
      subject: body.subject ?? "",
      body_text: body.text ?? null,
      body_html: body.html ?? null,
      attachments,
      status: "unread",
      in_reply_to: null,
      thread_id: body.thread_id ?? crypto.randomUUID(),
      source: body.source ?? "resend_inbound",
    });

    if (error) {
      console.error("Database insert error:", error.message);
      return new Response(
        JSON.stringify({ error: "Could not save inbound email." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Inbound email stored." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
