'use client';

import { create } from 'zustand';

export type JournalEntry = {
  id: string;
  studentId: string;
  studentName: string;
  pages: string[];     // data URLs (one per scanned page)
  pageCount: number;
  filename: string;
  capturedAt: string;  // ISO
  ocr: {
    status: 'pending' | 'done';
    snippet?: string;  // mock extracted text
  };
  cheating: {
    status: 'pending' | 'done';
    match?: { studentId: string; studentName: string; school: string; similarity: number; date: string } | null;
  };
};

export type VideoEntry = {
  id: string;
  studentId: string;
  studentName: string;
  blobUrl: string;
  durationSec: number;
  capturedAt: string;
};

export type AttendanceScan = {
  studentId: string;
  studentName: string;
  scannedAt: string; // ISO
};

type MentorWorkStore = {
  journals: JournalEntry[];
  videos: VideoEntry[];
  attendance: AttendanceScan[];

  addJournal: (j: JournalEntry) => void;
  addVideo: (v: VideoEntry) => void;
  scanAttendance: (s: AttendanceScan) => boolean; // returns false if duplicate today
  resetAttendance: () => void;
  updateJournalAnalysis: (id: string, ocrSnippet: string, match: JournalEntry['cheating']['match']) => void;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const useMentorWorkStore = create<MentorWorkStore>((set, get) => ({
  journals: [],
  videos: [],
  attendance: [],

  addJournal: (j) => set((s) => ({ journals: [j, ...s.journals] })),
  addVideo:   (v) => set((s) => ({ videos:   [v, ...s.videos] })),

  scanAttendance: (s) => {
    const today = todayKey();
    const exists = get().attendance.some(
      (a) => a.studentId === s.studentId && a.scannedAt.slice(0, 10) === today
    );
    if (exists) return false;
    set((st) => ({ attendance: [s, ...st.attendance] }));
    return true;
  },
  resetAttendance: () => set({ attendance: [] }),

  updateJournalAnalysis: (id, ocrSnippet, match) =>
    set((s) => ({
      journals: s.journals.map((j) =>
        j.id === id
          ? { ...j, ocr: { status: 'done', snippet: ocrSnippet }, cheating: { status: 'done', match } }
          : j
      ),
    })),
}));
