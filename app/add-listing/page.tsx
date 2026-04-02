"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

const modalityOptions = [
  { value: "swedish", label: "Swedish Massage" },
  { value: "deep_tissue", label: "Deep Tissue" },
  { value: "sports", label: "Sports Massage" },
  { value: "prenatal", label: "Prenatal" },
  { value: "hot_stone", label: "Hot Stone" },
  { value: "couples", label: "Couples Massage" },
  { value: "lymphatic", label: "Lymphatic Drainage" },
  { value: "trigger_point", label: "Trigger Point" },
];

export default function AddListingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: data.get("business_name"), owner_name: data.get("owner_name"),
          email: data.get("email"), phone: data.get("phone"), website: data.get("website"),
          description: data.get("description"), city: data.get("city"), state: data.get("state"),
          state_abbr: data.get("state_abbr"), cities_served: data.get("cities_served"),
          modalities: selectedModalities, price_range: data.get("price_range"),
          is_mobile: data.get("is_mobile"), licensed: data.get("licensed"), insured: data.get("insured"),
        }),
      });
      if (res.ok) setSubmitted(true);
      else { const err = await res.json(); setError(err.error || "Something went wrong."); }
    } catch { setError("Network error."); } finally { setLoading(false); }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-3 font-display text-3xl font-bold">Listing Submitted!</h1>
        <p className="text-white/60">We&apos;ll review and approve your listing within 2 business days.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 font-display text-3xl font-bold">List Your Massage Business</h1>
      <p className="mb-8 text-white/50">Get found by clients searching for mobile massage in your area.</p>
      {error && <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium">Business Name *</label><input name="business_name" required className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium">Owner Name</label><input name="owner_name" className="input" /></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium">Email *</label><input name="email" type="email" required className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium">Phone</label><input name="phone" type="tel" className="input" /></div>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium">Website</label><input name="website" type="url" className="input" /></div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div><label className="mb-1.5 block text-sm font-medium">City *</label><input name="city" required className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium">State *</label><input name="state" required className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium">State Abbr *</label><input name="state_abbr" required maxLength={2} className="input uppercase" /></div>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium">Cities Served</label><input name="cities_served" className="input" placeholder="Comma-separated" /></div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Modalities *</label>
          <div className="grid grid-cols-2 gap-2">
            {modalityOptions.map(m => (
              <label key={m.value} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm has-[:checked]:border-sage has-[:checked]:bg-sage/10">
                <input type="checkbox" value={m.value} checked={selectedModalities.includes(m.value)}
                  onChange={e => e.target.checked ? setSelectedModalities([...selectedModalities, m.value]) : setSelectedModalities(selectedModalities.filter(v => v !== m.value))}
                  className="h-4 w-4 rounded border-white/20 text-sage focus:ring-sage" />
                {m.label}
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium">Price Range *</label>
            <select name="price_range" required className="input"><option value="">Select...</option><option value="budget">$ Budget</option><option value="mid">$$ Mid-Range</option><option value="premium">$$$ Premium</option></select>
          </div>
          <div className="space-y-2 pt-6">
            <label className="flex items-center gap-2"><input type="checkbox" name="is_mobile" value="true" defaultChecked className="h-4 w-4 rounded" /><span className="text-sm">Mobile Service</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="licensed" value="true" defaultChecked className="h-4 w-4 rounded" /><span className="text-sm">Licensed</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" name="insured" value="true" defaultChecked className="h-4 w-4 rounded" /><span className="text-sm">Insured</span></label>
          </div>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium">Description *</label><textarea name="description" required minLength={50} maxLength={500} rows={4} className="input resize-none" /></div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">{loading ? "Submitting..." : "Submit Listing"}</button>
      </form>
    </div>
  );
}
