import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("Could not subscribe");
    } else {
      toast.success("Welcome to the cellar");
      setEmail("");
    }
  };

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-gradient-to-b from-background to-black">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl text-gradient-gold mb-3">Maison Noir</div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Crafted in our limestone cellars since 1872. A family estate dedicated to wines of
            quiet power, cellared with patience and released only when ready.
          </p>
          <form onSubmit={subscribe} className="mt-8 flex max-w-sm gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-gold/60 transition"
            />
            <button
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-widest font-medium rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              Join
            </button>
          </form>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link to="/shop" className="hover:text-gold transition">Wine Cellar</Link></li>
            <li><Link to="/story" className="hover:text-gold transition">Our Story</Link></li>
            <li><Link to="/booking" className="hover:text-gold transition">Visit Estate</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition">Journal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Visit</h4>
          <p className="text-sm text-foreground/70 leading-relaxed">
            Domaine de Maison Noir<br />
            12 Route des Vignes<br />
            Saint-Émilion, France<br />
            +33 5 57 24 00 00
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-luxe py-6 flex flex-col sm:flex-row justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Maison Noir. Drink responsibly.</span>
          <span>Crafted with patience.</span>
        </div>
      </div>
    </footer>
  );
}
