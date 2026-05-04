'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, X, MousePointerClick } from 'lucide-react';
import { MENTOR_STUDENTS, MentorStudent } from '@/data/mentorStudents';

type Props = {
  onScan: (qr: string) => void;
  onClose?: () => void;
  continuous?: boolean;       // keep scanning after a hit
  hint?: string;
};

declare global {
  interface Window {
    BarcodeDetector?: new (opts: { formats: string[] }) => {
      detect: (img: CanvasImageSource) => Promise<{ rawValue: string }[]>;
    };
  }
}

export default function QRScanner({ onScan, onClose, continuous = false, hint }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScanRef = useRef<{ qr: string; at: number } | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMockPicker, setShowMockPicker] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const hasDetector = typeof window !== 'undefined' && typeof window.BarcodeDetector === 'function';
    setSupported(hasDetector);

    if (!hasDetector) return;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        const detector = new window.BarcodeDetector!({ formats: ['qr_code'] });
        const tick = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes[0]?.rawValue) {
              const qr = codes[0].rawValue;
              const now = Date.now();
              const last = lastScanRef.current;
              if (!last || last.qr !== qr || now - last.at > 1500) {
                lastScanRef.current = { qr, at: now };
                onScan(qr);
                if (!continuous) return; // stop loop
              }
            }
          } catch {
            // swallow per-frame errors
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Camera unavailable');
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onScan, continuous]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Camera size={18} />
          <span className="font-medium">Scan QR code</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {supported === false || error ? (
          <div className="text-center text-white/80 max-w-sm">
            <p className="mb-2 font-semibold">
              {supported === false ? 'Camera scanner not supported on this device' : 'Camera blocked'}
            </p>
            <p className="text-sm text-white/60 mb-4">
              {error ?? 'Use the manual picker below to simulate a scan during the demo.'}
            </p>
          </div>
        ) : (
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-white/20">
            <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-8 border-2 border-[#E8941A] rounded-2xl pointer-events-none" />
          </div>
        )}

        {hint && <p className="mt-4 text-sm text-white/70 text-center max-w-sm">{hint}</p>}

        <button
          onClick={() => setShowMockPicker((v) => !v)}
          className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
        >
          <MousePointerClick size={14} />
          Simulate scan (demo)
        </button>

        {showMockPicker && (
          <div className="mt-3 w-full max-w-sm bg-white rounded-2xl p-3 max-h-64 overflow-y-auto shadow-xl">
            {MENTOR_STUDENTS.map((s: MentorStudent) => (
              <button
                key={s.id}
                onClick={() => onScan(s.qr)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#F0EEF7] text-left"
              >
                <div>
                  <p className="text-sm font-medium text-[#1A1635]">{s.name}</p>
                  <p className="text-xs text-[#6B6590]">{s.rollNo} · Grade {s.grade}</p>
                </div>
                <span className="font-mono text-[10px] text-[#6B6590]">{s.qr}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
