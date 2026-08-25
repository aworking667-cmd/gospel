import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, PenLine, MessageSquare, Send, CircleCheck as CheckCircle } from 'lucide-react';
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

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 ih-btn-ghost text-sm">
              <ArrowLeft size={15} aria-hidden="true" /> All articles
            </Link>
          </div>
        </div>
      </section>

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
