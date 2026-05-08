import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/lib/cart";
import { resolveWineImage } from "@/lib/wine-images";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Maison Noir" }] }),
  component: Account,
});

function Account() {
  const { user, signOut, loading, isAdmin } = useAuth();
  const nav = useNavigate();
  const wl = useWishlist();

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const { data: orders } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const { data: bookings } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const { data: viewed } = useQuery({
    queryKey: ["viewed", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("recently_viewed").select("product:products(id,slug,name,price,image_url,vintage,region,category,rating)").order("viewed_at", { ascending: false }).limit(8);
      return data ?? [];
    },
  });

  if (!user) return null;

  return (
    <div className="container-luxe py-16">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Welcome</p>
          <h1 className="font-serif text-4xl mt-2">{user.email}</h1>
        </div>
        <div className="flex gap-3">
          {isAdmin && <Link to="/admin" className="px-4 py-2 border border-gold text-gold text-xs uppercase tracking-widest rounded-md">Admin</Link>}
          <button onClick={() => signOut().then(() => nav({ to: "/" }))} className="flex items-center gap-2 px-4 py-2 border border-white/15 text-xs uppercase tracking-widest rounded-md hover:border-gold">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <Section title="Orders">
          {orders?.length === 0 && <p className="text-sm text-foreground/60">No orders yet.</p>}
          {orders?.map((o: any) => (
            <div key={o.id} className="glass rounded-lg p-4 mb-3">
              <div className="flex justify-between text-sm">
                <span>#{o.id.slice(0,8)}</span>
                <span className="text-gold uppercase tracking-widest text-xs">{o.status}</span>
              </div>
              <div className="text-xs text-foreground/60 mt-1">{new Date(o.created_at).toLocaleDateString()} · ${Number(o.total).toFixed(2)}</div>
            </div>
          ))}
        </Section>
        <Section title="Bookings">
          {bookings?.length === 0 && <p className="text-sm text-foreground/60">No bookings yet.</p>}
          {bookings?.map((b: any) => (
            <div key={b.id} className="glass rounded-lg p-4 mb-3">
              <div className="flex justify-between text-sm"><span className="capitalize font-serif text-lg">{b.type}</span><span className="text-gold uppercase tracking-widest text-xs">{b.status}</span></div>
              <div className="text-xs text-foreground/70 mt-1">{b.date} at {b.time} · {b.guests} guests</div>
            </div>
          ))}
        </Section>
      </div>

      <Section title="Wishlist" className="mt-12">
        {wl.items.length === 0 && <p className="text-sm text-foreground/60">No saved wines.</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {wl.items.map((w: any) => (
            <Link key={w.id} to="/wine/$slug" params={{ slug: w.product?.slug ?? "" }} className="glass rounded-lg p-3">
              <img src={resolveWineImage(w.product?.image_url)} className="aspect-[3/4] w-full object-cover rounded" alt={w.product?.name} />
              <p className="font-serif text-sm mt-2">{w.product?.name}</p>
              <p className="text-xs text-gold mt-1">${Number(w.product?.price).toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </Section>

      {viewed && viewed.length > 0 && (
        <Section title="Recently Viewed" className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {viewed.map((v: any) => v.product && (
              <Link key={v.product.id} to="/wine/$slug" params={{ slug: v.product.slug }} className="glass rounded-lg p-3">
                <img src={resolveWineImage(v.product.image_url)} className="aspect-[3/4] w-full object-cover rounded" alt={v.product.name} />
                <p className="font-serif text-sm mt-2">{v.product.name}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-serif text-2xl mb-4 text-gold/90">{title}</h2>
      {children}
    </div>
  );
}
