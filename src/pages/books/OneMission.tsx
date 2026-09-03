import ScrollReveal from '@/components/ScrollReveal';

export default function OneMission() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* soft moving light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(217,166,46,0.12) 0%, transparent 70%)',
          animation: 'bk-cta-light 14s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-6">SECTION 06</p>
          <blockquote className="font-cinzel text-3xl sm:text-5xl lg:text-6xl text-white leading-tight font-semibold">
            We believe every page of Scripture points to Jesus.
          </blockquote>
          <div className="my-12 flex items-center justify-center">
            <span className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          </div>
          <p className="font-cinzel text-2xl sm:text-3xl text-gold-200 italic">
            Every age deserves to discover Him.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
