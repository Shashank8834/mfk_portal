'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Highlight, Comment } from '@/types';

interface PublicationsState {
  highlights: Highlight[];
  comments: Comment[];
  addHighlight: (highlight: Omit<Highlight, 'id' | 'count' | 'createdAt'>) => void;
  getHighlightsForParagraph: (bookId: string, chapterId: string, paragraphIndex: number) => Highlight[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getCommentsForParagraph: (bookId: string, chapterId: string, paragraphIndex: number) => Comment[];
  getReplies: (parentId: string) => Comment[];
}

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

function rangesOverlap(
  a: { startOffset: number; endOffset: number },
  b: { startOffset: number; endOffset: number }
): boolean {
  return a.startOffset < b.endOffset && b.startOffset < a.endOffset;
}

export const usePublicationsStore = create<PublicationsState>()(
  persist(
    (set, get) => ({
      highlights: [],
      comments: [],

      addHighlight: (h) => {
        set((state) => {
          // Check for overlapping highlights in the same paragraph
          const existing = state.highlights.find(
            (ex) =>
              ex.bookId === h.bookId &&
              ex.chapterId === h.chapterId &&
              ex.paragraphIndex === h.paragraphIndex &&
              rangesOverlap(ex, h)
          );

          if (existing) {
            // Increase count (darker highlight)
            return {
              highlights: state.highlights.map((ex) =>
                ex.id === existing.id ? { ...ex, count: ex.count + 1 } : ex
              ),
            };
          }

          return {
            highlights: [
              ...state.highlights,
              {
                ...h,
                id: generateId(),
                count: 1,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      getHighlightsForParagraph: (bookId, chapterId, paragraphIndex) => {
        return get().highlights.filter(
          (h) =>
            h.bookId === bookId &&
            h.chapterId === chapterId &&
            h.paragraphIndex === paragraphIndex
        );
      },

      addComment: (c) => {
        set((state) => ({
          comments: [
            ...state.comments,
            {
              ...c,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      getCommentsForParagraph: (bookId, chapterId, paragraphIndex) => {
        return get().comments.filter(
          (c) =>
            c.bookId === bookId &&
            c.chapterId === chapterId &&
            c.paragraphIndex === paragraphIndex &&
            c.parentId === null
        );
      },

      getReplies: (parentId) => {
        return get().comments.filter((c) => c.parentId === parentId);
      },
    }),
    {
      name: 'mfk-publications',
    }
  )
);
