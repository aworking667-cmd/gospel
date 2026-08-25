import { useEffect, useState, useCallback } from 'react';
import { Inbox, Mail, MailOpen, Send, Reply, Trash2, Paperclip, X, RefreshCw, Search, Download } from 'lucide-react';
import {
  fetchAdminEmails,
  updateEmailStatus,
  deleteEmail,
  type AdminEmail,
  type AttachmentMeta,
} from '@/lib/supabase';

export default function AdminInbox({ onComposeReply }: { onComposeReply: (email: string, subject: string, inReplyTo?: string, threadId?: string) => void }) {
  const [emails, setEmails] = useState<AdminEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<AdminEmail | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'inbound' | 'outbound'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminEmails();
      setEmails(data);
    } catch {
      setError('Could not load emails. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSelect(email: AdminEmail) {
    setSelected(email);
    if (email.direction === 'inbound' && email.status === 'unread') {
      await updateEmailStatus(email.id, 'read');
      setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, status: 'read' } : e));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEmail(id);
      setEmails((prev) => prev.filter((e) => e.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setError('Could not delete email.');
    }
  }

  const filtered = emails.filter((e) => {
    if (filter === 'unread' && e.status !== 'unread') return false;
    if (filter === 'inbound' && e.direction !== 'inbound') return false;
    if (filter === 'outbound' && e.direction !== 'outbound') return false;
    if (search) {
      const q = search.toLowerCase();
      return e.subject.toLowerCase().includes(q) || e.from_email.toLowerCase().includes(q) || (e.from_name ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = emails.filter((e) => e.direction === 'inbound' && e.status === 'unread').length;

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      {/* Email list */}
      <div className="lg:w-96 lg:border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={18} className="text-gold-300" />
              <h2 className="font-playfair text-lg font-bold text-white">Inbox</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold">{unreadCount}</span>
              )}
            </div>
            <button onClick={load} disabled={loading} className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors" aria-label="Refresh">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emails..."
              className="ih-input w-full pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'unread', 'inbound', 'outbound'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-gold-500/20 text-gold-300' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/50">
              <RefreshCw size={18} className="animate-spin mr-2" /> Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/30">
              <Mail size={32} className="mb-3" />
              <p className="text-sm">No emails found.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((email) => (
                <button
                  key={email.id}
                  onClick={() => handleSelect(email)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${selected?.id === email.id ? 'bg-white/10' : ''} ${email.status === 'unread' && email.direction === 'inbound' ? 'border-l-2 border-l-gold-400' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {email.direction === 'inbound' && email.status === 'unread' ? (
                        <Mail size={14} className="text-gold-300 shrink-0" />
                      ) : email.direction === 'outbound' ? (
                        <Send size={14} className="text-white/30 shrink-0" />
                      ) : (
                        <MailOpen size={14} className="text-white/30 shrink-0" />
                      )}
                      <span className={`text-sm truncate ${email.status === 'unread' && email.direction === 'inbound' ? 'font-semibold text-white' : 'text-white/60'}`}>
                        {email.direction === 'outbound' ? `To: ${email.to_email}` : (email.from_name ?? email.from_email)}
                      </span>
                    </div>
                    <span className="text-[0.7rem] text-white/30 shrink-0">{fmtDate(email.created_at)}</span>
                  </div>
                  <p className={`text-sm truncate ${email.status === 'unread' && email.direction === 'inbound' ? 'text-white/80' : 'text-white/50'}`}>{email.subject}</p>
                  {email.attachments && email.attachments.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-white/30">
                      <Paperclip size={11} /> {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email detail */}
      <div className="flex-1 flex flex-col">
        {error && (
          <div className="p-3 bg-red-500/10 border-b border-red-500/20 text-sm text-red-300">{error}</div>
        )}
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30">
            <Mail size={40} className="mb-4" />
            <p className="text-sm">Select an email to read.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">{selected.subject}</h3>
                <div className="space-y-1 text-sm text-white/50">
                  <p><span className="text-white/30">From:</span> {selected.from_name ? `${selected.from_name} <${selected.from_email}>` : selected.from_email}</p>
                  <p><span className="text-white/30">To:</span> {selected.to_email}</p>
                  <p><span className="text-white/30">Date:</span> {new Date(selected.created_at).toLocaleString('en-GB')}</p>
                  {selected.source && <p><span className="text-white/30">Source:</span> {selected.source.replace(/_/g, ' ')}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selected.direction === 'inbound' && (
                  <button
                    onClick={() => onComposeReply(selected.from_email, selected.subject.startsWith('Re: ') ? selected.subject : `Re: ${selected.subject}`, selected.id, selected.thread_id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-ink-900 text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Reply size={14} /> Reply
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="p-2 rounded-xl text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  aria-label="Delete email"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              {selected.body_html ? (
                <div
                  className="prose prose-invert max-w-none text-white/75 leading-relaxed [&_a]:text-gold-300 [&_a:hover]:text-gold-200"
                  dangerouslySetInnerHTML={{ __html: selected.body_html }}
                />
              ) : (
                <p className="text-white/75 whitespace-pre-wrap leading-relaxed">{selected.body_text ?? '(no body)'}</p>
              )}
            </div>

            {selected.attachments && selected.attachments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                  <Paperclip size={15} /> Attachments ({selected.attachments.length})
                </h4>
                <div className="space-y-2">
                  {selected.attachments.map((att: AttachmentMeta, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                        <Paperclip size={15} className="text-gold-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white/80 truncate">{att.filename}</p>
                        <p className="text-xs text-white/30">{fmtSize(att.size)}</p>
                      </div>
                      <a
                        href={att.url}
                        download={att.filename}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gold-300 hover:bg-gold-500/10 transition-colors"
                      >
                        <Download size={13} /> Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
