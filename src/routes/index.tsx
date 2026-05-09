import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Award, Wine, Grape, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { heroImage, cellarImage, estateVideo, getCategoryImage } from "@/lib/wine-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Noir" },
      { name: "description", content: "Crafted in our limestone cellars since 1872. A family estate dedicated to wines of quiet power and patience." },
      { property: "og:title", content: "Maison Noir" },
      { property: "og:description", content: "Crafted in our limestone cellars since 1872. A family estate dedicated to wines of quiet power and patience." },
      { property: "og:image", content: "https://wine-store-three.vercel.app//og-image.png" },
    ],
  }),
  component: Home,
});

const testimonials = [
  { quote: "The Cuvée Impérial is one of the finest Champagnes I've poured in twenty years.", who: "—  Antoine Belmont, Master Sommelier" },
  { quote: "A pilgrimage estate. The cellar tour was the highlight of our trip to France.", who: "— Travel + Leisure" },
  { quote: "Quietly powerful wines that age with extraordinary grace.", who: "— Decanter Magazine" },
];

const awards = [
  { year: "2024", text: "Decanter Platinum — Cuvée Impérial 2015" },
  { year: "2023", text: "James Suckling 99 pts — Château Noir Reserve" },
  { year: "2022", text: "Wine Spectator Top 100 — Domaine Grenat" },
  { year: "2021", text: "International Wine Challenge — Trophy" },
];

function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: featured } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,price,vintage,region,category,rating,image_url")
        .eq("featured", true)
        .limit(8);
      return (data ?? []) as ProductCardData[];
    },
  });

  return (
    <div>
      {/* HERO */}
      <section ref={ref} className="relative -mt-20 h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <img src={heroImage} alt="Vineyard at golden hour" className="h-[120%] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
        <motion.div style={{ opacity }} className="relative z-10 text-center px-4 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xs sm:text-sm uppercase tracking-[0.4em] text-gold mb-6"
          >
            Estate · Bordeaux · Since 1872
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4 }}
            className="font-serif text-5xl sm:text-7xl md:text-8xl leading-[1.05] text-foreground"
          >
            The art of <span className="italic text-gradient-gold">patient</span><br />winemaking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mt-8 text-base sm:text-lg text-foreground/80 max-w-xl mx-auto leading-relaxed"
          >
            Wines crafted slowly in our limestone cellars and released only when ready. Discover an estate where time is the most precious ingredient.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link to="/shop" search={{ category: "all", sort: "new" }} className="px-8 py-4 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] font-medium rounded-md hover:shadow-gold transition-all">
              Explore the Cellar
            </Link>
            <Link to="/booking" className="px-8 py-4 border border-white/20 text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-all rounded-md">
              Book a Tasting
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-foreground/60"
        >
          Scroll
        </motion.div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="container-luxe pt-16 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {([
            { icon: Wine, label: "Red", to: "red", img: getCategoryImage("red") },
            { icon: Grape, label: "White", to: "white", img: getCategoryImage("white") },
            { icon: Sparkles, label: "Sparkling", to: "sparkling", img: getCategoryImage("sparkling") },
            { icon: Wine, label: "Rosé", to: "rose", img: getCategoryImage("rose") },
          ] as const).map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <Link
                to="/shop"
                search={{ category: c.to, sort: "new" }}
                className="relative overflow-hidden rounded-lg p-8 flex flex-col items-center gap-3 hover:border-gold/40 border border-white/10 transition group min-h-[180px]"
              >
                <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
                <c.icon className="h-7 w-7 text-gold group-hover:scale-110 transition relative z-10" />
                <span className="text-sm uppercase tracking-[0.2em] relative z-10">{c.label}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED WINES */}
      <section className="container-luxe pt-6 pb-20">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading eyebrow="Cellar Selection" title="Featured Wines" />
          <Link to="/shop" search={{ category: "all", sort: "new" }} className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold gold-underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {featured?.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </section>

      {/* STORY */}
      <section className="relative py-32 overflow-hidden">
        <div className="container-luxe grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <img src={cellarImage} alt="Our cellar" className="rounded-lg shadow-deep" />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">Our Story</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Five generations of <span className="italic text-gradient-gold">slow craft</span>
            </h2>
            <p className="mt-6 text-foreground/80 leading-relaxed">
              In 1872 our great-great-grandfather purchased twelve hectares of limestone slope outside Saint-Émilion. We still farm those vines today — by hand, by season, and by memory.
            </p>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              Our wines are not made; they are listened for. Each barrel is tasted weekly, blended only at its peak, and released when the cellar tells us it is time.
            </p>
            <Link to="/story" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold gold-underline">
              Read the full story <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* AWARDS */}
      <section className="bg-gradient-wine border-y border-white/5 py-20">
        <div className="container-luxe">
          <SectionHeading eyebrow="Recognition" title="Awards & Honors" center />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((a, i) => (
              <Reveal key={a.text} delay={i * 0.07}>
                <div className="glass rounded-lg p-6 text-center h-full">
                  <Award className="h-7 w-7 text-gold mx-auto mb-3" />
                  <p className="text-2xl font-serif text-gold">{a.year}</p>
                  <p className="text-xs text-foreground/80 mt-2">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TASTING CTA — with estate video bg */}
      <section className="relative py-32 text-center overflow-hidden">
        <video
          src={estateVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/85" />
        <div className="relative container-luxe">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">Visit the Estate</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
              An afternoon among the vines, by candlelight in the cellar
            </h2>
            <p className="mt-6 text-foreground/80 max-w-xl mx-auto">
              Reserve a private tasting or guided vineyard tour. Limited to twelve guests per session.
            </p>
            <Link to="/booking" className="mt-10 inline-flex px-10 py-4 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md hover:shadow-gold transition">
              Reserve Your Visit
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-luxe pt-16 pb-8">
        <SectionHeading eyebrow="In Praise" title="What is being said" center />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <blockquote className="glass rounded-lg p-8 h-full">
                <div className="text-gold text-3xl font-serif leading-none">“</div>
                <p className="mt-3 text-foreground/85 italic font-serif text-lg leading-relaxed">{t.quote}</p>
                <footer className="mt-6 text-xs uppercase tracking-[0.2em] text-foreground/60">{t.who}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
