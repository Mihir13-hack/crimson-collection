import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveWineImage } from "@/lib/wine-images";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { motion } from "framer-motion";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [{ title: "Journal — Maison Noir" }, { name: "description", content: "Notes from the cellar — wine guides, vintage reports, and estate stories." }] }),
  component: Blog,
});

function Blog() {
  const { data: posts } = useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="container-luxe py-16">
      <SectionHeading eyebrow="Notes from the Cellar" title="The Journal" />
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            className="group"
          >
            <Link to="/blog/$slug" params={{ slug: p.slug }}>
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src={resolveWineImage(p.cover_url)} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold mt-5">{p.tags?.join(" · ")}</p>
              <h3 className="font-serif text-2xl mt-2 group-hover:text-gold transition">{p.title}</h3>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{p.excerpt}</p>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
