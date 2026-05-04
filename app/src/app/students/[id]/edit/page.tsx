'use client';

import { use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { lookupStudent } from '@/data/students';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useStudentOverridesStore } from '@/stores/studentOverridesStore';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_FIRST_NAME = 8;

export default function EditStudentNamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = lookupStudent(id);
  if (!student) notFound();

  const router = useRouter();
  const setOverride = useStudentOverridesStore((s) => s.setOverride);
  const existingOverride = useStudentOverridesStore((s) => s.byPnr[student.pnr]);

  const [assumedFirstName, setAssumedFirstName] = useState(existingOverride?.assumedFirstName ?? student.assumedFirstName);
  const [assumedLastInitial, setAssumedLastInitial] = useState(existingOverride?.assumedLastInitial ?? student.assumedLastInitial);
  const [saved, setSaved] = useState(false);

  const trimmed = assumedFirstName.trim();
  // Hartej's constraint: the assumed first name must differ from the real
  // first name (case-insensitive). Length and emptiness are also blocked.
  const sameAsReal = trimmed.toLowerCase() === student.realFirstName.toLowerCase();
  const tooLong = trimmed.length > MAX_FIRST_NAME;
  const tooShort = trimmed.length < 2;
  const errors: string[] = [];
  if (tooShort) errors.push(`Use at least 2 characters.`);
  if (tooLong) errors.push(`Maximum ${MAX_FIRST_NAME} characters.`);
  if (sameAsReal) errors.push(`Pick something different from your real first name.`);

  function handleSave() {
    if (errors.length) return;
    setOverride(student.pnr, { assumedFirstName: trimmed, assumedLastInitial });
    setSaved(true);
    // Bounce back to the public profile so the change is visible.
    setTimeout(() => router.push(`/students/${student.pnr}`), 600);
  }

  return (
    <div className="pt-20 min-h-screen pb-24 md:pb-10">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <Link href={`/students/${student.pnr}`} className="text-text-muted text-sm hover:text-primary inline-flex items-center gap-1">
            <span aria-hidden>←</span> Back to profile
          </Link>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-text-primary mt-3">Edit Display Name</h1>
          <p className="text-text-muted text-sm mt-2">
            Pick the name that the public site will show. Your real name stays private and is only ever visible to foundation staff.
          </p>
        </div>

        <GlassCard className="p-6 space-y-5">
          {/* Real name — read-only, deliberately greyed out per the SOP. */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Real first name</label>
            <input
              type="text"
              value={student.realFirstName}
              readOnly
              disabled
              aria-readonly
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated/40 border border-border text-text-muted/60 cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Real last name</label>
            <input
              type="text"
              value={student.realLastName}
              readOnly
              disabled
              aria-readonly
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated/40 border border-border text-text-muted/60 cursor-not-allowed"
            />
          </div>

          <hr className="border-border" />

          {/* Assumed first name — editable, ≤8 chars, must differ from real. */}
          <div className="space-y-1">
            <label htmlFor="assumed-first" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Assumed first name <span className="text-text-muted/60">(max {MAX_FIRST_NAME} chars)</span>
            </label>
            <input
              id="assumed-first"
              type="text"
              value={assumedFirstName}
              onChange={(e) => setAssumedFirstName(e.target.value)}
              maxLength={MAX_FIRST_NAME}
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated/70 border border-border text-text-primary focus:border-primary/40 focus:outline-none"
            />
            <p className="text-xs text-text-muted">{trimmed.length}/{MAX_FIRST_NAME}</p>
          </div>

          {/* Assumed last initial — A–Z dropdown. */}
          <div className="space-y-1">
            <label htmlFor="assumed-initial" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Assumed last initial
            </label>
            <select
              id="assumed-initial"
              value={assumedLastInitial}
              onChange={(e) => setAssumedLastInitial(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-elevated/70 border border-border text-text-primary focus:border-primary/40 focus:outline-none"
            >
              {ALPHABET.map((letter) => (
                <option key={letter} value={letter}>{letter}</option>
              ))}
            </select>
          </div>

          {/* Live preview */}
          <div className="rounded-xl bg-bg-elevated/40 border border-border px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-text-muted">Public preview</p>
            <p className="font-display font-bold text-lg text-text-primary mt-1">
              {trimmed || '—'} {assumedLastInitial}.
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono">URL: /students/{student.pnr}</p>
          </div>

          {errors.length > 0 && (
            <ul className="text-sm text-orange space-y-1">
              {errors.map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={errors.length > 0}
              className="flex-1"
            >
              {saved ? 'Saved ✓' : 'Save (demo)'}
            </Button>
            <Link href={`/students/${student.pnr}`}>
              <Button variant="secondary">Cancel</Button>
            </Link>
          </div>

          <p className="text-[11px] text-text-muted/70">
            Changes are stored in your browser only — this is a design preview, not a live backend.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
