'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle2, ScanLine, Video } from 'lucide-react';
import QRScanner from '@/components/mentor/QRScanner';
import VideoRecorder from '@/components/mentor/VideoRecorder';
import { studentByQR, MentorStudent } from '@/data/mentorStudents';
import { useMentorWorkStore } from '@/stores/mentorWorkStore';

type Stage = 'scan-qr' | 'record' | 'done';

export default function VideoFlow() {
  const addVideo = useMentorWorkStore((s) => s.addVideo);
  const [stage, setStage] = useState<Stage>('scan-qr');
  const [student, setStudent] = useState<MentorStudent | null>(null);
  const [savedDuration, setSavedDuration] = useState<number>(0);
  const [scanError, setScanError] = useState<string | null>(null);

  function handleQR(qr: string) {
    const s = studentByQR(qr);
    if (!s) { setScanError(`Unknown QR code: ${qr}`); return; }
    setScanError(null);
    setStudent(s);
    setStage('record');
  }

  function handleSave(blobUrl: string, durationSec: number) {
    if (!student) return;
    addVideo({
      id: `VID-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      blobUrl,
      durationSec,
      capturedAt: new Date().toISOString(),
    });
    setSavedDuration(durationSec);
    setStage('done');
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mentor/today" className="p-2 -ml-2 rounded-lg hover:bg-[#F0EEF7]">
          <ArrowLeft size={18} className="text-[#1A1635]" />
        </Link>
        <div>
          <h1 className="font-bold text-[#1A1635]">Record video</h1>
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
          hint="Scan the student's QR code before recording."
        />
      )}

      {stage === 'record' && student && (
        <VideoRecorder
          studentName={student.name}
          onSave={handleSave}
          onCancel={() => setStage('scan-qr')}
        />
      )}

      {stage === 'done' && student && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
            <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-2" />
            <p className="font-semibold text-emerald-900">Video uploaded</p>
            <p className="text-sm text-emerald-800 mt-1">
              {Math.floor(savedDuration / 60)}:{(savedDuration % 60).toString().padStart(2, '0')} added to{' '}
              <span className="font-semibold">{student.name}</span>'s profile.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setStudent(null); setStage('scan-qr'); }}
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
