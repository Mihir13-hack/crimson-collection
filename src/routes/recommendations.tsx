import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveWineImage } from "@/lib/wine-images";
import { toast } from "sonner";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "AI Sommelier — Maison Noir" }, { name: "description", content: "Tell us your taste, the cellar will choose for you." }] }),
  component: Recs,
});

function Recs() {
  const [taste, setTaste] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [reason, setReason] = useState<string>("");

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: products } = await supabase.from("products").select("id,slug,name,category,vintage,region,description,tasting_notes,price,image_url");
      const list = (products ?? []).map((p) => `- ${p.name} (${p.category}, ${p.region}, ${p.vintage}) — ${p.tasting_notes}`).join("\n");
      const prompt = `You are a master sommelier at Maison Noir. Given the customer's taste preferences and our catalog, pick the 3 best wines (by name only). Respond as JSON: {"picks": ["Name1","Name2","Name3"], "reason": "one elegant sentence"}.\n\nCATALOG:\n${list}\n\nCUSTOMER: ${taste}`;
      const { data, error } = await supabase.functions.invoke("ai", { body: { prompt } }).catch(() => ({ data: null, error: "no fn" }));
      let picks: string[] = [];
      let why = "";
      if (data?.text) {
        try { const j = JSON.parse(data.text.match(/\{[\s\S]*\}/)?.[0] ?? "{}"); picks = j.picks ?? []; why = j.reason ?? ""; } catch {}
      }
      // Fallback: pick by keyword match
      if (picks.length === 0) {
        const t = taste.toLowerCase();
        const ranked = (products ?? []).map((p) => {
          const text = `${p.tasting_notes} ${p.description} ${p.category}`.toLowerCase();
          let score = 0;
          for (const w of t.split(/\s+/)) if (w.length > 2 && text.includes(w)) score++;
          return { p, score };
        }).sort((a, b) => b.score - a.score);
        picks = ranked.slice(0, 3).map((r) => r.p.name);
        why = "Selected from your taste cues by our cellar algorithm.";
      }
      setResults((products ?? []).filter((p) => picks.includes(p.name)));
      setReason(why);
    } catch (err) {
      toast.error("Could not generate recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-luxe py-16 max-w-3xl">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold">AI Sommelier</p>
      <h1 className="font-serif text-5xl mt-3">Tell us your taste</h1>
      <p className="mt-4 text-foreground/70">Describe what you love — flavors, occasions, the kind of evening you want — and our cellar will respond.</p>
      <form onSubmit={ask} className="mt-10 glass rounded-lg p-6">
        <textarea
          required
          rows={4}
          value={taste}
          onChange={(e) => setTaste(e.target.value)}
          placeholder="e.g. I love bold reds with dark fruit and a long finish, for a winter dinner with grilled lamb."
          className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
        />
        <button disabled={loading} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md disabled:opacity-50">
          <Sparkles className="h-4 w-4" /> {loading ? "Listening…" : "Recommend"}
        </button>
      </form>
      {results.length > 0 && (
        <div className="mt-12">
          <p className="font-serif text-xl text-gold italic">“{reason}”</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            {results.map((p) => (
              <Link key={p.id} to="/wine/$slug" params={{ slug: p.slug }} className="glass rounded-lg p-4 hover:border-gold/40 transition">
                <img src={resolveWineImage(p.image_url)} alt={p.name} className="aspect-[3/4] w-full object-cover rounded" />
                <p className="font-serif text-lg mt-3">{p.name}</p>
                <p className="text-xs text-gold mt-1">${Number(p.price).toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
