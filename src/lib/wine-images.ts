// Placeholder image resolver. Real bottle photography can replace these later.
const PLACEHOLDER_BOTTLE =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80";
const PLACEHOLDER_HERO =
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1920&q=80";
const PLACEHOLDER_CELLAR =
  "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1920&q=80";

const map: Record<string, string> = {
  "/hero-vineyard.jpg": PLACEHOLDER_HERO,
  "/cellar.jpg": PLACEHOLDER_CELLAR,
};

export function resolveWineImage(path?: string | null): string {
  if (!path) return PLACEHOLDER_BOTTLE;
  if (path.startsWith("http")) return path;
  return map[path] ?? PLACEHOLDER_BOTTLE;
}

export const heroImage = PLACEHOLDER_HERO;
export const cellarImage = PLACEHOLDER_CELLAR;
