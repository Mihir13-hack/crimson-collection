import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/coupons")({ component: CouponsAdmin });

function CouponsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["all-coupons"], queryFn: async () => (await supabase.from("coupons").select("*")).data ?? [] });
  const [code, setCode] = useState(""); const [pct, setPct] = useState(10);
  const add = async () => {
    if (!code) return;
    await supabase.from("coupons").insert({ code: code.toUpperCase(), percent_off: pct });
    setCode(""); setPct(10);
    qc.invalidateQueries({ queryKey: ["all-coupons"] });
  };
  const toggle = async (id: string, active: boolean) => { await supabase.from("coupons").update({ active: !active }).eq("id", id); qc.invalidateQueries({ queryKey: ["all-coupons"] }); };
  return (
    <div>
      <h1 className="font-serif text-4xl">Coupons</h1>
      <div className="mt-6 glass rounded-lg p-4 flex gap-3">
        <input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
        <input type="number" min={1} max={100} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-24 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
        <button onClick={add} className="px-4 py-2 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-widest rounded">Add</button>
      </div>
      <div className="mt-6 space-y-2">
        {data?.map((c: any) => (
          <div key={c.id} className="glass rounded-lg p-4 flex justify-between items-center">
            <p className="font-serif text-lg">{c.code} <span className="text-gold">−{c.percent_off}%</span></p>
            <button onClick={() => toggle(c.id, c.active)} className="px-3 py-1.5 text-xs uppercase tracking-widest border border-white/10 rounded">{c.active ? "Active" : "Inactive"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
