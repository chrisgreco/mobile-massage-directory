import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "re_placeholder");
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return createClient("https://placeholder.supabase.co", "placeholder");
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, city, state, modality, session_length, reason } = body;
    if (!name || !email || !city || !state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const supabase = getServiceClient();
    const { error } = await supabase.from("mm_leads").insert({ name, email, city, state, modality, session_length, reason });
    if (error) return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });

    const { data: therapists } = await supabase
      .from("mm_listings").select("email, business_name")
      .eq("status", "approved").eq("featured", true).eq("city", city).limit(3);

    if (therapists?.length) {
      const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "mobilemassage.com";
      for (const t of therapists) {
        if (t.email) {
          await getResend().emails.send({
            from: `leads@${domain}`, to: t.email,
            subject: `New Lead: ${name} in ${city}, ${state}`,
            html: `<h2>New Quote Request</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Location:</strong> ${city}, ${state}</p><p><strong>Modality:</strong> ${modality || "Not specified"}</p><p><strong>Session:</strong> ${session_length || "Not specified"} min</p>`,
          });
        }
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
