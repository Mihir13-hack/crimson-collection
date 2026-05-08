import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/bookings")({ component: BookingsAdmin });

function BookingsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["all-bookings"], queryFn: async () => (await supabase.from("bookings").select("*").order("created_at", { ascending: false })).data ?? [] });
  const setStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status: status as "pending" | "confirmed" | "cancelled" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["all-bookings"] });
  };
  return (
    <div>
      <h1 className="font-serif text-4xl">Bookings</h1>
      <div className="mt-8 space-y-3">
        {data?.length === 0 && <p className="text-sm text-foreground/60">No bookings yet.</p>}
        {data?.map((b: any) => (
          <div key={b.id} className="glass rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-serif capitalize">{b.type} · {b.guest_name}</p>
              <p className="text-xs text-foreground/60">{b.date} {b.time} · {b.guests} guests · {b.guest_email}</p>
              {b.notes && <p className="text-xs text-foreground/70 mt-1 italic">{b.notes}</p>}
            </div>
            <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs">
              {["pending","confirmed","cancelled"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
