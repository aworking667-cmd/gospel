import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { heroBooks } from './assets';

export default function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* slow moving light */}
      <div
        className="absolute inset-0 pointer-events-none bk-cta-light"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(217,166,46,0.18) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* cross glowing in the distance */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 bk-cross-glow" aria-hidden="true">
        <div className="relative w-8 h-20">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 h-20 bg-gradient-to-b from-gold-300/80 to-transparent rounded-full" />
          <div className="absolute left-1/2 -translate-x-1/2 top-6 w-8 h-1.5 bg-gradient-to-r from-transparent via-gold-300/80 to-transparent rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12">
        {/* three books standing together */}
        <div className="flex justify-center items-end gap-3 sm:gap-5 mb-10">
          {heroBooks.map((book, i) => (
            <div
              key={book.id}
              className="bk-float relative"
              style={{ ['--rot' as string]: `${(i - 1) * 3}deg`, animationDelay: `${i * 0.6}s` }}
            >
              <div
                className="absolute -inset-1 rounded-lg blur-md opacity-50 -z-10"
                style={{ background: book.accent }}
                aria-hidden="true"
              />
              <img
                src={book.cover}
                alt={book.title}
                loading="lazy"
                className="block w-32 sm:w-48 lg:w-64 h-auto rounded-lg border border-white/10 shadow-2xl"
                style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              />
            </div>
          ))}
        </div>

        <h2 className="font-cinzel text-4xl sm:text-6xl font-bold text-white leading-tight">
          One Bible.
          <br /> Three Versions. <br /> Every Age.
        </h2>
        <p className="mt-5 font-cinzel text-xl sm:text-2xl text-gold-300">
          Begin Your Journey Today
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/books#collections"
            className="inline-flex items-center gap-2 px-8 rounded-full text-gold-300 font-semibold hover:bg-gold-400/10 transition-all"
            style={{ border: '1px solid #D9A62E', height: '52px', borderRadius: '26px' }}
          >
            Explore the Collection <ArrowRight size={18} />
          </Link>
          <Link
            to="/books#pricing"
            className="inline-flex items-center gap-2 px-8 rounded-full text-[#05070D] font-bold hover:brightness-110 transition-all"
            style={{ backgroundColor: '#D9A62E', height: '52px', borderRadius: '26px' }}
          >
            Shop Now <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
