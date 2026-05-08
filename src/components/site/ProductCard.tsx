import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useCart, useWishlist } from "@/lib/cart";
import { resolveWineImage } from "@/lib/wine-images";
import { cn } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  vintage?: number | null;
  region?: string | null;
  category?: string;
  rating?: number;
  image_url?: string | null;
};

export function ProductCard({ p, index = 0 }: { p: ProductCardData; index?: number }) {
  const cart = useCart();
  const wl = useWishlist();
  const inWishlist = wl.has(p.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06 }}
      className="group relative"
    >
      <Link to="/wine/$slug" params={{ slug: p.slug }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-b from-white/5 to-black/30 border border-white/5">
          <img
            src={resolveWineImage(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          {p.vintage && (
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-gold/90 bg-black/40 backdrop-blur px-2 py-1 rounded">
              Vintage {p.vintage}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); wl.toggle(p.id); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 transition"
            aria-label="Wishlist"
          >
            <Heart className={cn("h-4 w-4 transition", inWishlist ? "fill-gold text-gold" : "text-white/80")} />
          </button>
        </div>
        <div className="pt-4 px-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold/70">{p.region || p.category}</p>
          <h3 className="font-serif text-lg mt-1 group-hover:text-gold transition-colors line-clamp-1">{p.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-base font-medium">${Number(p.price).toFixed(2)}</span>
            <button
              onClick={(e) => { e.preventDefault(); cart.add(p.id); }}
              className="text-[10px] uppercase tracking-[0.2em] text-foreground/70 hover:text-gold transition"
            >
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
