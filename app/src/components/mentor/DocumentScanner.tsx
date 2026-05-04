'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, X, RotateCcw, Check, ImagePlus } from 'lucide-react';

type Props = {
  onSave: (pages: string[]) => void;
  onCancel: () => void;
  studentName: string;
};

export default function DocumentScanner({ onSave, onCancel, studentName }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } },
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
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Camera unavailable');
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0);
    const url = canvas.toDataURL('image/jpeg', 0.7);
    setPages((p) => [...p, url]);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setPages((p) => [...p, reader.result as string]);
      };
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  }

  function removePage(idx: number) {
    setPages((p) => p.filter((_, i) => i !== idx));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div>
          <p className="font-medium">Scan journal</p>
          <p className="text-xs text-white/60">{studentName}</p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-white/10">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        {error ? (
          <div className="text-center text-white/80 max-w-sm">
            <p className="mb-2 font-semibold">Camera unavailable</p>
            <p className="text-sm text-white/60 mb-4">{error}</p>
            <p className="text-xs text-white/50">Use “Add from gallery” to attach images instead.</p>
          </div>
        ) : (
          <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 bg-black/50">
            <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-6 border-2 border-dashed border-[#E8941A]/70 rounded-xl pointer-events-none" />
          </div>
        )}
      </div>

      {/* Page strip */}
      {pages.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pages.map((p, i) => (
              <div key={i} className="relative shrink-0">
                <img src={p} alt={`Page ${i + 1}`} className="w-16 h-20 rounded-lg object-cover border-2 border-white/30" />
                <span className="absolute -top-1 -left-1 bg-[#E8941A] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {i + 1}
                </span>
                <button
                  onClick={() => removePage(i)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-4 pb-6 pt-2 flex items-center justify-between gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-1 text-white/80 hover:text-white px-3"
        >
          <ImagePlus size={22} />
          <span className="text-[10px]">Gallery</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPickFile} />

        <button
          onClick={capture}
          disabled={!!error}
          className="w-16 h-16 rounded-full bg-white border-4 border-white/40 hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Camera size={24} className="text-[#5B4DB1]" />
        </button>

        <button
          onClick={() => pages.length && onSave(pages)}
          disabled={pages.length === 0}
          className="flex flex-col items-center gap-1 text-[#E8941A] hover:text-[#FFB347] disabled:opacity-30 disabled:cursor-not-allowed px-3"
        >
          <Check size={22} />
          <span className="text-[10px]">Save ({pages.length})</span>
        </button>
      </div>

      {pages.length > 0 && (
        <button
          onClick={() => setPages([])}
          className="absolute bottom-24 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          title="Discard all pages"
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
}
