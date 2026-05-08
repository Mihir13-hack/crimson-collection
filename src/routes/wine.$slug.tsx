import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Heart, Star, Wine, Utensils, Leaf, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCart, useWishlist } from "@/lib/cart";
import { resolveWineImage } from "@/lib/wine-images";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/wine/$slug")({
  component: ProductPage,
  loader: async ({ params }) => {
    const { data } = await supabase.from("products").select("*").eq("slug", params.slug).maybeSingle();
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Maison Noir` },
      { name: "description", content: loaderData.description?.slice(0, 160) ?? `${loaderData.name} from Maison Noir.` },
      { property: "og:title", content: `${loaderData.name} — Maison Noir` },
      { property: "og:description", content: loaderData.description?.slice(0, 160) ?? "" },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="font-serif text-4xl">Wine not found</h1>
      <Link to="/shop" search={{ category: "all", sort: "new" }} className="mt-6 inline-block text-gold gold-underline">Return to cellar</Link>
    </div>
  ),
  errorComponent: () => <div className="container-luxe py-32 text-center text-foreground/70">Could not load this wine.</div>,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const cart = useCart();
  const wl = useWishlist();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (!user || !p) return;
    supabase.from("recently_viewed").upsert({ user_id: user.id, product_id: p.id, viewed_at: new Date().toISOString() }, { onConflict: "user_id,product_id" }).then();
  }, [user, p]);

  const { data: similar } = useQuery({
    queryKey: ["similar", p.id, p.category],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,price,vintage,region,category,rating,image_url")
        .eq("category", p.category)
        .neq("id", p.id)
        .limit(4);
      return (data ?? []) as ProductCardData[];
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", p.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").eq("product_id", p.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="container-luxe py-16">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div
            className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-b from-white/5 to-black/40 border border-white/5 cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={resolveWineImage(p.image_url)}
              alt={p.name}
              className="h-full w-full object-cover transition-transform duration-700"
              style={{ transform: zoom ? "scale(1.5)" : "scale(1)" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.region} · Vintage {p.vintage}</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-3">{p.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-foreground/70">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" /> {Number(p.rating).toFixed(1)}</span>
            <span>·</span>
            <span>{p.varietal}</span>
            <span>·</span>
            <span>{Number(p.abv).toFixed(1)}% ABV</span>
          </div>

          <div className="mt-6 text-3xl font-serif text-gold">${Number(p.price).toFixed(2)}</div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{p.description}</p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="glass rounded-lg p-5">
              <div className="flex items-center gap-2 text-gold mb-2"><Leaf className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.2em]">Tasting Notes</span></div>
              <p className="text-sm text-foreground/80">{p.tasting_notes}</p>
            </div>
            <div className="glass rounded-lg p-5">
              <div className="flex items-center gap-2 text-gold mb-2"><Utensils className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.2em]">Food Pairing</span></div>
              <p className="text-sm text-foreground/80">{p.food_pairing}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-white/10 rounded-md">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-gold"><Minus className="h-4 w-4" /></button>
              <span className="px-4 min-w-12 text-center">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(12, q + 1))} className="p-3 hover:text-gold"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => cart.add(p.id, qty)}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md hover:shadow-gold transition"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
            <button
              onClick={() => wl.toggle(p.id)}
              className="p-3 border border-white/10 rounded-md hover:border-gold transition"
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${wl.has(p.id) ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          {p.stock < 20 && p.stock > 0 && (
            <p className="mt-6 text-xs text-gold/80 uppercase tracking-widest flex items-center gap-2">
              <Wine className="h-3 w-3" /> Only {p.stock} bottles remaining
            </p>
          )}
        </motion.div>
      </div>

      {/* Reviews */}
      <section className="mt-24">
        <SectionHeading eyebrow="Voices" title="Reviews" />
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {(reviews ?? []).length === 0 && (
            <p className="text-sm text-foreground/60">No reviews yet. Be the first to share your impression.</p>
          )}
          {reviews?.map((r: any) => (
            <div key={r.id} className="glass rounded-lg p-6">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold" />)}
              </div>
              {r.title && <h4 className="font-serif text-lg mt-2">{r.title}</h4>}
              <p className="text-sm text-foreground/80 mt-2">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar */}
      {similar && similar.length > 0 && (
        <section className="mt-24">
          <SectionHeading eyebrow="From the Same Cellar" title="You may also love" />
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((s, i) => <ProductCard key={s.id} p={s} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
