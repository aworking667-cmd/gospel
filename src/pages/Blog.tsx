import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, PenLine, Search, Clock, BookOpen } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { useSEO } from '@/hooks/useSEO';
import ScrollReveal from '@/components/ScrollReveal';

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author: string | null;
  category: string | null;
  published_at: string | null;
};

export default function BlogPage() {
  useSEO({
    title: 'Blog | In Him Daily',
    description: 'Articles, devotionals, and reflections from the In Him Daily ministry — helping every generation encounter Jesus together.',
    canonicalPath: '/blog',
  });

  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const supabase = getSupabaseClient();
        const { data, error: err } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, cover_image_url, author, category, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (err) throw err;
        setPosts((data ?? []) as BlogPostSummary[]);
      } catch {
        setError('Articles could not be loaded. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];

  const filtered = posts.filter((p) => {
    const matchesCat = !activeCat || p.category === activeCat;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? '').toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  function fmtDate(iso: string | null) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" aria-label="Blog hero">
        {/* layered background glows */}
        <div className="absolute inset-0" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,152,58,0.10) 0%, transparent 70%)' }} />
        <div className="absolute inset-0" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 40% 30% at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />

        {/* floating accent dots */}
        <div className="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-gold-400/30 animate-pulse" aria-hidden="true" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-[15%] w-1.5 h-1.5 rounded-full bg-gold-300/20 animate-pulse" aria-hidden="true" style={{ animationDuration: '4s', animationDelay: '1s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 mb-6">
            <BookOpen size={13} className="text-gold-300" aria-hidden="true" />
            <p className="text-gold-300 text-[0.72rem] font-semibold tracking-[0.16em] uppercase">In Him Daily</p>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The Blog
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
            Reflections, devotionals, and stories to help every generation in your family encounter Jesus together.
          </p>
          <div className="gold-divider mx-auto mt-8" aria-hidden="true" />
        </div>
      </section>

      {/* Search + Filters */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="ih-input w-full pl-11 pr-4 py-2.5 text-sm"
                aria-label="Search articles"
              />
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setActiveCat(null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    !activeCat
                      ? 'bg-gold-400/20 text-gold-300 border border-gold-400/40 shadow-sm shadow-gold-400/10'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c === activeCat ? null : c)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCat === c
                        ? 'bg-gold-400/20 text-gold-300 border border-gold-400/40 shadow-sm shadow-gold-400/10'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-white/50">
              <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mr-3" />
              Loading articles...
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-white/50">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <PenLine size={40} className="text-white/20 mx-auto mb-4" aria-hidden="true" />
              <p className="text-white/50 text-lg">No articles found.</p>
              <p className="text-white/30 text-sm mt-1">Check back soon for new content.</p>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {featured && (
                <ScrollReveal className="mb-14">
                  <Link to={`/blog/${featured.slug}`} className="block group">
                    <article className="premium-card rounded-3xl overflow-hidden ih-card relative">
                      {/* gradient overlay border accent */}
                      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 0 1px rgba(217,166,46,0.3)' }}
                        aria-hidden="true"
                      />
                      <div className="grid md:grid-cols-2">
                        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px] overflow-hidden bg-white/5">
                          {featured.cover_image_url ? (
                            <img
                              src={featured.cover_image_url}
                              alt={featured.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-500/10 to-transparent">
                              <PenLine size={36} className="text-white/20" aria-hidden="true" />
                            </div>
                          )}
                          {/* category badge floating on image */}
                          {featured.category && (
                            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-gold-300 text-[0.65rem] font-semibold tracking-[0.12em] uppercase border border-white/10">
                              {featured.category}
                            </span>
                          )}
                        </div>
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                          <span className="flex items-center gap-1.5 text-gold-400/80 text-[0.68rem] font-semibold tracking-[0.14em] uppercase mb-4">
                            <span className="w-6 h-px bg-gold-400/40" aria-hidden="true" /> Featured
                          </span>
                          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-gold-200 transition-colors duration-300">
                            {featured.title}
                          </h2>
                          {featured.excerpt && (
                            <p className="text-white/55 text-base leading-relaxed mb-6 line-clamp-3">
                              {featured.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-white/40 mb-6">
                            {featured.author && (
                              <span className="flex items-center gap-1.5">
                                <User size={13} aria-hidden="true" /> {featured.author}
                              </span>
                            )}
                            {featured.published_at && (
                              <span className="flex items-center gap-1.5">
                                <Calendar size={13} aria-hidden="true" /> {fmtDate(featured.published_at)}
                              </span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-2 text-gold-300 text-sm font-semibold group-hover:gap-4 transition-all duration-300">
                            Read article <ArrowRight size={16} aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </ScrollReveal>
              )}

              {/* Grid of remaining articles */}
              {rest.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="w-8 h-px bg-gold-400/30" aria-hidden="true" />
                    <h2 className="font-playfair text-lg font-semibold text-white/70">More Articles</h2>
                    <span className="flex-1 h-px bg-white/5" aria-hidden="true" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {rest.map((post, i) => (
                      <ScrollReveal key={post.id} delay={i * 70}>
                        <Link to={`/blog/${post.slug}`} className="block group h-full">
                          <article className="premium-card rounded-2xl overflow-hidden ih-card h-full flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold-400/20">
                            <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                              {post.cover_image_url ? (
                                <img
                                  src={post.cover_image_url}
                                  alt={post.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
                                  <PenLine size={28} className="text-white/20" aria-hidden="true" />
                                </div>
                              )}
                              {/* gradient overlay at bottom of image */}
                              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" aria-hidden="true" />
                              {post.category && (
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-gold-300 text-[0.6rem] font-semibold tracking-[0.1em] uppercase border border-white/10">
                                  {post.category}
                                </span>
                              )}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <h3 className="font-playfair text-lg font-bold text-white mb-2 leading-snug group-hover:text-gold-200 transition-colors duration-300">
                                {post.title}
                              </h3>
                              {post.excerpt && (
                                <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                                  {post.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-white/40 mt-auto pt-3 border-t border-white/5">
                                {post.author && (
                                  <span className="flex items-center gap-1.5">
                                    <User size={12} aria-hidden="true" /> {post.author}
                                  </span>
                                )}
                                {post.published_at && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock size={12} aria-hidden="true" /> {fmtDate(post.published_at)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </article>
                        </Link>
                      </ScrollReveal>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
