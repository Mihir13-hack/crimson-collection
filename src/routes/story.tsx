import { createFileRoute } from "@tanstack/react-router";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { cellarImage, heroImage } from "@/lib/wine-images";

export const Route = createFileRoute("/story")({
  head: () => ({ meta: [
    { title: "Our Story — Maison Noir" },
    { name: "description", content: "Five generations of patient winemaking at a family estate in Bordeaux, since 1872." },
    { property: "og:title", content: "Our Story — Maison Noir" },
  ] }),
  component: Story,
});

function Story() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <img src={heroImage} alt="Vineyard" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container-luxe h-full flex items-end pb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Since 1872</p>
            <h1 className="font-serif text-5xl md:text-7xl mt-3 max-w-3xl">A family estate of <span className="italic text-gradient-gold">slow craft</span></h1>
          </div>
        </div>
      </section>

      <section className="container-luxe py-24 grid md:grid-cols-2 gap-16 items-center">
        <Reveal><img src={cellarImage} alt="Cellar" className="rounded-lg" /></Reveal>
        <Reveal delay={0.1}>
          <SectionHeading eyebrow="Heritage" title="The Cellar Beneath the Hill" />
          <p className="mt-6 text-foreground/80 leading-relaxed">In 1872 our great-great-grandfather purchased twelve hectares of limestone slope outside Saint-Émilion. He carved a cellar into the hill by hand and laid down his first vintage in oak barrels he made himself.</p>
          <p className="mt-4 text-foreground/70 leading-relaxed">Today, five generations later, we still farm those same vines and age our wines in those same cellars. The work has not changed — only the patience has deepened.</p>
        </Reveal>
      </section>

      <section className="bg-gradient-wine border-y border-white/5 py-24">
        <div className="container-luxe grid md:grid-cols-3 gap-10 text-center">
          {[
            { n: "152", l: "Years of Vintages" },
            { n: "12", l: "Hectares of Limestone Vines" },
            { n: "5", l: "Generations of Craft" },
          ].map((s) => (
            <Reveal key={s.l}>
              <div className="font-serif text-6xl text-gradient-gold">{s.n}</div>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-foreground/70">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-luxe py-24 max-w-3xl">
        <SectionHeading eyebrow="Philosophy" title="Make less. Wait longer." />
        <div className="mt-8 space-y-6 text-foreground/80 leading-relaxed">
          <p>We harvest by hand, in pre-dawn cool. We sort grape by grape on a vibrating table. We ferment with native yeasts in concrete and oak.</p>
          <p>Then we wait. Sometimes two years, sometimes ten, until the wine tells us it is ready. We believe a great wine should arrive at your table already singing.</p>
        </div>
      </section>
    </div>
  );
}
