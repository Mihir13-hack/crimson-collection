import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — Maison Noir" }, { name: "description", content: "Sign in or create an account at Maison Noir." }] }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) { nav({ to: "/account" }); return null; }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: name } } });
      if (error) toast.error(error.message);
      else { toast.success("Check your email to confirm"); }
    } else if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else { toast.success("Welcome back"); nav({ to: "/account" }); }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
      if (error) toast.error(error.message);
      else toast.success("Reset email sent");
    }
    setLoading(false);
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    if (error) toast.error("Google sign-in failed");
  };

  return (
    <div className="container-luxe py-24 max-w-md">
      <div className="glass rounded-lg p-8">
        <h1 className="font-serif text-3xl text-center">{mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Welcome Back"}</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "signup" && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />
          {mode !== "forgot" && <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm" />}
          <button disabled={loading} className="w-full px-6 py-3 bg-gradient-gold text-gold-foreground text-xs uppercase tracking-[0.25em] rounded-md disabled:opacity-50">{loading ? "…" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Sign In"}</button>
        </form>
        {mode !== "forgot" && (
          <>
            <div className="my-5 text-center text-xs text-foreground/50 uppercase tracking-widest">or</div>
            <button onClick={google} className="w-full px-6 py-3 border border-white/15 rounded-md text-sm hover:border-gold transition">Continue with Google</button>
          </>
        )}
        <div className="mt-6 text-center text-xs text-foreground/60 space-x-3">
          {mode !== "signin" && <button onClick={() => setMode("signin")} className="hover:text-gold">Sign in</button>}
          {mode !== "signup" && <button onClick={() => setMode("signup")} className="hover:text-gold">Create account</button>}
          {mode !== "forgot" && <button onClick={() => setMode("forgot")} className="hover:text-gold">Forgot password</button>}
        </div>
      </div>
    </div>
  );
}
