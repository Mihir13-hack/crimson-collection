import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Grape, ArrowUp, Award, Leaf, ShieldCheck, ArrowRight } from "lucide-react";
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-12 bg-background text-foreground overflow-hidden">
      {/* Decorative Top Border & Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wine/60 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-wine/30 blur-xl opacity-70 z-10" />

      {/* Main Background with Center-to-Bottom Radial Gradient & Watermark */}
      <div className="bg-gradient-to-b from-background via-wine/5 to-[#050505] relative">
        
        {/* Subtle Watermark */}
        <div className="absolute right-0 bottom-1/4 pointer-events-none opacity-[0.03] translate-x-1/4">
          <Grape className="w-[800px] h-[800px] text-white" strokeWidth={0.2} />
        </div>

        {/* Center-to-bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-wine/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-luxe relative py-10 z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* LEFT: Brand & Address (Asymmetrical) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl text-gradient-gold tracking-tight mb-3">Maison Noir</h2>
                <p className="text-sm text-foreground/70 max-w-sm leading-relaxed italic">
                  Crafted in our limestone cellars since 1872. A family estate dedicated to wines of quiet power and patience.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-foreground/60 leading-relaxed font-serif italic">
                  Domaine de Maison Noir · 12 Route des Vignes · Saint-Émilion, France
                </p>
                <div className="flex gap-3">
                  <a href="#" aria-label="Instagram" className="p-2 rounded-full glass hover:text-gold hover:border-gold/40 transition-all duration-300"><Instagram className="h-4 w-4" /></a>
                  <a href="#" aria-label="Facebook" className="p-2 rounded-full glass hover:text-gold hover:border-gold/40 transition-all duration-300"><Facebook className="h-4 w-4" /></a>
                  <a href="#" aria-label="Twitter" className="p-2 rounded-full glass hover:text-gold hover:border-gold/40 transition-all duration-300"><Twitter className="h-4 w-4" /></a>
                </div>
              </div>
            </div>

            {/* CENTER: Navigation & Journal */}
            <div className="lg:col-span-4 grid sm:grid-cols-2 gap-12">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold/80 mb-8 font-medium">Explore</h4>
                <ul className="space-y-5 text-sm text-foreground/70">
                  <li><Link to="/shop" search={{ category: "all", sort: "new" }} className="gold-underline hover:text-gold transition-colors duration-300 inline-flex">Wine Cellar</Link></li>
                  <li><Link to="/story" className="gold-underline hover:text-gold transition-colors duration-300 inline-flex">Our Story</Link></li>
                  <li><Link to="/booking" className="gold-underline hover:text-gold transition-colors duration-300 inline-flex">Visit Estate</Link></li>
                  <li><Link to="/contact" className="gold-underline hover:text-gold transition-colors duration-300 inline-flex">Contact</Link></li>
                </ul>
              </div>
              
              {/* Social Proof / Journal */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold/80 mb-8 font-medium">From the Journal</h4>
                <Link to="/blog" className="group block">
                  <div className="relative aspect-video rounded-md overflow-hidden mb-4 shadow-md border border-white/10">
                    <img src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=400" alt="Journal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <h5 className="font-serif text-sm text-foreground/90 group-hover:text-gold transition-colors leading-snug">The 2015 Vintage: A Retrospective</h5>
                  <p className="text-[10px] uppercase tracking-widest text-gold/60 mt-2 flex items-center gap-1 group-hover:text-gold transition-colors">
                    Read article <ArrowRight className="h-3 w-3" />
                  </p>
                </Link>
              </div>
            </div>

            {/* RIGHT: Newsletter & Trust Signals */}
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold/80 mb-8 font-medium">The Cellar List</h4>
                <p className="text-sm text-foreground/60 mb-6 leading-relaxed">
                  Join our private registry for allocation access and estate news.
                </p>
                <form onSubmit={subscribe} className="group relative">
                  <div className="glass rounded-md flex flex-col sm:flex-row items-stretch p-1 border border-white/10 focus-within:border-gold/50 transition-colors shadow-lg shadow-black/20">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground/50"
                    />
                    <button
                      disabled={loading}
                      className="px-6 py-3 relative overflow-hidden bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.2em] font-medium rounded hover:shadow-gold transition-all disabled:opacity-50 mt-1 sm:mt-0"
                    >
                      <span className="relative z-10">Join</span>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-shimmer" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 bg-[oklch(0.12_0.04_18)]/80 backdrop-blur-xl relative z-10">
          <div className="container-luxe py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-foreground/40">
              <div className="flex items-center gap-2" title="Organic Certified">
                <Leaf className="h-4 w-4" />
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Organic</span>
              </div>
              <div className="flex items-center gap-2" title="Estate Bottled">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Estate Bottled</span>
              </div>
              <div className="flex items-center gap-2" title="Award Winning">
                <Award className="h-4 w-4" />
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Award Winning</span>
              </div>
            </div>
            
            <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 text-center">
              © {new Date().getFullYear()} Maison Noir. Please drink responsibly.
            </span>
          </div>
        </div>

        {/* WAX SEAL BACK TO TOP */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20">
          <button 
            onClick={scrollToTop}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-wine border border-wine/50 shadow-deep flex items-center justify-center text-gold hover:bg-wine/80 hover:scale-105 transition-all duration-300 relative group overflow-hidden"
            aria-label="Back to top"
          >
            {/* Wax seal ridges simulation */}
            <div className="absolute inset-1 rounded-full border border-black/30" />
            <div className="absolute inset-1.5 rounded-full border border-gold/10" />
            <ArrowUp className="h-4 w-4 md:h-5 md:w-5 relative z-10 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
