// Placeholder image resolver. Real bottle photography can replace these later.
import bottleRed from "@/assets/videos/bottle-red.mp4.asset.json";
import bottleWhite from "@/assets/videos/bottle-white.mp4.asset.json";
import bottleSparkling from "@/assets/videos/bottle-sparkling.mp4.asset.json";
import bottleRose from "@/assets/videos/bottle-rose.mp4.asset.json";
import estateVid from "@/assets/videos/estate.mp4.asset.json";
import catRed from "@/assets/cat-red.jpg";
import catWhite from "@/assets/cat-white.jpg";
import catSparkling from "@/assets/cat-sparkling.jpg";
import catRose from "@/assets/cat-rose.jpg";

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
export const estateVideo = estateVid.url;

const bottleVideos: Record<string, string> = {
  red: bottleRed.url,
  white: bottleWhite.url,
  sparkling: bottleSparkling.url,
  rose: bottleRose.url,
};

const categoryImages: Record<string, string> = {
  red: catRed,
  white: catWhite,
  sparkling: catSparkling,
  rose: catRose,
};

export function getBottleVideo(category?: string | null): string | undefined {
  if (!category) return undefined;
  return bottleVideos[category.toLowerCase()];
}

export function getCategoryImage(category: string): string {
  return categoryImages[category] ?? catRed;
}
