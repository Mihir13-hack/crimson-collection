import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/orders")({ component: OrdersAdmin });

const statuses = ["pending_payment","paid","shipped","delivered","cancelled"];

function OrdersAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["all-orders"],
    queryFn: async () => (await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false })).data ?? [],
  });
  const setStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status: status as "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["all-orders"] });
  };
  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      <div className="mt-8 space-y-3">
        {data?.length === 0 && <p className="text-sm text-foreground/60">No orders yet.</p>}
        {data?.map((o: any) => (
          <div key={o.id} className="glass rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-serif">#{o.id.slice(0,8)}</p>
                <p className="text-xs text-foreground/60">{new Date(o.created_at).toLocaleString()} · ${Number(o.total).toFixed(2)}</p>
              </div>
              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs">
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <ul className="mt-2 text-xs text-foreground/70">
              {o.order_items?.map((it: any) => <li key={it.id}>{it.name} × {it.quantity}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
