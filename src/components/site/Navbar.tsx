import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User as UserIcon, Heart, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-maison-noir.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop", search: { category: "all", sort: "new" } },
  { to: "/story", label: "Story" },
  { to: "/booking", label: "Visit" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const { count } = useCart();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "glass shadow-deep py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container-luxe flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="Maison Noir" className="h-10 md:h-12 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              search={"search" in l ? l.search : undefined}
              className={cn(
                "text-sm uppercase tracking-[0.18em] gold-underline transition-colors",
                path === l.to ? "text-gold" : "text-foreground/80 hover:text-gold"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <Link to="/account" className="hidden sm:inline-flex p-2 rounded-full hover:bg-white/5 transition" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="hidden sm:inline-flex p-2 rounded-full hover:bg-white/5 transition text-gold" aria-label="Admin">
              <ShieldCheck className="h-5 w-5" />
            </Link>
          )}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/5 transition" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-gold text-gold-foreground text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link to={user ? "/account" : "/auth"} className="p-2 rounded-full hover:bg-white/5 transition" aria-label="Account">
            <UserIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-full hover:bg-white/5 transition"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/5 overflow-hidden"
          >
            <nav className="container-luxe flex flex-col py-6 gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  search={"search" in l ? l.search : undefined}
                  className={cn(
                    "py-3 text-sm uppercase tracking-[0.18em] border-b border-white/5",
                    path === l.to ? "text-gold" : "text-foreground/80"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="py-3 text-sm uppercase tracking-[0.18em] text-gold">
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
