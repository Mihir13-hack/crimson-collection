import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { cellarImage, heroImage } from "@/lib/wine-images";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/story")({
  head: () => ({ meta: [
    { title: "Our Story — Maison Noir" },
    { name: "description", content: "Five generations of patient winemaking at a family estate in Bordeaux, since 1872." },
    { property: "og:title", content: "Our Story — Maison Noir" },
  ] }),
  component: Story,
});

const testimonials = [
  { quote: "The Cuvée Impérial is one of the finest Champagnes I've poured in twenty years.", who: "—  Antoine Belmont, Master Sommelier" },
  { quote: "A pilgrimage estate. The cellar tour was the highlight of our trip to France.", who: "— Travel + Leisure" },
  { quote: "Quietly powerful wines that age with extraordinary grace.", who: "— Decanter Magazine" },
];

function Story() {
  const { data: posts } = useQuery({
    queryKey: ["story-journal"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_url,published_at")
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <div>
      <section className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <img src={heroImage} alt="Vineyard" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container-luxe h-full flex items-end pb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Since 1872</p>
            <h1 className="font-serif text-5xl md:text-7xl mt-3 max-w-3xl">A family estate of <span className="italic text-gradient-gold">slow craft</span></h1>
          </div>
        </div>
      </section>

      <section className="container-luxe py-24 grid md:grid-cols-2 gap-16 items-center">
        <Reveal><img src={cellarImage} alt="Cellar" className="rounded-lg" /></Reveal>
        <Reveal delay={0.1}>
          <SectionHeading eyebrow="Heritage" title="The Cellar Beneath the Hill" />
          <p className="mt-6 text-foreground/80 leading-relaxed">In 1872 our great-great-grandfather purchased twelve hectares of limestone slope outside Saint-Émilion. He carved a cellar into the hill by hand and laid down his first vintage in oak barrels he made himself.</p>
          <p className="mt-4 text-foreground/70 leading-relaxed">Today, five generations later, we still farm those same vines and age our wines in those same cellars. The work has not changed — only the patience has deepened.</p>
        </Reveal>
      </section>

      <section className="bg-gradient-wine border-y border-white/5 py-24">
        <div className="container-luxe grid md:grid-cols-3 gap-10 text-center">
          {[
            { n: "152", l: "Years of Vintages" },
            { n: "12", l: "Hectares of Limestone Vines" },
            { n: "5", l: "Generations of Craft" },
          ].map((s) => (
            <Reveal key={s.l}>
              <div className="font-serif text-6xl text-gradient-gold">{s.n}</div>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-foreground/70">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* JOURNAL — Notes from the Cellar (replaces Philosophy) */}
      <section className="container-luxe py-24">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <SectionHeading eyebrow="The Journal" title="Notes from the Cellar" />
          <Link to="/blog" className="text-xs uppercase tracking-[0.25em] text-gold gold-underline inline-flex items-center gap-2">
            All entries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(posts ?? []).map((post, i) => (
            <Reveal key={post.id} delay={i * 0.1}>
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-white/10 mb-4">
                  <img
                    src={post.cover_url ?? heroImage}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}
                </p>
                <h3 className="font-serif text-2xl mt-2 group-hover:text-gold transition-colors">{post.title}</h3>
                {post.excerpt && <p className="mt-3 text-sm text-foreground/70 line-clamp-3">{post.excerpt}</p>}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-luxe pt-8 pb-16">
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
