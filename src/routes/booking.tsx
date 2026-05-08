import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Wine } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Reserve a Tasting — Maison Noir" }, { name: "description", content: "Book a private tasting or vineyard tour at the Maison Noir estate." }] }),
  component: Booking,
});

const slots = ["10:00", "12:00", "14:00", "16:00", "18:00"];

function Booking() {
  const { user } = useAuth();
  const [type, setType] = useState<"tasting" | "tour">("tasting");
  const [form, setForm] = useState({ date: "", time: slots[0], guests: 2, name: "", email: user?.email ?? "", notes: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user?.id ?? null,
      guest_name: form.name,
      guest_email: form.email,
      type,
      date: form.date,
      time: form.time,
      guests: form.guests,
      notes: form.notes || null,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setDone(true);
  };

  if (done) {
    return (
      <div className="container-luxe py-32 text-center">
        <CalendarCheck className="h-12 w-12 text-gold mx-auto" />
        <h1 className="font-serif text-4xl mt-6">Reservation requested</h1>
        <p className="mt-3 text-foreground/70 max-w-lg mx-auto">A member of our team will confirm your visit by email within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="container-luxe py-16 max-w-3xl">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Visit the Estate</p>
      <h1 className="font-serif text-5xl mt-3">Reserve your visit</h1>
      <p className="mt-4 text-foreground/70">Private tastings and guided vineyard tours, limited to twelve guests.</p>

      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="mt-12 glass rounded-lg p-8 space-y-6"
      >
        <div className="grid grid-cols-2 gap-3">
          {(["tasting", "tour"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`p-5 rounded-lg border-2 transition text-left ${type === t ? "border-gold bg-white/5" : "border-white/10"}`}
            >
              <Wine className="h-5 w-5 text-gold mb-2" />
              <p className="font-serif text-lg capitalize">{t === "tasting" ? "Cellar Tasting" : "Vineyard Tour"}</p>
              <p className="text-xs text-foreground/70 mt-1">{t === "tasting" ? "90 min, 6 wines paired with bites" : "2 hours through the estate vineyards"}</p>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Date">
            <input required type="date" min={new Date().toISOString().slice(0,10)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />
          </Field>
          <Field label="Time">
            <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm">
              {slots.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Guests">
            <input required type="number" min={1} max={12} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Your Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />
          </Field>
          <Field label="Email">
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />
        </Field>

        <button disabled={loading} className="px-8 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md disabled:opacity-50">
          {loading ? "Reserving…" : "Request Reservation"}
        </button>
      </motion.form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-foreground/60">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
