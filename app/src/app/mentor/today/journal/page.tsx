'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ScanLine, Sparkles, AlertTriangle, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import QRScanner from '@/components/mentor/QRScanner';
import DocumentScanner from '@/components/mentor/DocumentScanner';
import { studentByQR, MentorStudent, MENTOR_STUDENTS } from '@/data/mentorStudents';
import { useMentorWorkStore, JournalEntry } from '@/stores/mentorWorkStore';

type Stage = 'scan-qr' | 'capture' | 'analysing' | 'done';

const SAMPLE_OCR = [
  'Today we learnt about the water cycle. Evaporation happens when the sun heats up the water in rivers and oceans. The water becomes vapour and rises up. Then it condenses to form clouds. Finally rain falls back to earth. This is why we should not waste water.',
  'I helped my mother in the kitchen today. We made dosa for breakfast. I learnt that mixing the batter takes patience. My favourite part of the day was when my little sister tried to flip the dosa and it fell on the counter. We all laughed.',
  'In maths class we did fractions. Sir explained how 1/2 plus 1/4 is not 2/6. We have to make the bottom number same first. I solved 8 problems correctly out of 10.',
];

export default function JournalFlow() {
  const addJournal = useMentorWorkStore((s) => s.addJournal);
  const updateJournalAnalysis = useMentorWorkStore((s) => s.updateJournalAnalysis);
  const journals = useMentorWorkStore((s) => s.journals);

  const [stage, setStage] = useState<Stage>('scan-qr');
  const [student, setStudent] = useState<MentorStudent | null>(null);
  const [journalId, setJournalId] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  function handleQR(qr: string) {
    const s = studentByQR(qr);
    if (!s) {
      setScanError(`Unknown QR code: ${qr}`);
      return;
    }
    setScanError(null);
    setStudent(s);
    setStage('capture');
  }

  function handleSavePages(pages: string[]) {
    if (!student) return;
    const id = `JNL-${Date.now()}`;
    const now = new Date();
    const filename = `Journal_${student.name.replace(/\s+/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
    const entry: JournalEntry = {
      id,
      studentId: student.id,
      studentName: student.name,
      pages,
      pageCount: pages.length,
      filename,
      capturedAt: now.toISOString(),
      ocr: { status: 'pending' },
      cheating: { status: 'pending' },
    };
    addJournal(entry);
    setJournalId(id);
    setStage('analysing');

    // Mock OCR + cheating-detection latency
    setTimeout(() => {
      const snippet = SAMPLE_OCR[Math.floor(Math.random() * SAMPLE_OCR.length)];
      // Mock: ~25% chance of a flagged match (excluding this student)
      const others = MENTOR_STUDENTS.filter((s) => s.id !== student.id);
      const willFlag = Math.random() < 0.25;
      const match = willFlag
        ? {
            studentId: others[0].id,
            studentName: others[0].name,
            school: 'JNV Koramangala',
            similarity: 87 + Math.floor(Math.random() * 10),
            date: new Date(Date.now() - 14 * 86400 * 1000).toISOString().slice(0, 10),
          }
        : null;
      updateJournalAnalysis(id, snippet, match);
      setStage('done');
    }, 1800);
  }

  const journal = journalId ? journals.find((j) => j.id === journalId) : null;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mentor/today" className="p-2 -ml-2 rounded-lg hover:bg-[#F0EEF7]">
          <ArrowLeft size={18} className="text-[#1A1635]" />
        </Link>
        <div>
          <h1 className="font-bold text-[#1A1635]">Scan journal</h1>
          {student && <p className="text-xs text-[#6B6590]">For {student.name} · {student.rollNo}</p>}
        </div>
      </div>

      {scanError && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle size={14} /> {scanError}
        </div>
      )}

      {stage === 'scan-qr' && (
        <QRScanner
          onScan={handleQR}
          onClose={() => history.back()}
          hint="Hold the camera over the QR code on the student's name card or journal cover."
        />
      )}

      {stage === 'capture' && student && (
        <DocumentScanner
          studentName={student.name}
          onSave={handleSavePages}
          onCancel={() => setStage('scan-qr')}
        />
      )}

      {stage === 'analysing' && student && (
        <div className="bg-white border border-[rgba(91,77,177,0.12)] rounded-2xl p-8 text-center shadow-sm">
          <Loader2 size={36} className="text-[#5B4DB1] mx-auto mb-3 animate-spin" />
          <p className="font-semibold text-[#1A1635]">Processing journal…</p>
          <p className="text-sm text-[#6B6590] mt-1">Running OCR and comparing across the network.</p>
        </div>
      )}

      {stage === 'done' && journal && student && (
        <div className="space-y-4">
          {/* File card */}
          <div className="bg-white border border-[rgba(91,77,177,0.12)] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0EEF7] flex items-center justify-center">
                <FileText size={18} className="text-[#5B4DB1]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1A1635] truncate">{journal.filename}</p>
                <p className="text-xs text-[#6B6590]">{journal.pageCount} pages · attached to {student.name}'s profile</p>
              </div>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {journal.pages.map((p, i) => (
                <img key={i} src={p} alt={`Page ${i + 1}`} className="w-14 h-18 rounded-md object-cover border border-[rgba(91,77,177,0.15)]" />
              ))}
            </div>
          </div>

          {/* OCR card */}
          <div className="bg-white border border-[rgba(91,77,177,0.12)] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#5B4DB1]" />
              <p className="font-semibold text-[#1A1635] text-sm">OCR — searchable text</p>
            </div>
            <p className="text-sm text-[#3a355a] leading-relaxed bg-[#F8F7FC] rounded-lg p-3 italic">
              "{journal.ocr.snippet}"
            </p>
          </div>

          {/* Cheating-check card */}
          {journal.cheating.match ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <p className="font-semibold text-amber-900 text-sm">Possible match flagged</p>
              </div>
              <p className="text-sm text-amber-900">
                <span className="font-bold">{journal.cheating.match.similarity}%</span> similarity with{' '}
                <span className="font-semibold">{journal.cheating.match.studentName}</span>'s journal from{' '}
                {journal.cheating.match.school} on {journal.cheating.match.date}.
              </p>
              <p className="text-xs text-amber-700 mt-2">Review both entries before flagging as repeat offence.</p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <p className="font-semibold text-emerald-900 text-sm">No matches found</p>
              </div>
              <p className="text-xs text-emerald-800">
                Compared against journals from all 28 schools in the network.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setStudent(null);
                setJournalId(null);
                setStage('scan-qr');
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-[#5B4DB1] text-white font-semibold hover:bg-[#4a3f96] transition-colors flex items-center justify-center gap-2"
            >
              <ScanLine size={16} /> Scan next student
            </button>
            <Link
              href="/mentor/today"
              className="px-4 py-3 rounded-xl border border-[rgba(91,77,177,0.2)] text-[#5B4DB1] font-medium hover:bg-[#F0EEF7] transition-colors"
            >
              Done
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
