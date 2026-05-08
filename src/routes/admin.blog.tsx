import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog")({ component: BlogAdmin });

function BlogAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["all-blog"], queryFn: async () => (await supabase.from("blog_posts").select("*").order("published_at", { ascending: false })).data ?? [] });
  const [editing, setEditing] = useState<any | null>(null);

  const save = async (p: any) => {
    const { id, created_at, ...patch } = p;
    patch.tags = typeof patch.tags === "string" ? patch.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : (patch.tags ?? []);
    const { error } = id ? await supabase.from("blog_posts").update(patch).eq("id", id) : await supabase.from("blog_posts").insert(patch);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["all-blog"] });
  };

  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("blog_posts").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["all-blog"] }); };

  return (
    <div>
      <div className="flex justify-between items-end">
        <h1 className="font-serif text-4xl">Blog</h1>
        <button onClick={() => setEditing({ slug: "", title: "", excerpt: "", body: "", tags: "" })} className="px-4 py-2 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-widest rounded-md">+ New Post</button>
      </div>
      <div className="mt-8 space-y-3">
        {data?.map((p: any) => (
          <div key={p.id} className="glass rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-serif text-lg">{p.title}</p>
              <p className="text-xs text-foreground/60">{p.tags?.join(" · ")}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...p, tags: (p.tags ?? []).join(", ") })} className="px-3 py-1.5 text-xs uppercase tracking-widest border border-white/10 rounded">Edit</button>
              <button onClick={() => del(p.id)} className="px-3 py-1.5 text-xs uppercase tracking-widest border border-white/10 rounded">Del</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-auto" onClick={() => setEditing(null)}>
          <div className="glass rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl mb-4">{editing.id ? "Edit" : "New"} post</h2>
            <div className="space-y-3">
              {(["slug","title","excerpt","cover_url","tags"] as const).map((k) => (
                <input key={k} placeholder={k} value={editing[k] ?? ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
              ))}
              <textarea rows={10} placeholder="Body" value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-xs uppercase tracking-widest border border-white/10 rounded">Cancel</button>
              <button onClick={() => save(editing)} className="px-4 py-2 text-xs uppercase tracking-widest bg-gradient-gold text-gold-foreground rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
