import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Maison Noir" }, { name: "description", content: "Complete your wine order." }] }),
  component: Checkout,
});

function Checkout() {
  const { user } = useAuth();
  const cart = useCart();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", line1: "", city: "", postal: "", country: "France" });

  if (!user) {
    return <div className="container-luxe py-32 text-center"><Link to="/auth" className="text-gold">Sign in to checkout</Link></div>;
  }

  if (done) {
    return (
      <div className="container-luxe py-32 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold mx-auto" />
        <h1 className="font-serif text-4xl mt-6">Order placed</h1>
        <p className="mt-3 text-foreground/70">Order #{done.slice(0, 8)} — payment processing will be enabled shortly.</p>
        <Link to="/account" className="mt-8 inline-flex px-8 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-widest rounded-md">View Orders</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) return toast.error("Your cart is empty");
    setLoading(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({ user_id: user.id, subtotal: cart.subtotal, total: cart.subtotal, shipping: form })
      .select()
      .single();
    if (error || !order) { setLoading(false); return toast.error(error?.message ?? "Could not create order"); }
    const items = cart.items.map((r) => ({ order_id: order.id, product_id: r.product_id, name: r.product?.name ?? "", price: Number(r.product?.price ?? 0), quantity: r.quantity }));
    await supabase.from("order_items").insert(items);
    await cart.clear();
    setDone(order.id);
    setLoading(false);
  };

  return (
    <div className="container-luxe py-16 grid lg:grid-cols-[1fr,400px] gap-12">
      <form onSubmit={submit} className="space-y-6">
        <h1 className="font-serif text-4xl">Checkout</h1>
        <h3 className="text-xs uppercase tracking-[0.25em] text-gold">Shipping</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Address" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} />
          <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Input label="Postal Code" value={form.postal} onChange={(v) => setForm({ ...form, postal: v })} />
          <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
        </div>
        <div className="glass rounded-lg p-5">
          <p className="text-xs text-foreground/70">Live payment processing is not yet enabled. Your order will be saved as <em>pending payment</em>.</p>
        </div>
        <button disabled={loading} className="px-8 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md disabled:opacity-50">
          {loading ? "Placing order…" : "Place Order"}
        </button>
      </form>
      <aside className="glass rounded-lg p-6 h-fit">
        <h3 className="text-xs uppercase tracking-[0.25em] text-gold">Summary</h3>
        <ul className="mt-5 space-y-2 text-sm">
          {cart.items.map((r) => (
            <li key={r.id} className="flex justify-between"><span>{r.product?.name} ×{r.quantity}</span><span>${(Number(r.product?.price ?? 0) * r.quantity).toFixed(2)}</span></li>
          ))}
        </ul>
        <div className="border-t border-white/10 my-4" />
        <div className="flex justify-between font-serif text-xl"><span>Total</span><span className="text-gold">${cart.subtotal.toFixed(2)}</span></div>
      </aside>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-foreground/60">{label}</span>
      <input required value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-gold/60" />
    </label>
  );
}
