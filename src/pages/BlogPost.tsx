import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, PenLine, MessageSquare, Send, CircleCheck as CheckCircle, Share2, Copy, Check } from 'lucide-react';
import { getSupabaseClient, insertBlogComment, fetchApprovedComments } from '@/lib/supabase';
import { useSEO } from '@/hooks/useSEO';
import ScrollReveal from '@/components/ScrollReveal';

type Comment = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  parent_id: string | null;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
};

type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author: string | null;
  category: string | null;
  published_at: string | null;
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState<BlogPostSummary[]>([]);
  const [copied, setCopied] = useState(false);

  useSEO({
    title: post ? `${post.title} | In Him Daily Blog` : 'Article | In Him Daily',
    description: post?.excerpt ?? 'In Him Daily Blog',
    canonicalPath: `/blog/${slug}`,
  });

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      setError('');
      try {
        const supabase = getSupabaseClient();
        const { data, error: err } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();
        if (err) throw err;
        if (!data) {
          setError('Article not found.');
          setPost(null);
        } else {
          setPost(data as BlogPost);
          try {
            const cmts = await fetchApprovedComments((data as BlogPost).id);
            setComments(cmts);
          } catch { /* comments optional */ }
          // Fetch related posts (same category, excluding current)
          try {
            const supabase2 = getSupabaseClient();
            const { data: relData } = await supabase2
              .from('blog_posts')
              .select('id, title, slug, excerpt, cover_image_url, author, category, published_at')
              .eq('status', 'published')
              .neq('id', (data as BlogPost).id)
              .order('published_at', { ascending: false })
              .limit(3);
            setRelatedPosts((relData ?? []) as BlogPostSummary[]);
          } catch { /* related optional */ }
        }
      } catch {
        setError('Article could not be loaded. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  function fmtDate(iso: string | null) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <PenLine size={40} className="text-white/20 mx-auto mb-4" aria-hidden="true" />
          <h1 className="font-playfair text-2xl font-bold text-white mb-3">
            {error || 'Article not found'}
          </h1>
          <Link to="/blog" className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 transition-colors text-sm font-semibold">
            <ArrowLeft size={15} aria-hidden="true" /> Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden" aria-label="Article hero">
        <div className="absolute inset-0" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(201,152,58,0.10) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-gold-300 transition-colors text-sm mb-6">
            <ArrowLeft size={15} aria-hidden="true" /> Back to blog
          </Link>
          {post.category && (
            <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-3">{post.category}</p>
          )}
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-white/60 text-lg leading-relaxed mb-5">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/45">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User size={14} aria-hidden="true" /> {post.author}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} aria-hidden="true" /> {fmtDate(post.published_at)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <article
              className="blog-content text-white/75 leading-relaxed text-[1.05rem]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </ScrollReveal>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
                  <Tag size={11} aria-hidden="true" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share buttons */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm text-white/50 font-medium">
                <Share2 size={15} aria-hidden="true" /> Share
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + window.location.href)}`, '_blank')}
                  aria-label="Share on WhatsApp"
                  className="w-9 h-9 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#128C7E]" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  aria-label="Share on Facebook"
                  className="w-9 h-9 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/25 flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#1877F2]" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title + ' — ' + window.location.href)}`, '_blank')}
                  aria-label="Share on X"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-white/70" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  aria-label={copied ? 'Link copied' : 'Copy link'}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
                >
                  {copied ? <Check size={13} className="text-green-400" aria-hidden="true" /> : <Copy size={13} className="text-gold-300" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 ih-btn-ghost text-sm">
              <ArrowLeft size={15} aria-hidden="true" /> All articles
            </Link>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="pb-20" aria-label="Related articles">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-white/10 pt-12">
              <h2 className="font-playfair text-2xl font-bold text-white mb-8 text-center">Continue Reading</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((rp, i) => (
                  <ScrollReveal key={rp.id} delay={i * 80}>
                    <Link to={`/blog/${rp.slug}`} className="block group h-full">
                      <article className="premium-card rounded-2xl overflow-hidden ih-card h-full flex flex-col">
                        <div className="aspect-[16/10] overflow-hidden bg-white/5">
                          {rp.cover_image_url ? (
                            <img
                              src={rp.cover_image_url}
                              alt={rp.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PenLine size={28} className="text-white/20" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          {rp.category && (
                            <span className="text-gold-400 text-[0.68rem] font-semibold tracking-[0.14em] uppercase mb-2">
                              {rp.category}
                            </span>
                          )}
                          <h3 className="font-playfair text-base font-bold text-white mb-2 leading-snug group-hover:text-gold-200 transition-colors">
                            {rp.title}
                          </h3>
                          {rp.excerpt && (
                            <p className="text-white/50 text-sm leading-relaxed line-clamp-2 flex-1">
                              {rp.excerpt}
                            </p>
                          )}
                          {rp.published_at && (
                            <span className="flex items-center gap-1.5 text-xs text-white/40 mt-3">
                              <Calendar size={11} aria-hidden="true" /> {fmtDate(rp.published_at)}
                            </span>
                          )}
                        </div>
                      </article>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comments section */}
      <section className="pb-20" aria-label="Comments">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ih-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={20} className="text-gold-300" />
              <h2 className="font-playfair text-xl font-bold text-white">
                Comments{comments.length > 0 && <span className="text-white/40 text-base ml-2">({comments.length})</span>}
              </h2>
            </div>

            {commentSuccess ? (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3 items-start mb-6">
                <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-300">Thank you for your comment!</p>
                  <p className="text-xs text-green-400/70 mt-0.5">It will appear here once approved by our team.</p>
                </div>
              </div>
            ) : (
              <form
                className="space-y-4 mb-8"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!commentName.trim() || !commentEmail.trim() || !commentBody.trim()) return;
                  setSubmitting(true);
                  setCommentError('');
                  try {
                    await insertBlogComment({
                      post_id: post.id,
                      author_name: commentName.trim(),
                      author_email: commentEmail.trim(),
                      content: commentBody.trim(),
                    });
                    setCommentSuccess(true);
                    setCommentName('');
                    setCommentEmail('');
                    setCommentBody('');
                  } catch {
                    setCommentError('Could not submit comment. Please try again.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {commentError && (
                  <p className="text-sm text-red-300">{commentError}</p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="comment-name" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Name</label>
                    <input
                      id="comment-name"
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="ih-input w-full px-4 py-3 text-sm"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="comment-email" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Email (not shown)</label>
                    <input
                      id="comment-email"
                      type="email"
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      className="ih-input w-full px-4 py-3 text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment-body" className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Comment</label>
                  <textarea
                    id="comment-body"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    rows={4}
                    className="ih-input w-full px-4 py-3 text-sm resize-none"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-ink-900 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : <><Send size={14} /> Post Comment</>}
                </button>
                <p className="text-xs text-white/30">Comments are reviewed by our team before appearing publicly.</p>
              </form>
            )}

            {comments.length > 0 ? (
              <div className="space-y-4 pt-6 border-t border-white/10">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-gold-300">{c.author_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{c.author_name}</span>
                        <span className="text-xs text-white/30">{fmtDate(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/30 text-center pt-6 border-t border-white/10">
                Be the first to share your thoughts.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
