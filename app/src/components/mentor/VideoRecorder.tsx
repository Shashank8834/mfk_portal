'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Trash2, Upload, Square, Circle } from 'lucide-react';

type Props = {
  studentName: string;
  onSave: (blobUrl: string, durationSec: number) => void;
  onCancel: () => void;
};

export default function VideoRecorder({ studentName, onSave, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [preview, setPreview] = useState<{ url: string; duration: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: true,
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
        setError(e instanceof Error ? e.message : 'Camera/mic unavailable');
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const duration = Math.round((Date.now() - startedAtRef.current) / 1000);
      setPreview({ url, duration });
      setRecording(false);
      if (tickRef.current) clearInterval(tickRef.current);
    };
    recorder.start();
    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setRecording(true);
    setElapsed(0);
    tickRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startedAtRef.current) / 1000));
    }, 250);
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  function discardPreview() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div>
          <p className="font-medium">{preview ? 'Review video' : 'Record video'}</p>
          <p className="text-xs text-white/60">{studentName}</p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-white/10">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        {error ? (
          <p className="text-white/80 text-center max-w-sm">{error}</p>
        ) : preview ? (
          <video
            ref={previewRef}
            src={preview.url}
            controls
            playsInline
            className="w-full max-w-md aspect-[3/4] rounded-2xl bg-black object-cover"
          />
        ) : (
          <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 bg-black/50">
            <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            {recording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-500 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-mono text-white">{fmt(elapsed)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-8 pt-3 flex items-center justify-center gap-6">
        {preview ? (
          <>
            <button
              onClick={discardPreview}
              className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 px-4"
            >
              <Trash2 size={22} />
              <span className="text-xs">Discard</span>
            </button>
            <button
              onClick={() => onSave(preview.url, preview.duration)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8941A] hover:bg-[#FFB347] text-white font-semibold transition-colors"
            >
              <Upload size={18} />
              Upload ({fmt(preview.duration)})
            </button>
          </>
        ) : recording ? (
          <button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-white border-4 border-red-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Square size={20} className="text-red-500 fill-red-500" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={!!error}
            className="w-16 h-16 rounded-full bg-red-500 border-4 border-white/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
          >
            <Circle size={28} className="text-white fill-white" />
          </button>
        )}
      </div>
    </div>
  );
}
