import { Eye, ShieldCheck, Sun, MessageSquareHeart, Microscope, BookOpen, Clock, RotateCcw } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { dailyMovements, howToTips } from './assets';

const movementIcons = [Eye, ShieldCheck, Sun, MessageSquareHeart, Microscope];
const tipIcons = [BookOpen, Clock, RotateCcw];

export default function HowToUse() {
  return (
    <section id="how-to-use" className="relative py-16 sm:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <ScrollReveal className="max-w-4xl mx-auto text-center mb-14">
          <p className="font-cinzel text-gold-300 tracking-[0.25em] text-sm mb-3">SECTION 04</p>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white mb-8">
            How to Use In Him Daily
          </h2>

          <p className="text-[#D0D3D8] text-lg leading-[1.6] mb-6">
            There is a way of reading the Bible that changes everything. It is not a technique or a
            study method. It is simply this: knowing who you are looking for before you begin.
          </p>

          <p className="text-[#D0D3D8] text-lg leading-[1.6] mb-6">
            Jesus said something remarkable to the Pharisees, who were among the most dedicated
            Bible students in history: <span className="italic text-gold-200">“You study the
            Scriptures diligently because you think that in them you have eternal life. These are
            the very Scriptures that testify about me”</span> (John 5:39). They were reading the
            right Book and missing the Person the Book was about.
          </p>

          <p className="text-[#D0D3D8] text-lg leading-[1.6] mb-10">
            In Him Daily is built on one conviction: every page of Scripture, from Genesis to
            Revelation, was written to reveal Jesus Christ. Not every page in the same way. Not
            forced or artificially read in. But genuinely, purposefully, faithfully present —
            because the same Spirit who inspired every word knew what He was doing on every page.
          </p>

          <blockquote className="relative px-6 sm:px-10 py-8 rounded-2xl bk-glass">
            <p className="font-cinzel text-xl sm:text-2xl text-gold-200 italic leading-relaxed">
              “And beginning with Moses and all the Prophets, he explained to them what was said in
              all the Scriptures concerning himself.”
            </p>
            <footer className="mt-4 text-gold-300/80 text-sm tracking-widest">LUKE 24:27</footer>
          </blockquote>

          <p className="text-[#D0D3D8] text-lg leading-[1.6] mt-10 mb-2">
            When the risen Jesus walked the road to Emmaus with two despairing disciples, He did not
            start with the New Testament. He went back to the beginning — Moses, the Prophets, all
            the Scriptures — and showed them how every part was already speaking about Him.
          </p>
          <p className="text-[#D0D3D8] text-lg leading-[1.6]">
            This series does the same thing: it takes you back through the books of the Bible and
            shows you what Jesus Himself showed those disciples — that He was never absent from any
            page.
          </p>
        </ScrollReveal>

        {/* How each day is structured */}
        <ScrollReveal className="mb-12">
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white text-center mb-4">
            How Each Day Is Structured
          </h3>
          <p className="text-white/55 text-center max-w-2xl mx-auto mb-12">
            Each daily devotional has five movements — a rhythm designed to lead you from seeing
            Christ in the text to living Him in your day.
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" />

          <div className="space-y-6 lg:space-y-0">
            {dailyMovements.map((m, i) => {
              const Icon = movementIcons[i] ?? Eye;
              const isLeft = i % 2 === 0;
              return (
                <ScrollReveal key={m.id} delay={i * 80}>
                  <div
                    className={`relative lg:flex lg:items-center lg:gap-8 ${
                      isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* card */}
                    <div className="lg:w-1/2">
                      <div className="bk-glass rounded-2xl p-7 hover:border-gold-400/40 transition-all duration-500">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-10 h-10 rounded-full flex items-center justify-center bg-gold-400/10 border border-gold-400/30 shrink-0">
                            <Icon className="text-gold-300" size={18} />
                          </span>
                          <span className="font-cinzel text-xs tracking-[0.2em] text-gold-300/70">
                            MOVEMENT {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h4 className="font-cinzel text-lg font-bold text-white mb-2">
                          {m.title}
                        </h4>
                        <p className="text-[#D0D3D8] text-base leading-[1.6]">{m.description}</p>
                      </div>
                    </div>

                    {/* center node */}
                    <div className="hidden lg:flex lg:w-0 lg:justify-center">
                      <span className="w-4 h-4 rounded-full bg-gold-400/80 shadow-[0_0_16px_rgba(212,175,55,0.6)]" />
                    </div>

                    <div className="hidden lg:block lg:w-1/2" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Three editions in one */}
        <ScrollReveal className="mt-24">
          <div className="rounded-2xl bk-glass p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-5">
              Three Editions in One
            </h3>
            <p className="text-[#D0D3D8] text-lg leading-[1.6]">
              Each day is written in three separate editions: <span className="text-gold-200 font-semibold">Adult</span>,{' '}
              <span className="text-gold-200 font-semibold">Teen</span>, and{' '}
              <span className="text-gold-200 font-semibold">Kids</span>. The theological content is
              the same. The language, depth, and application are calibrated for each age. A family
              can sit down together, each person reading the same day’s passage in their own
              edition, and then discuss what they found. This is intentional: the faith that lasts
              is the faith that is shared across generations in a household, not only transmitted
              from church to child in one direction.
            </p>
          </div>
        </ScrollReveal>

        {/* How to get the most from this journey */}
        <ScrollReveal className="mt-16">
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white text-center mb-4">
            How to Get the Most From This Journey
          </h3>
          <p className="text-[#D0D3D8]/70 text-center max-w-2xl mx-auto mb-12 text-base">
            Three simple practices that turn reading into encounter.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {howToTips.map((tip, i) => {
            const Icon = tipIcons[i] ?? BookOpen;
            return (
              <ScrollReveal key={tip.id} delay={i * 120}>
                <div className="bk-glass rounded-2xl p-8 h-full hover:-translate-y-2 hover:border-gold-400/40 transition-all duration-500">
                  <div className="w-14 h-14 mb-5 rounded-full flex items-center justify-center bg-gold-400/10 border border-gold-400/30">
                    <Icon className="text-gold-300" size={24} />
                  </div>
                  <h4 className="font-cinzel text-lg font-bold text-white mb-3">
                    {tip.title}
                  </h4>
                  <p className="text-[#D0D3D8] text-base leading-[1.6]">{tip.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Closing invitation */}
        <ScrollReveal className="mt-16 text-center max-w-3xl mx-auto">
          <div className="my-10 flex items-center justify-center">
            <span className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          </div>
          <p className="font-cinzel text-2xl sm:text-3xl text-gold-200 italic leading-relaxed">
            Welcome to In Him Daily. He was always on every page. You are about to find Him.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
