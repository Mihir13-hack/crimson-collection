import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveWineImage } from "@/lib/wine-images";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({ component: ProductsAdmin });

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-products-list"],
    queryFn: async () => (await supabase.from("products").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);

  const save = async (p: any) => {
    const { id, created_at, ...patch } = p;
    const { error } = id ? await supabase.from("products").update(patch).eq("id", id) : await supabase.from("products").insert(patch);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-products-list"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this wine?")) return;
    await supabase.from("products").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-products-list"] });
  };

  return (
    <div>
      <div className="flex justify-between items-end">
        <h1 className="font-serif text-4xl">Products</h1>
        <button onClick={() => setEditing({ name: "", slug: "", category: "red", price: 0, stock: 0, vintage: 2022 })} className="px-4 py-2 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-widest rounded-md">+ New Wine</button>
      </div>
      <div className="mt-8 space-y-3">
        {data?.map((p) => (
          <div key={p.id} className="glass rounded-lg p-4 flex items-center gap-4">
            <img src={resolveWineImage(p.image_url)} className="h-16 w-12 object-cover rounded" alt="" />
            <div className="flex-1">
              <p className="font-serif text-lg">{p.name}</p>
              <p className="text-xs text-foreground/60">{p.category} · ${Number(p.price).toFixed(2)} · stock {p.stock}</p>
            </div>
            <button onClick={() => setEditing(p)} className="px-3 py-1.5 text-xs uppercase tracking-widest border border-white/10 rounded hover:border-gold">Edit</button>
            <button onClick={() => remove(p.id)} className="px-3 py-1.5 text-xs uppercase tracking-widest border border-white/10 rounded hover:border-destructive">Delete</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-auto" onClick={() => setEditing(null)}>
          <div className="glass rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl mb-4">{editing.id ? "Edit" : "New"} wine</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["name","slug","category","price","stock","vintage","region","varietal","abv","image_url","description","tasting_notes","food_pairing"] as const).map((k) => (
                <label key={k} className="text-xs uppercase tracking-widest text-foreground/60 col-span-2 sm:col-span-1">
                  {k}
                  <input value={editing[k] ?? ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} className="mt-1 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm normal-case tracking-normal" />
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-xs uppercase tracking-widest border border-white/10 rounded">Cancel</button>
              <button onClick={() => save({ ...editing, price: Number(editing.price), stock: Number(editing.stock), vintage: Number(editing.vintage), abv: editing.abv ? Number(editing.abv) : null })} className="px-4 py-2 text-xs uppercase tracking-widest bg-gradient-gold text-gold-foreground rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
