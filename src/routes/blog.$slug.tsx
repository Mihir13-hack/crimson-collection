import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { resolveWineImage } from "@/lib/wine-images";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", params.slug).maybeSingle();
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.title} — Maison Noir Journal` },
      { name: "description", content: loaderData.excerpt ?? "" },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.excerpt ?? "" },
      { property: "og:image", content: loaderData.cover_url ?? "" },
    ] : [],
  }),
  notFoundComponent: () => <div className="container-luxe py-32 text-center"><Link to="/blog" className="text-gold">Back to journal</Link></div>,
  errorComponent: () => <div className="container-luxe py-32 text-center text-foreground/70">Could not load this article.</div>,
  component: Post,
});

function Post() {
  const p = Route.useLoaderData();
  return (
    <article className="container-luxe py-16 max-w-3xl">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.tags?.join(" · ")}</p>
      <h1 className="font-serif text-4xl md:text-6xl mt-3 leading-tight">{p.title}</h1>
      {p.cover_url && (
        <img src={resolveWineImage(p.cover_url)} alt={p.title} className="mt-10 rounded-lg w-full" />
      )}
      <div className="mt-10 text-foreground/85 leading-relaxed font-serif text-lg whitespace-pre-line">
        {p.body}
      </div>
      <Link to="/blog" className="mt-12 inline-block text-xs uppercase tracking-[0.25em] text-gold gold-underline">← Back to Journal</Link>
    </article>
  );
}
