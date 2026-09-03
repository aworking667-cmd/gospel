import { Star } from 'lucide-react';
import { testimonials } from './assets';

export default function TestimonialsCarousel() {
  // duplicate the list to create a seamless marquee loop
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3 text-center">
          TESTIMONIALS
        </p>
        <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white text-center">
          Loved by Every Generation
        </h2>
      </div>

      <div className="relative">
        {/* edge fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #05070D 0%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #05070D 0%, transparent 100%)' }}
        />

        <div className="overflow-hidden">
          <div className="flex gap-6 bk-marquee w-max">
            {loop.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="bk-glass rounded-2xl p-8 w-80 sm:w-96 shrink-0"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} className="text-gold-300 fill-gold-300" />
                  ))}
                </div>
                <p className="font-cinzel text-lg text-white/90 italic leading-[1.6] mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-gold-300 text-sm tracking-wide">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
