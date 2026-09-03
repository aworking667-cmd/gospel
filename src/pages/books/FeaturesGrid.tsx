import { Cross, BookOpenCheck, Palette, Users } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { features } from './assets';

const icons = [Cross, BookOpenCheck, Palette, Users];

export default function FeaturesGrid() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 03</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white">
            Why Families Love IN HIM DAILY
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((f, i) => {
            const Icon = icons[i] ?? Cross;
            return (
              <ScrollReveal key={f.id} delay={i * 120}>
                <div className="bk-glass rounded-2xl p-8 h-full text-center group transition-all duration-500 hover:-translate-y-2 hover:border-gold-400/50">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: 'rgba(217,166,46,0.10)',
                      boxShadow: '0 0 28px rgba(217,166,46,0.25)',
                    }}
                  >
                    <Icon className="text-gold-300" size={28} />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white mb-3">
                    {f.title}
                  </h3>
                  <p className="text-[#D0D3D8] text-base leading-[1.6]">{f.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
