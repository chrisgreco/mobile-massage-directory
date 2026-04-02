"use client";

import { useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, Star, Trash2, Clock, Users, BarChart3 } from "lucide-react";

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
  );
}

export default function AdminPage() {
  const [supabase] = useState(() => getClient());
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved" | "leads" | "stats">("pending");
  const [listings, setListings] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, cities: 0, newThisMonth: 0, totalLeads: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => { if (session) loadData(); }, [session, tab]);

  async function loadData() {
    if (tab === "pending") {
      const { data } = await supabase.from("mm_listings").select("*").eq("status", "pending").order("created_at", { ascending: false });
      setListings(data || []);
    } else if (tab === "approved") {
      const { data } = await supabase.from("mm_listings").select("*").eq("status", "approved").order("featured", { ascending: false }).order("created_at", { ascending: false });
      setListings(data || []);
    } else if (tab === "leads") {
      const { data } = await supabase.from("mm_leads").select("*").order("created_at", { ascending: false });
      setLeads(data || []);
    } else {
      const { count: total } = await supabase.from("mm_listings").select("*", { count: "exact", head: true }).eq("status", "approved");
      const { data: cityData } = await supabase.from("mm_listings").select("city").eq("status", "approved");
      const uniqueCities = new Set(cityData?.map(d => d.city));
      const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1);
      const { count: newCount } = await supabase.from("mm_listings").select("*", { count: "exact", head: true }).gte("created_at", monthAgo.toISOString());
      const { count: leadCount } = await supabase.from("mm_leads").select("*", { count: "exact", head: true });
      setStats({ total: total || 0, cities: uniqueCities.size, newThisMonth: newCount || 0, totalLeads: leadCount || 0 });
    }
  }

  async function updateStatus(id: string, status: string) { await supabase.from("mm_listings").update({ status }).eq("id", id); loadData(); }
  async function toggleFeatured(id: string, current: boolean) { await supabase.from("mm_listings").update({ featured: !current }).eq("id", id); loadData(); }
  async function deleteListing(id: string) { if (confirm("Delete this listing?")) { await supabase.from("mm_listings").delete().eq("id", id); loadData(); } }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: data.get("email") as string, password: data.get("password") as string });
    if (error) alert(error.message);
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-sage border-t-transparent" /></div>;

  if (!session) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="mb-6 text-center font-display text-2xl font-bold">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="input" />
          <input name="password" type="password" required placeholder="Password" className="input" />
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-white/40 hover:text-red-400">Sign Out</button>
      </div>
      <div className="mb-6 flex gap-1 rounded-xl bg-white/5 p-1">
        {([["pending", "Pending", Clock], ["approved", "Approved", CheckCircle], ["leads", "Leads", Users], ["stats", "Stats", BarChart3]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${tab === key ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>
      {tab === "stats" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{ l: "Total Listings", v: stats.total }, { l: "Cities", v: stats.cities }, { l: "New This Month", v: stats.newThisMonth }, { l: "Total Leads", v: stats.totalLeads }].map(s => (
            <div key={s.l} className="rounded-2xl bg-white/5 p-6"><p className="text-sm text-white/40">{s.l}</p><p className="text-3xl font-bold">{s.v}</p></div>
          ))}
        </div>
      )}
      {(tab === "pending" || tab === "approved") && (
        <div className="space-y-3">
          {listings.length === 0 ? <p className="py-12 text-center text-white/40">No {tab} listings.</p> : listings.map(l => (
            <div key={l.id} className="flex flex-col gap-4 rounded-2xl bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div><span className="font-bold">{l.business_name}</span>{l.featured && <span className="ml-2 rounded-full bg-sage/20 px-2 py-0.5 text-xs text-sage">Featured</span>}<p className="text-sm text-white/40">{l.city}, {l.state_abbr} · {l.email}</p></div>
              <div className="flex items-center gap-2">
                {tab === "pending" && (<><button onClick={() => updateStatus(l.id, "approved")} className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20"><CheckCircle className="mr-1 inline h-3.5 w-3.5" />Approve</button><button onClick={() => updateStatus(l.id, "rejected")} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"><XCircle className="mr-1 inline h-3.5 w-3.5" />Reject</button></>)}
                <button onClick={() => toggleFeatured(l.id, l.featured)} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/10"><Star className="mr-1 inline h-3.5 w-3.5" />{l.featured ? "Unfeature" : "Feature"}</button>
                <button onClick={() => deleteListing(l.id)} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "leads" && (
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="border-b border-white/10 text-left text-sm">{["Name","Email","City","Modality","Date"].map(h => <th key={h} className="pb-3 font-semibold text-white/40">{h}</th>)}</tr></thead>
            <tbody>{leads.map(l => <tr key={l.id} className="border-b border-white/5 text-sm"><td className="py-3 font-medium">{l.name}</td><td className="py-3 text-white/60">{l.email}</td><td className="py-3 text-white/60">{l.city}, {l.state}</td><td className="py-3 text-white/60">{l.modality || "—"}</td><td className="py-3 text-white/40">{new Date(l.created_at).toLocaleDateString()}</td></tr>)}</tbody>
          </table>
          {leads.length === 0 && <p className="py-12 text-center text-white/40">No leads yet.</p>}
        </div>
      )}
    </div>
  );
}
