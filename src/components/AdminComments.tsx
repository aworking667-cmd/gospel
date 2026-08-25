import { useEffect, useState, useCallback } from 'react';
import { MessageSquare, Check, X, Trash2, RefreshCw, Clock } from 'lucide-react';
import {
  fetchAllComments,
  moderateComment,
  deleteComment,
  type AdminComment,
} from '@/lib/supabase';

type CommentWithPost = AdminComment & { blog_posts: { title: string } | null };

export default function AdminComments() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllComments();
      setComments(data);
    } catch {
      setError('Could not load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(id: string) {
    try {
      await moderateComment(id, 'approved');
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: 'approved', moderated_at: new Date().toISOString() } : c));
    } catch {
      setError('Could not approve comment.');
    }
  }

  async function handleReject(id: string) {
    try {
      await moderateComment(id, 'rejected');
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: 'rejected', moderated_at: new Date().toISOString() } : c));
    } catch {
      setError('Could not reject comment.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Could not delete comment.');
    }
  }

  const filtered = comments.filter((c) => filter === 'all' || c.status === filter);
  const pendingCount = comments.filter((c) => c.status === 'pending').length;
  const approvedCount = comments.filter((c) => c.status === 'approved').length;
  const rejectedCount = comments.filter((c) => c.status === 'rejected').length;

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    approved: 'bg-green-500/15 text-green-300 border-green-500/30',
    rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{error}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-gold-300" />
          <h2 className="font-playfair text-lg font-bold text-white">Comments Moderation</h2>
        </div>
        <button onClick={load} disabled={loading} className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors" aria-label="Refresh">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-1.5 mb-6">
        {([
          { id: 'pending', label: 'Pending', count: pendingCount },
          { id: 'approved', label: 'Approved', count: approvedCount },
          { id: 'rejected', label: 'Rejected', count: rejectedCount },
          { id: 'all', label: 'All', count: comments.length },
        ] as const).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${filter === f.id ? 'bg-gold-500/20 text-gold-300' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
          >
            {f.label}
            {f.count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[0.65rem] font-bold ${filter === f.id ? 'bg-gold-500/30 text-gold-200' : 'bg-white/10 text-white/50'}`}>{f.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50">
          <RefreshCw size={18} className="animate-spin mr-2" /> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/30">
          <MessageSquare size={32} className="mb-3" />
          <p className="text-sm">No comments found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="ih-card-solid p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{c.author_name}</span>
                    <span className="text-xs text-white/30">{c.author_email}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-semibold border ${STATUS_STYLES[c.status] ?? ''}`}>
                      {c.status}
                    </span>
                  </div>
                  {c.blog_posts?.title && (
                    <p className="text-xs text-gold-300/70 mb-2">on &ldquo;{c.blog_posts.title}&rdquo;</p>
                  )}
                </div>
                <span className="text-xs text-white/30 shrink-0 flex items-center gap-1">
                  <Clock size={11} /> {fmtDate(c.created_at)}
                </span>
              </div>

              <p className="text-sm text-white/70 leading-relaxed mb-4 whitespace-pre-wrap">{c.content}</p>

              {c.admin_note && (
                <p className="text-xs text-white/40 italic mb-3">Admin note: {c.admin_note}</p>
              )}

              <div className="flex items-center gap-2">
                {c.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-300 text-xs font-semibold transition-colors"
                    >
                      <Check size={13} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-semibold transition-colors"
                    >
                      <X size={13} /> Reject
                    </button>
                  </>
                )}
                {c.status === 'approved' && (
                  <button
                    onClick={() => handleReject(c.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-semibold transition-colors"
                  >
                    <X size={13} /> Unapprove
                  </button>
                )}
                {c.status === 'rejected' && (
                  <button
                    onClick={() => handleApprove(c.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-300 text-xs font-semibold transition-colors"
                  >
                    <Check size={13} /> Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 text-xs font-semibold transition-colors ml-auto"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
