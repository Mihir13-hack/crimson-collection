import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Reveal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const search = z.object({
  category: z.enum(["all", "red", "white", "sparkling", "rose"]).default("all").catch("all"),
  q: z.string().optional().catch(undefined),
  sort: z.enum(["new", "price-asc", "price-desc", "rating"]).default("new").catch("new"),
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Wine Cellar — Maison Noir" },
      { name: "description", content: "Browse the complete cellar — reds, whites, sparkling, and rosé from a family estate in Bordeaux." },
      { property: "og:title", content: "Wine Cellar — Maison Noir" },
    ],
  }),
  validateSearch: (s) => search.parse(s),
  component: Shop,
});

const cats = [
  { v: "all", l: "All Wines" },
  { v: "red", l: "Red" },
  { v: "white", l: "White" },
  { v: "sparkling", l: "Sparkling" },
  { v: "rose", l: "Rosé" },
] as const;

function Shop() {
  const sp = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const [query, setQuery] = useState(sp.q ?? "");
  const [open, setOpen] = useState(false);

  // Draft filters (committed when "Apply" pressed)
  const [draftCategory, setDraftCategory] = useState<typeof sp.category>(sp.category);
  const [draftSort, setDraftSort] = useState<typeof sp.sort>(sp.sort);
  const [priceMax, setPriceMax] = useState(300);
  const [minRating, setMinRating] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["products", sp.category, sp.sort],
    queryFn: async () => {
      let q = supabase.from("products").select("id,slug,name,price,vintage,region,category,rating,image_url");
      if (sp.category !== "all") q = q.eq("category", sp.category);
      if (sp.sort === "price-asc") q = q.order("price", { ascending: true });
      else if (sp.sort === "price-desc") q = q.order("price", { ascending: false });
      else if (sp.sort === "rating") q = q.order("rating", { ascending: false });
      else q = q.order("created_at", { ascending: false });
      const { data } = await q;
      return (data ?? []) as ProductCardData[];
    },
  });

  const filtered = useMemo(() => {
    return (data ?? [])
      .filter((p) => Number(p.price) <= priceMax)
      .filter((p) => Number(p.rating ?? 0) >= minRating)
      .filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()) || (p.region ?? "").toLowerCase().includes(query.toLowerCase()));
  }, [data, priceMax, minRating, query]);

  const applyFilters = () => {
    nav({ search: (s) => ({ ...s, category: draftCategory, sort: draftSort }) });
    setOpen(false);
  };

  const resetFilters = () => {
    setDraftCategory("all");
    setDraftSort("new");
    setPriceMax(300);
    setMinRating(0);
  };

  return (
    <div className="container-luxe py-16">
      <SectionHeading eyebrow="Cellar" title="The Wine Cellar" />
      <p className="mt-4 text-foreground/70 max-w-2xl">Eight estate releases, each cellared until peak. Use the filters to discover your next bottle.</p>

      {/* Search + Filter button */}
      <div className="mt-10 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wines or region…"
            className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-md text-sm focus:outline-none focus:border-gold/60"
          />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2 py-6">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-l border-white/10">
            <SheetHeader>
              <SheetTitle className="text-gold font-serif">Filter Wines</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-8 px-1">
              <div>
                <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-3">Category</h4>
                <ul className="space-y-1">
                  {cats.map((c) => (
                    <li key={c.v}>
                      <button
                        onClick={() => setDraftCategory(c.v)}
                        className={cn(
                          "text-sm w-full text-left py-2 px-3 rounded transition",
                          draftCategory === c.v ? "bg-gold/10 text-gold" : "text-foreground/70 hover:text-gold"
                        )}
                      >
                        {c.l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-3">Max Price</h4>
                <input type="range" min={20} max={300} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[oklch(0.78_0.13_85)]" />
                <p className="text-sm text-foreground/70 mt-2">Up to ${priceMax}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-3">Min Rating</h4>
                <div className="flex gap-2 flex-wrap">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)} className={cn("px-3 py-1 text-xs rounded border", minRating === r ? "border-gold text-gold" : "border-white/10 text-foreground/70")}>
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-3">Sort</h4>
                <select
                  value={draftSort}
                  onChange={(e) => setDraftSort(e.target.value as typeof sp.sort)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm"
                >
                  <option value="new">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            <SheetFooter className="mt-8 flex-row gap-3 sm:justify-end">
              <Button variant="ghost" onClick={resetFilters}>Reset</Button>
              <Button onClick={applyFilters} className="bg-gradient-gold text-gold-foreground hover:shadow-gold">Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Grid */}
      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-lg p-16 text-center">
            <p className="font-serif text-xl text-gold">No wines match your filters</p>
            <p className="mt-2 text-sm text-foreground/70">Try widening your price range or rating.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
