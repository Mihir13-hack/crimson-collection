import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Maison Noir" }, { name: "description", content: "Reach the Maison Noir estate in Saint-Émilion, France." }] }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("Please fill all fields");
    toast.success("Message received — we'll respond within 24 hours");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div className="container-luxe py-16 grid lg:grid-cols-2 gap-16">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Reach Us</p>
        <h1 className="font-serif text-5xl mt-3">Contact the Estate</h1>
        <p className="mt-4 text-foreground/70 max-w-md">For private tastings, trade enquiries, or simply to say hello.</p>
        <div className="mt-10 space-y-5">
          <Item icon={MapPin} title="Domaine de Maison Noir" text="12 Route des Vignes, Saint-Émilion 33330, France" />
          <Item icon={Phone} title="Cellar Office" text="+33 5 57 24 00 00" />
          <Item icon={Mail} title="Hospitality" text="visit@maison-noir.example" />
        </div>
        <div className="mt-10 rounded-lg overflow-hidden border border-white/10">
          <iframe
            title="Map"
            src="https://www.google.com/maps?q=Saint-Emilion%2C+France&output=embed"
            className="w-full h-72 grayscale contrast-125"
            loading="lazy"
          />
        </div>
      </div>
      <form onSubmit={submit} className="glass rounded-lg p-8 h-fit space-y-5">
        <h3 className="font-serif text-2xl">Send a message</h3>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your email" className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
        <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message" className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
        <button className="w-full px-6 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md hover:shadow-gold transition">Send Message</button>
      </form>
    </div>
  );
}

function Item({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <Icon className="h-5 w-5 text-gold mt-0.5" />
      <div>
        <p className="text-xs uppercase tracking-widest text-gold/80">{title}</p>
        <p className="text-sm text-foreground/85 mt-1">{text}</p>
      </div>
    </div>
  );
}
