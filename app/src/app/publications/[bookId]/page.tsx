'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getBook } from '@/data/books';
import { usePublicationsStore } from '@/stores/publicationsStore';
import { cn } from '@/lib/utils';
import type { BookChapter, Comment } from '@/types';

/* ────────────────────────────────────────────
   Highlighted paragraph renderer
   ──────────────────────────────────────────── */
function HighlightedText({
  text,
  bookId,
  chapterId,
  paragraphIndex,
}: {
  text: string;
  bookId: string;
  chapterId: string;
  paragraphIndex: number;
}) {
  const allHighlights = usePublicationsStore((s) => s.highlights);
  const highlights = useMemo(
    () => allHighlights.filter(
      (h) => h.bookId === bookId && h.chapterId === chapterId && h.paragraphIndex === paragraphIndex
    ),
    [allHighlights, bookId, chapterId, paragraphIndex]
  );

  if (highlights.length === 0) return <>{text}</>;

  // Build a character-level intensity map
  const intensityMap = new Array(text.length).fill(0);
  for (const h of highlights) {
    const start = Math.max(0, h.startOffset);
    const end = Math.min(text.length, h.endOffset);
    for (let i = start; i < end; i++) {
      intensityMap[i] += h.count;
    }
  }

  // Build spans from intensity runs
  const spans: { text: string; intensity: number }[] = [];
  let currentIntensity = intensityMap[0];
  let currentStart = 0;

  for (let i = 1; i <= text.length; i++) {
    const nextIntensity = i < text.length ? intensityMap[i] : -1;
    if (nextIntensity !== currentIntensity) {
      spans.push({
        text: text.slice(currentStart, i),
        intensity: currentIntensity,
      });
      currentStart = i;
      currentIntensity = nextIntensity;
    }
  }

  return (
    <>
      {spans.map((span, i) => {
        if (span.intensity === 0) return <span key={i}>{span.text}</span>;
        // Intensity ranges from 1-10+, opacity from 0.12 to 0.5
        const opacity = Math.min(0.12 + span.intensity * 0.08, 0.5);
        return (
          <mark
            key={i}
            className="rounded-sm transition-colors"
            style={{
              backgroundColor: `rgba(91, 77, 177, ${opacity})`,
              color: 'inherit',
              padding: '1px 0',
            }}
          >
            {span.text}
          </mark>
        );
      })}
    </>
  );
}

/* ────────────────────────────────────────────
   Single comment + nested replies
   ──────────────────────────────────────────── */
