import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { collections } from './assets';

const editionOrder = ['adult', 'teen', 'kids'] as const;
const editionLabels: Record<string, string> = {
  adult: 'Adult',
  teen: 'Teen',
  kids: 'Kids',
};

export default function CollectionCards() {
  return (
    <section id="collections" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 02</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white">
            Explore Every Collection
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Six journeys through Scripture. Each one a doorway into the one story that changes
            everything.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 100}>
              <div className="bk-glass rounded-2xl overflow-hidden h-full group transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-[0_24px_64px_rgba(212,175,55,0.2)]">
                {/* Book cover */}
                <div className="relative w-full bg-white/[0.03] border-b border-white/5 overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(212,175,55,0.10) 100%)',
                    }}
                    aria-hidden="true"
                  />
                  <img
                    src={c.cover}
                    alt={c.title}
                    loading="lazy"
                    className="relative block w-full h-auto object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="bk-sweep" />
                </div>

                <div className="p-6">
                  <p className="font-cinzel text-xs tracking-[0.2em] text-gold-300 mb-2">
                    {c.volume}
                  </p>
                  <h3 className="font-cinzel text-xl font-semibold text-white mb-2">{c.title}</h3>
                  <p className="text-white/50 text-sm mb-3">{c.scripture}</p>

                  <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
                    <Clock size={14} className="text-gold-300" />
                    <span>{c.days} Days</span>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-6">{c.description}</p>

                  {/* Per-edition covers + prices */}
                  <div className="space-y-3 mb-6">
                    <p className="font-cinzel text-xs tracking-[0.18em] text-gold-300 uppercase">
                      Available Editions
                    </p>
                    {editionOrder.map((key) => {
                      const ed = c.editions[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5"
                        >
                          <img
                            src={ed.cover}
                            alt={`${c.title} — ${editionLabels[key]} Edition`}
                            loading="lazy"
                            className="w-10 h-14 object-contain rounded shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white/85 text-sm font-semibold">
                              {editionLabels[key]} Edition
                            </p>
                            <p className="text-white/45 text-xs">{ed.kes}</p>
                          </div>
                          <span className="font-cinzel text-gold-200 font-bold text-sm whitespace-nowrap">
                            {ed.usd}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between rounded-lg border border-gold-400/40 bg-gold-400/[0.06] px-3 py-2.5">
                      <div>
                        <p className="text-white/90 text-sm font-semibold">Complete Family Bundle</p>
                        <p className="text-white/45 text-xs">All 3 editions</p>
                      </div>
                      <span className="font-cinzel text-gold-200 font-bold text-sm whitespace-nowrap">
                        $25
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/devotionals"
                    className="inline-flex items-center gap-2 text-gold-300 font-semibold text-sm hover:text-gold-200 transition-colors group/btn"
                  >
                    Explore
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
