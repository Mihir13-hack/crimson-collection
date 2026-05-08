import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { resolveWineImage } from "@/lib/wine-images";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Maison Noir" }, { name: "description", content: "Your selected wines, ready to ship from our cellar." }] }),
  component: CartPage,
});

function CartPage() {
  const { user } = useAuth();
  const cart = useCart();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const total = cart.subtotal - discount;

  const apply = async () => {
    if (!code) return;
    const { data } = await supabase.from("coupons").select("*").eq("code", code.toUpperCase()).eq("active", true).maybeSingle();
    if (!data) return toast.error("Invalid coupon");
    setDiscount(cart.subtotal * (data.percent_off / 100));
    toast.success(`${data.percent_off}% off applied`);
  };

  if (!user) {
    return (
      <div className="container-luxe py-32 text-center">
        <ShoppingBag className="h-10 w-10 text-gold mx-auto" />
        <h1 className="font-serif text-3xl mt-6">Sign in to view your cart</h1>
        <Link to="/auth" className="mt-8 inline-flex px-8 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-widest rounded-md">Sign in</Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-luxe py-32 text-center">
        <h1 className="font-serif text-4xl">Your cellar is empty</h1>
        <p className="mt-3 text-foreground/70">Discover wines worth waiting for.</p>
        <Link to="/shop" className="mt-8 inline-flex px-8 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-widest rounded-md">Browse the cellar</Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-16">
      <h1 className="font-serif text-4xl">Your Cart</h1>
      <div className="mt-10 grid lg:grid-cols-[1fr,360px] gap-10">
        <div className="space-y-4">
          {cart.items.map((row) => (
            <div key={row.id} className="glass rounded-lg p-4 flex gap-4 items-center">
              <img src={resolveWineImage(row.product?.image_url)} alt={row.product?.name} className="h-24 w-20 object-cover rounded" />
              <div className="flex-1">
                <Link to="/wine/$slug" params={{ slug: row.product?.slug ?? "" }} className="font-serif text-lg hover:text-gold">{row.product?.name}</Link>
                <p className="text-sm text-gold">${Number(row.product?.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-white/10 rounded">
                <button onClick={() => cart.setQty(row.id, row.quantity - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                <span className="px-3 text-sm">{row.quantity}</span>
                <button onClick={() => cart.setQty(row.id, row.quantity + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
              </div>
              <button onClick={() => cart.remove(row.id)} className="p-2 text-foreground/50 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <aside className="glass rounded-lg p-6 h-fit">
          <h3 className="text-xs uppercase tracking-[0.25em] text-gold">Order Summary</h3>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${cart.subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-gold"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
            <div className="border-t border-white/10 my-3" />
            <div className="flex justify-between font-serif text-xl"><span>Total</span><span className="text-gold">${total.toFixed(2)}</span></div>
          </div>
          <div className="mt-5 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
            <button onClick={apply} className="px-4 py-2 border border-white/10 rounded text-xs uppercase tracking-widest hover:border-gold">Apply</button>
          </div>
          <Link to="/checkout" className="mt-6 block text-center px-6 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
