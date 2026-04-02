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
    const { business_name, owner_name, email, phone, website, description, city, state, state_abbr, cities_served, modalities, price_range, is_mobile, licensed, insured } = body;
    if (!business_name || !email || !city || !state || !state_abbr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const slug = `${business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${city.toLowerCase().replace(/\s+/g, "-")}-${state_abbr.toLowerCase()}`;
    const supabase = getServiceClient();
    const { error } = await supabase.from("mm_listings").insert({
      slug, business_name, owner_name, email, phone, website, description,
      city, state, state_abbr,
      cities_served: cities_served ? cities_served.split(",").map((c: string) => c.trim()) : [],
      modalities: modalities || [], price_range,
      is_mobile: is_mobile === "true" || is_mobile === true,
      licensed: licensed === "true" || licensed === true,
      insured: insured === "true" || insured === true,
      status: "pending", photos: [],
    });
    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "A listing with this name already exists" }, { status: 409 });
      return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
    }
    const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "mobilemassage.com";
    if (email) {
      await getResend().emails.send({
        from: `noreply@${domain}`, to: email,
        subject: `Listing Submitted: ${business_name}`,
        html: `<h2>Your Listing Has Been Submitted</h2><p>Hi ${owner_name || "there"},</p><p>Your listing for <strong>${business_name}</strong> in ${city}, ${state} is pending review. We'll notify you once it's approved.</p>`,
      });
    }
    return NextResponse.json({ success: true, slug });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
