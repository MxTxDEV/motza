import { mindsetItems } from "@/data/images";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";

const offsets = ["lg:mt-0", "lg:mt-24", "lg:mt-10", "lg:mt-36"];

export function Mindset() {
  return (
    <section aria-labelledby="mindset-titulo" className="bg-ink py-24 md:py-36">
      <div className="pad-x mx-auto max-w-[2000px]">
        <SectionTitle eyebrow="Manifesto" lines={["THE MOTZA", "MINDSET"]} lineClasses={[undefined, "outline-text"]} />
        <ul className="mt-16 grid gap-x-5 gap-y-16 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {mindsetItems.map((item, i) => (
            <Reveal as="li" key={item.n} className={offsets[i]} delay={i * 0.05}>
              <article className="group">
                <p className="outline-text font-display text-[clamp(5rem,10vw,9rem)] leading-[0.8] text-bone" aria-hidden>
                  {item.n}
                </p>
                <ImageReveal src={item.src} alt={item.alt} sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw" className="mt-4 aspect-[4/5]" />
                <h3 className="mt-5 font-display text-3xl uppercase tracking-[0.03em] text-paper">{item.title}</h3>
                <p className="mt-2 max-w-[26ch] text-bone/75">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