function CommentThread({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const allComments = usePublicationsStore((s) => s.comments);
  const addComment = usePublicationsStore((s) => s.addComment);
  const replies = useMemo(
    () => allComments.filter((c) => c.parentId === comment.id),
    [allComments, comment.id]
  );

  const handleSubmitReply = () => {
    if (!replyText.trim() || !replyAuthor.trim()) return;
    addComment({
      bookId: comment.bookId,
      chapterId: comment.chapterId,
      paragraphIndex: comment.paragraphIndex,
      author: replyAuthor.trim(),
      text: replyText.trim(),
      parentId: comment.id,
    });
    setReplyText('');
    setReplyAuthor('');
    setShowReply(false);
  };

  const [now] = useState(() => Date.now());
  const timeAgo = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className={cn('group/comment', depth > 0 && 'ml-6 mt-3 pl-4 border-l-2 border-border')}>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary mt-0.5">
          {comment.author[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-text-primary">{comment.author}</span>
            <span className="text-xs text-text-muted">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-text-primary/80 mt-1 leading-relaxed">{comment.text}</p>
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs text-text-muted hover:text-primary mt-1.5 font-medium transition-colors"
          >
            Reply
          </button>
        </div>
      </div>

      {showReply && (
        <div className="ml-10 mt-3 space-y-2">
          <input
            type="text"
            value={replyAuthor}
            onChange={(e) => setReplyAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-bg-card text-sm focus:outline-none focus:border-primary/40 text-text-primary"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-bg-card text-sm focus:outline-none focus:border-primary/40 text-text-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
            />
            <button
              onClick={handleSubmitReply}
              className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-glow transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {replies.map((reply) => (
        <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   Paragraph with side comments
   ──────────────────────────────────────────── */
function ParagraphBlock({
  text,
  bookId,
  chapter,
  paragraphIndex,
}: {
  text: string;
  bookId: string;
  chapter: BookChapter;
  paragraphIndex: number;
}) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const allComments = usePublicationsStore((s) => s.comments);
  const addComment = usePublicationsStore((s) => s.addComment);
  const addHighlight = usePublicationsStore((s) => s.addHighlight);
  const comments = useMemo(
    () => allComments.filter(
      (c) => c.bookId === bookId && c.chapterId === chapter.id && c.paragraphIndex === paragraphIndex && c.parentId === null
    ),
    [allComments, bookId, chapter.id, paragraphIndex]
  );

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !paragraphRef.current) return;

    const range = selection.getRangeAt(0);
    // Check the selection is within this paragraph
    if (!paragraphRef.current.contains(range.startContainer) || !paragraphRef.current.contains(range.endContainer)) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) return;

    // Calculate offsets relative to the full text
    const preRange = document.createRange();
    preRange.selectNodeContents(paragraphRef.current);
    preRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preRange.toString().length;
    const endOffset = startOffset + selectedText.length;

    addHighlight({
      bookId,
      chapterId: chapter.id,
      paragraphIndex,
      startOffset,
      endOffset,
      text: selectedText,
    });

    selection.removeAllRanges();
  }, [bookId, chapter.id, paragraphIndex, addHighlight]);

  const handleSubmitComment = () => {
    if (!newComment.trim() || !commentAuthor.trim()) return;
    addComment({
      bookId,
      chapterId: chapter.id,
      paragraphIndex,
      author: commentAuthor.trim(),
      text: newComment.trim(),
      parentId: null,
    });
    setNewComment('');
    setCommentAuthor('');
  };

  const totalCommentCount = comments.length;

  return (
    <div className="publication-paragraph group relative flex gap-0">
      {/* Main text */}
      <div className="flex-1 min-w-0">
        <p
          ref={paragraphRef}
          onMouseUp={handleTextSelection}
          className="text-lg md:text-xl leading-[1.8] text-text-primary/85 font-body selection:bg-primary/20 cursor-text"
        >
          <HighlightedText
            text={text}
            bookId={bookId}
            chapterId={chapter.id}
            paragraphIndex={paragraphIndex}
          />
        </p>
      </div>

      {/* Comment indicator on the side */}
      <div className="hidden md:flex flex-col items-center w-12 shrink-0 ml-2 pt-1">
        <button
          onClick={() => setShowComments(!showComments)}
          className={cn(
            'relative w-8 h-8 rounded-full flex items-center justify-center transition-all',
            totalCommentCount > 0
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'text-text-muted/30 hover:text-text-muted hover:bg-bg-elevated opacity-0 group-hover:opacity-100'
          )}
          title="Add a comment"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {totalCommentCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
              {totalCommentCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile comment button */}
      <div className="md:hidden absolute right-0 top-0">
        <button
          onClick={() => setShowComments(!showComments)}
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs',
            totalCommentCount > 0
              ? 'bg-primary/10 text-primary'
              : 'text-text-muted/40'
          )}
        >
          {totalCommentCount > 0 ? totalCommentCount : '💬'}
        </button>
      </div>

      {/* Comments panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, x: 10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 320 }}
            exit={{ opacity: 0, x: 10, width: 0 }}
            className="hidden md:block shrink-0 overflow-hidden"
          >
            <div className="w-80 pl-4 border-l border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Comments
                </span>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Existing comments */}
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {comments.map((c) => (
                  <CommentThread key={c.id} comment={c} />
                ))}
                {comments.length === 0 && (
                  <p className="text-xs text-text-muted italic">No comments yet. Be the first!</p>
                )}
              </div>

              {/* New comment form */}
              <div className="space-y-2 pt-3 border-t border-border">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-bg-card text-sm focus:outline-none focus:border-primary/40 text-text-primary"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-bg-card text-sm focus:outline-none focus:border-primary/40 text-text-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                  />
                  <button
                    onClick={handleSubmitComment}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-glow transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile comments modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-bg-card border-t border-border rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-text-primary">Comments</span>
              <button
                onClick={() => setShowComments(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-4">
              {comments.map((c) => (
                <CommentThread key={c.id} comment={c} />
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-text-muted italic">No comments yet.</p>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg-elevated text-sm text-text-primary"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg-elevated text-sm text-text-primary"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <button
                  onClick={handleSubmitComment}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────
   Chapter renderer
   ──────────────────────────────────────────── */
function ChapterSection({
  chapter,
  bookId,
}: {
  chapter: BookChapter;
  bookId: string;
}) {
  return (
    <section id={`chapter-${chapter.number}`} className="scroll-mt-28">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-8">
        <span className="text-text-muted/40 mr-3 font-light">{chapter.number}.</span>
        {chapter.title}
      </h2>

      {/* Optional video embed */}
      {chapter.videoUrl && (
        <div className="mb-10">
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <div className="aspect-video">
              <iframe
                src={chapter.videoUrl}
                title={chapter.videoCaption || chapter.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
          {chapter.videoCaption && (
            <p className="text-sm text-text-muted mt-2 text-center">{chapter.videoCaption}</p>
          )}
        </div>
      )}

      <div className="space-y-6">
        {chapter.paragraphs.map((p, i) => (
          <ParagraphBlock
            key={i}
            text={p}
            bookId={bookId}
            chapter={chapter}
            paragraphIndex={i}
          />
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   Main book reader page
   ──────────────────────────────────────────── */
export default function BookReaderPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const book = getBook(bookId);
  const [activeChapter, setActiveChapter] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  // Track active chapter via scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const num = parseInt(entry.target.id.replace('chapter-', ''), 10);
            if (!isNaN(num)) setActiveChapter(num);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    const sections = document.querySelectorAll('[id^="chapter-"]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  if (!book) {
    return (
      <div className="min-h-screen bg-bg-deep pt-28 pb-20 px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-4">Publication not found</h1>
        <Link href="/publications" className="text-primary hover:underline">
          Back to Publications
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep pt-24 pb-32">
      {/* Sticky top bar */}
      <div className="fixed top-16 md:top-20 left-0 right-0 z-30 glass-elevated border-b border-border">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/publications"
              className="text-text-muted hover:text-text-primary transition-colors shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-sm font-medium text-text-primary truncate">{book.title}</span>
            <span className="text-xs text-text-muted hidden sm:inline">
              Ch. {activeChapter || 1} of {book.chapters.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-primary hover:bg-primary/5 transition-all"
              title="Download PDF"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Table of contents toggle */}
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-primary hover:bg-primary/5 transition-all md:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 flex gap-8">
        {/* Desktop table of contents sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-44">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Contents
            </h3>
            <nav className="space-y-1">
              {book.chapters.map((ch) => (
                <a
                  key={ch.id}
                  href={`#chapter-${ch.number}`}
                  className={cn(
                    'block px-3 py-1.5 rounded-lg text-sm transition-all',
                    activeChapter === ch.number
                      ? 'text-primary bg-primary/5 font-medium'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                  )}
                >
                  <span className="text-text-muted/40 mr-2">{ch.number}.</span>
                  {ch.title}
                </a>
              ))}
            </nav>

            {/* Highlight hint */}
            <div className="mt-8 p-3 rounded-xl bg-bg-elevated border border-border">
              <p className="text-xs text-text-muted leading-relaxed">
                <span className="font-semibold text-text-primary block mb-1">Highlight text</span>
                Select any text to highlight it. More highlights from readers make text darker.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile table of contents */}
        <AnimatePresence>
          {tocOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/30" onClick={() => setTocOpen(false)} />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-bg-card border-r border-border p-6 pt-24 overflow-y-auto"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-4">Contents</h3>
                <nav className="space-y-1">
                  {book.chapters.map((ch) => (
                    <a
                      key={ch.id}
                      href={`#chapter-${ch.number}`}
                      onClick={() => setTocOpen(false)}
                      className={cn(
                        'block px-3 py-2 rounded-lg text-sm transition-all',
                        activeChapter === ch.number
                          ? 'text-primary bg-primary/5 font-medium'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      <span className="text-text-muted/40 mr-2">{ch.number}.</span>
                      {ch.title}
                    </a>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <article className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
          {/* Book header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center lg:text-left"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-3 text-balance">
              {book.title}
            </h1>
            <p className="text-xl text-text-muted mb-4">{book.subtitle}</p>
            <p className="text-sm text-text-muted">{book.author}</p>
            <div className="mt-6 section-divider" />
          </motion.header>

          {/* Chapters */}
          <div className="space-y-20">
            {book.chapters.map((chapter, i) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ChapterSection chapter={chapter} bookId={book.id} />
                {i < book.chapters.length - 1 && <div className="section-divider mt-16" />}
              </motion.div>
            ))}
          </div>

          {/* End */}
          <div className="mt-20 text-center py-12 border-t border-border">
            <p className="text-text-muted text-sm mb-4">End of book</p>
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-glow transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Publications
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
