import ScrollReveal from '@/components/ScrollReveal';
import { timeline } from './assets';

export default function ScriptureTimeline() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 04</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white">
            The Journey Through Scripture
          </h2>
        </ScrollReveal>

        {/* Vertical timeline on mobile, horizontal on desktop */}
        <div className="relative">
          {/* glowing connecting line */}
          <div
            className="hidden lg:block absolute left-0 right-0 top-8 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.5) 15%, rgba(212,175,55,0.5) 85%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-4">
            {timeline.map((book, i) => (
              <ScrollReveal key={book} delay={i * 120} className="text-center">
                <div className="flex lg:flex-col items-center gap-4 lg:gap-0">
                  <div
                    className="bk-node w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(212,175,55,0.12)',
                      border: '1px solid rgba(212,175,55,0.4)',
                    }}
                  >
                    <span className="font-cinzel text-gold-300 font-bold text-lg">
                      {i + 1}
                    </span>
                  </div>
                  <div className="lg:mt-6">
                    <p className="font-cinzel text-white font-semibold text-base sm:text-lg">
                      {book}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal className="text-center mt-14">
          <p className="font-cinzel text-2xl sm:text-4xl text-white/90 italic">
            Every page whispers His name.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
