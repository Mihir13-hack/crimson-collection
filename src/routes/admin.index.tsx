import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const { data: orders } = useQuery({ queryKey: ["admin-orders"], queryFn: async () => (await supabase.from("orders").select("*")).data ?? [] });
  const { data: products } = useQuery({ queryKey: ["admin-products"], queryFn: async () => (await supabase.from("products").select("id")).data ?? [] });
  const { data: bookings } = useQuery({ queryKey: ["admin-bookings"], queryFn: async () => (await supabase.from("bookings").select("*")).data ?? [] });

  const stats = useMemo(() => {
    const total = (orders ?? []).reduce((s, o: any) => s + Number(o.total), 0);
    const byDay: Record<string, number> = {};
    (orders ?? []).forEach((o: any) => {
      const d = new Date(o.created_at).toISOString().slice(0,10);
      byDay[d] = (byDay[d] ?? 0) + Number(o.total);
    });
    const series = Object.entries(byDay).slice(-14).map(([date, value]) => ({ date: date.slice(5), value }));
    return { total, series };
  }, [orders]);

  return (
    <div>
      <h1 className="font-serif text-4xl">Overview</h1>
      <div className="mt-8 grid sm:grid-cols-4 gap-4">
        <KPI label="Revenue" value={`$${stats.total.toFixed(2)}`} />
        <KPI label="Orders" value={String(orders?.length ?? 0)} />
        <KPI label="Products" value={String(products?.length ?? 0)} />
        <KPI label="Bookings" value={String(bookings?.length ?? 0)} />
      </div>
      <div className="mt-10 glass rounded-lg p-6">
        <h3 className="font-serif text-xl mb-4">Revenue (last 14 days)</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={stats.series}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
              <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} dot={{ fill: "#D4AF37" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg p-5">
      <p className="text-xs uppercase tracking-widest text-gold/80">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
