import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { heroBooks } from './assets';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* glowing halo behind books */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(217,166,46,0.22) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* soft animated light rays */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[40vw] h-full pointer-events-none opacity-30"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(217,166,46,0.12) 30deg, transparent 60deg, rgba(59,130,246,0.10) 90deg, transparent 120deg)',
          animation: 'bk-lantern 18s linear infinite',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating books */}
        <div className="flex justify-center items-end gap-4 sm:gap-8 lg:gap-14 mb-8 sm:mb-10">
          {heroBooks.map((book, i) => (
            <div
              key={book.id}
              className="bk-float relative"
              style={{
                ['--rot' as string]: `${(i - 1) * 4}deg`,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              <div className="relative rounded-lg shadow-2xl group">
                <div
                  className="absolute -inset-1 rounded-lg blur-md opacity-60 -z-10"
                  style={{ background: book.accent }}
                  aria-hidden="true"
                />
                <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-xl">
                  <img
                    src={book.cover}
                    alt={`${book.title} devotional cover`}
                    loading="eager"
                    className="block w-48 sm:w-72 lg:w-96 h-auto"
                    style={{ filter: 'brightness(1.2) contrast(1.1)' }}
                  />
                  <span className="bk-sweep" />
                  <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-cinzel text-white text-xs sm:text-sm font-semibold tracking-wide">
                      {book.title}
                    </p>
                    <p className="text-white/60 text-[10px] sm:text-xs">{book.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Headline */}
        <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
          One Story.
          <br className="sm:hidden" /> One Saviour.
          <br className="sm:hidden" /> Every Generation.
        </h1>

        <p className="mt-5 font-cinzel text-lg sm:text-2xl text-gold-300 tracking-wide">
          Discover Jesus on Every Page of Scripture.
        </p>

        <p className="mt-5 max-w-2xl mx-auto text-lg text-[#D0D3D8] leading-[1.6]">
          From Genesis to Revelation, every devotional reveals Christ through rich biblical
          teaching, beautiful artwork, and daily reflections designed for Kids, Teens, and Adults.
        </p>

        <p className="mt-4 font-cinzel text-sm sm:text-base text-[#D0D3D8] tracking-[0.15em]">
          120+ DAYS · MULTIPLE VOLUMES · ONE LIFE-CHANGING JOURNEY
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/free-sample"
            className="inline-flex items-center gap-2 px-8 rounded-full text-[#05070D] font-bold transition-all hover:brightness-110"
            style={{ backgroundColor: '#D9A62E', height: '52px', borderRadius: '26px' }}
          >
            START READING TODAY <ArrowRight size={18} />
          </Link>
          <Link
            to="/books#collections"
            className="inline-flex items-center gap-2 px-8 rounded-full text-gold-300 font-semibold hover:bg-gold-400/10 transition-all"
            style={{ border: '1px solid #D9A62E', height: '52px', borderRadius: '26px' }}
          >
            VIEW EVERY COLLECTION <BookOpen size={18} />
          </Link>
        </div>

        {/* Available on */}
        <p className="mt-6 text-xs sm:text-sm text-[#D0D3D8]/70 tracking-widest uppercase">
          Available on · Amazon · Barnes &amp; Noble · InHimDaily.org
        </p>

        {/* Scripture quote */}
        <blockquote className="mt-10 max-w-3xl mx-auto">
          <p className="font-cinzel text-xl sm:text-3xl text-white/90 italic leading-relaxed">
            &ldquo;These are the very Scriptures that testify about Me.&rdquo;
          </p>
          <footer className="mt-3 text-gold-300 text-sm tracking-[0.2em]">JOHN 5:39</footer>
        </blockquote>
      </div>
    </section>
  );
}
