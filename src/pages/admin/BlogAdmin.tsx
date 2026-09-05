import { useEffect, useState, useCallback, useRef } from 'react';
import { getSupabaseClient, uploadBlogCoverImage } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, RefreshCw, AlertCircle, Upload, Link2, ImagePlus } from 'lucide-react';

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
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type EditState = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author: string;
  category: string;
  tags: string;
  status: 'draft' | 'published';
};

const EMPTY: EditState = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  author: '',
  category: '',
  tags: '',
  status: 'draft',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = getSupabaseClient();
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setPosts((data ?? []) as BlogPost[]);
    } catch {
      setError('Could not load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function startNew() {
    setEditing({ ...EMPTY });
    setSaveError('');
    setUploadError('');
    setImageMode('upload');
  }

  function startEdit(post: BlogPost) {
    setEditing({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? '',
      content: post.content,
      cover_image_url: post.cover_image_url ?? '',
      author: post.author ?? '',
      category: post.category ?? '',
      tags: (post.tags ?? []).join(', '),
      status: (post.status as 'draft' | 'published') ?? 'draft',
    });
    setSaveError('');
    setUploadError('');
    setImageMode(post.cover_image_url ? 'url' : 'upload');
  }

  async function save() {
    if (!editing) return;
    if (!editing.title.trim()) {
      setSaveError('Title is required.');
      return;
    }
    if (!editing.content.trim()) {
      setSaveError('Content is required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const slug = editing.slug.trim() || slugify(editing.title);
    const tags = editing.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: editing.title.trim(),
      slug,
      excerpt: editing.excerpt.trim() || null,
      content: editing.content,
      cover_image_url: editing.cover_image_url.trim() || null,
      author: editing.author.trim() || null,
      category: editing.category.trim() || null,
      tags: tags.length > 0 ? tags : null,
      status: editing.status,
      published_at:
        editing.status === 'published'
          ? new Date().toISOString()
          : null,
    };

    try {
      const supabase = getSupabaseClient();
      if (editing.id) {
        const { error: err } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('blog_posts')
          .insert(payload);
        if (err) throw err;
      }
      setEditing(null);
      await load();
    } catch (err) {
      setSaveError(
        err instanceof Error && err.message
          ? `Save failed: ${err.message}`
          : 'Save failed. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      const supabase = getSupabaseClient();
      const { error: err } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);
      if (err) throw err;
      await load();
    } catch {
      setError('Could not delete post. Please try again.');
    }
  }

  async function togglePublish(post: BlogPost) {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const supabase = getSupabaseClient();
      const { error: err } = await supabase
        .from('blog_posts')
        .update({
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null,
        })
        .eq('id', post.id);
      if (err) throw err;
      await load();
    } catch {
      setError('Could not update post status.');
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-amber-200">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/50">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} total
        </p>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white/70 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" /> Refresh
          </button>
          <button
            onClick={startNew}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-[#05070D] rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus size={14} aria-hidden="true" /> New Article
          </button>
        </div>
      </div>

      {/* Post list */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50">
          <RefreshCw size={20} className="animate-spin mr-3" /> Loading articles...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/40 text-sm">No articles yet. Click "New Article" to write your first post.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-400/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                {post.cover_image_url ? (
                  <img src={post.cover_image_url} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{post.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-semibold border ${
                    post.status === 'published'
                      ? 'bg-green-500/15 text-green-300 border-green-500/30'
                      : 'bg-gray-500/15 text-gray-400 border-gray-500/30'
                  }`}>
                    {post.status}
                  </span>
                  {post.category && (
                    <span className="text-[0.65rem] text-gold-300">{post.category}</span>
                  )}
                  <span className="text-[0.65rem] text-white/40">{fmtDate(post.published_at ?? post.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {post.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => startEdit(post)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-gold-300 transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(post)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0B1220] border border-white/15 shadow-2xl">
            <div className="sticky top-0 z-10 bg-[#0B1220] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="font-playfair text-lg font-bold text-white">
                {editing.id ? 'Edit Article' : 'New Article'}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {saveError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex gap-2 items-start">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" /> {saveError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="ih-input w-full px-4 py-2.5 text-sm"
                  placeholder="Article title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Slug <span className="text-white/30 normal-case font-normal">(URL: /blog/your-slug)</span>
                </label>
                <input
                  type="text"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="ih-input w-full px-4 py-2.5 text-sm font-mono"
                  placeholder="auto-generated from title"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Excerpt</label>
                <textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  rows={2}
                  className="ih-input w-full px-4 py-2.5 text-sm resize-none"
                  placeholder="Short summary shown on the blog listing page"
                />
              </div>

              {/* Cover image — upload or URL */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Cover Image</label>

                {/* Preview */}
                {editing.cover_image_url && (
                  <div className="relative mb-3 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <img src={editing.cover_image_url} alt="Cover preview" className="w-full max-h-56 object-cover" />
                    <button
                      onClick={() => setEditing({ ...editing, cover_image_url: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-colors"
                      title="Remove cover"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Mode toggle */}
                {!editing.cover_image_url && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setImageMode('upload')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        imageMode === 'upload' ? 'bg-gold-500/20 text-gold-300 border border-gold-400/40' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'
                      }`}
                    >
                      <Upload size={12} /> Upload
                    </button>
                    <button
                      onClick={() => setImageMode('url')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        imageMode === 'url' ? 'bg-gold-500/20 text-gold-300 border border-gold-400/40' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'
                      }`}
                    >
                      <Link2 size={12} /> URL
                    </button>
                  </div>
                )}

                {/* Upload mode */}
                {imageMode === 'upload' && !editing.cover_image_url && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          setUploadError('Image must be under 5 MB.');
                          return;
                        }
                        setUploading(true);
                        setUploadError('');
                        try {
                          const url = await uploadBlogCoverImage(file);
                          setEditing({ ...editing, cover_image_url: url });
                        } catch {
                          setUploadError('Upload failed. Please try again.');
                        } finally {
                          setUploading(false);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-white/15 hover:border-gold-400/40 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                    >
                      {uploading ? (
                        <><RefreshCw size={24} className="animate-spin text-gold-400" />
                        <span className="text-sm text-white/50">Uploading...</span></>
                      ) : (
                        <><ImagePlus size={24} className="text-white/30 group-hover:text-gold-400/60 transition-colors" />
                        <span className="text-sm text-white/40">Click to upload a cover photo</span>
                        <span className="text-xs text-white/25">PNG, JPG, WebP — max 5 MB</span></>
                      )}
                    </button>
                    {uploadError && <p className="text-xs text-red-300 mt-2">{uploadError}</p>}
                  </div>
                )}

                {/* URL mode */}
                {imageMode === 'url' && !editing.cover_image_url && (
                  <input
                    type="url"
                    value={editing.cover_image_url}
                    onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                    className="ih-input w-full px-4 py-2.5 text-sm"
                    placeholder="https://images.pexels.com/..."
                  />
                )}
              </div>

              {/* Author + Category */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Author</label>
                  <input
                    type="text"
                    value={editing.author}
                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                    className="ih-input w-full px-4 py-2.5 text-sm"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="ih-input w-full px-4 py-2.5 text-sm"
                    placeholder="e.g. Devotional, Testimony"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Tags <span className="text-white/30 normal-case font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={editing.tags}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                  className="ih-input w-full px-4 py-2.5 text-sm"
                  placeholder="faith, family, prayer"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Content <span className="text-white/30 normal-case font-normal">(HTML supported)</span>
                </label>
                <textarea
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={12}
                  className="ih-input w-full px-4 py-3 text-sm font-mono resize-y leading-relaxed"
                  placeholder="<h2>Heading</h2>&#10;<p>Your article content...</p>"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Status</label>
                <div className="flex gap-2">
                  {(['draft', 'published'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditing({ ...editing, status: s })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        editing.status === s
                          ? 'bg-gold-500 text-[#05070D]'
                          : 'bg-white/5 text-white/50 hover:text-white border border-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[#0B1220] border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-[#05070D] text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
