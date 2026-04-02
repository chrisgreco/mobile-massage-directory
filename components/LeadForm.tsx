"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function LeadForm({
  city,
  state,
}: {
  city?: string;
  state?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          city: data.get("city"),
          state: data.get("state"),
          massage_type: data.get("massage_type"),
          session_preference: data.get("session_preference"),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-sage/30 bg-sage/10 p-8 text-center">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-sage" />
        <h3 className="mb-1 font-display text-lg font-bold text-cream">
          Request Sent!
        </h3>
        <p className="text-sm text-cream/70">
          Licensed therapists will reach out within 24 hours with free quotes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-sage/20 bg-sage/5 p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-cream">
        Get 3 Free Quotes
      </h3>
      <p className="mb-5 text-sm text-cream/60">
        Compare prices from top-rated mobile massage therapists near you.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="input"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="input"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="city"
            type="text"
            required
            placeholder="City"
            defaultValue={city || ""}
            className="input"
          />
          <input
            name="state"
            type="text"
            required
            placeholder="State"
            defaultValue={state || ""}
            className="input"
          />
        </div>
        <select name="massage_type" required className="input">
          <option value="">Massage type</option>
          <option value="swedish">Swedish</option>
          <option value="deep_tissue">Deep Tissue</option>
          <option value="sports">Sports Massage</option>
          <option value="prenatal">Prenatal</option>
          <option value="hot_stone">Hot Stone</option>
          <option value="couples">Couples</option>
          <option value="lymphatic">Lymphatic Drainage</option>
          <option value="trigger_point">Trigger Point</option>
        </select>
        <select name="session_preference" required className="input">
          <option value="">Session length</option>
          <option value="60">60 minutes</option>
          <option value="75">75 minutes</option>
          <option value="90">90 minutes</option>
          <option value="120">120 minutes</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full gap-2 py-3.5"
        >
          <Send className="h-4 w-4" />
          {loading ? "Sending..." : "Get Free Quotes"}
        </button>
      </form>
    </div>
  );
}
