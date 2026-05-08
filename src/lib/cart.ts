import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { toast } from "sonner";

export type CartRow = {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string; slug: string; name: string; price: number; image_url: string | null; stock: number;
  } | null;
};

export function useCart() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery<CartRow[]>({
    queryKey: ["cart", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, product_id, quantity, product:products(id,slug,name,price,image_url,stock)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CartRow[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cart", user?.id] });

  return {
    items: query.data ?? [],
    loading: query.isLoading,
    count: (query.data ?? []).reduce((n, r) => n + r.quantity, 0),
    subtotal: (query.data ?? []).reduce((n, r) => n + r.quantity * Number(r.product?.price ?? 0), 0),
    async add(productId: string, qty = 1) {
      if (!user) {
        toast.error("Please sign in to add to cart");
        return;
      }
      const existing = (query.data ?? []).find((r) => r.product_id === productId);
      if (existing) {
        await supabase.from("cart_items").update({ quantity: existing.quantity + qty }).eq("id", existing.id);
      } else {
        await supabase.from("cart_items").insert({ user_id: user.id, product_id: productId, quantity: qty });
      }
      toast.success("Added to cart");
      invalidate();
    },
    async setQty(id: string, qty: number) {
      if (qty <= 0) await supabase.from("cart_items").delete().eq("id", id);
      else await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
      invalidate();
    },
    async remove(id: string) {
      await supabase.from("cart_items").delete().eq("id", id);
      invalidate();
    },
    async clear() {
      if (!user) return;
      await supabase.from("cart_items").delete().eq("user_id", user.id);
      invalidate();
    },
  };
}

export function useWishlist() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("id, product_id, product:products(id,slug,name,price,image_url,category,vintage,rating)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["wishlist", user?.id] });

  return {
    items: query.data ?? [],
    has: (pid: string) => (query.data ?? []).some((w: any) => w.product_id === pid),
    async toggle(productId: string) {
      if (!user) { toast.error("Please sign in"); return; }
      const existing = (query.data ?? []).find((w: any) => w.product_id === productId);
      if (existing) {
        await supabase.from("wishlists").delete().eq("id", (existing as any).id);
        toast("Removed from wishlist");
      } else {
        await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
        toast.success("Added to wishlist");
      }
      invalidate();
    },
  };
}
