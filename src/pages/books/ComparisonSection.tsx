import { Check } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { checklist } from './assets';

export default function ComparisonSection() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT: artistic illustration */}
          <ScrollReveal>
            <div className="relative aspect-square rounded-3xl overflow-hidden bk-glass">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.25) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)',
                }}
              />
              {/* stars */}
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="bk-star"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    ['--dur' as string]: `${Math.random() * 4 + 3}s`,
                    ['--delay' as string]: `${Math.random() * 4}s`,
                  }}
                />
              ))}
              {/* lantern */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bk-lantern">
                <div
                  className="w-32 h-32 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)',
                  }}
                />
              </div>
              {/* three books */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                {['#F59E0B', '#3B82F6', '#D4AF37'].map((c, i) => (
                  <div
                    key={i}
                    className="bk-float w-12 h-16 rounded shadow-2xl"
                    style={{
                      background: `linear-gradient(180deg, ${c} 0%, ${c}88 100%)`,
                      ['--rot' as string]: `${(i - 1) * 6}deg`,
                      animationDelay: `${i * 0.7}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT: checklist */}
          <ScrollReveal delay={150}>
            <div>
              <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">
                SECTION 05
              </p>
              <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-8">
                What Makes These Different?
              </h2>
              <p className="text-[#D0D3D8] text-lg mb-8 leading-[1.6]">
                Every page is crafted to do more than inform — it invites you to encounter the
                living Christ through His Word.
              </p>

              <ul className="space-y-4">
                {checklist.map((item, i) => (
                  <ScrollReveal key={item} delay={i * 80}>
                    <li className="flex items-center gap-4 group">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: 'rgba(212,175,55,0.15)',
                          border: '1px solid rgba(212,175,55,0.4)',
                        }}
                      >
                        <Check className="text-gold-300" size={16} />
                      </span>
                      <span className="text-[#D0D3D8] text-lg">{item}</span>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
