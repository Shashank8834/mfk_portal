import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}

export function formatNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString('en-IN');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function displayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

/**
 * Anonymisation pool: short, neutral, max-8-char pseudonyms that the system
 * pre-fills for each child on first login. Children are free to change theirs
 * on the edit screen as long as it differs from their real first name.
 */
export const ASSUMED_NAME_POOL: readonly string[] = [
  'Tiger', 'Comet', 'Rocket', 'Falcon', 'Phoenix', 'Atlas', 'Orion', 'Lyra',
  'Nova', 'Vega', 'Cosmo', 'Zephyr', 'Echo', 'Sage', 'Iris', 'Lark',
  'Wren', 'Fox', 'Wolf', 'Eagle', 'Hawk', 'Otter', 'Magpie', 'Robin',
  'Sparrow', 'Dove', 'Heron', 'Indigo', 'Jade', 'Koel', 'Lotus', 'Mango',
];

/** Lower-friction PNR alphabet: omits 0/O/1/I/L to avoid scanner confusion. */
const PNR_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Deterministic 6-char PNR from a stable seed (e.g. internal id). Same seed
 * always yields the same PNR so URLs and QR codes are stable across reloads.
 */
export function generatePnr(seed: string): string {
  // Simple non-crypto hash — enough for a deterministic-but-spread mapping
  // across the alphabet. Not for security use.
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let out = '';
  for (let i = 0; i < 6; i++) {
    h = Math.imul(h ^ (h >>> 13), 16777619);
    out += PNR_ALPHABET[Math.abs(h) % PNR_ALPHABET.length];
  }
  return out;
}

/** Public-safe display name for a student: assumed first + assumed last initial. */
export function publicName(s: { assumedFirstName: string; assumedLastInitial: string; graduated?: boolean; pnr: string }): string {
  if (s.graduated) return `Alumna · ${s.pnr}`;
  return `${s.assumedFirstName} ${s.assumedLastInitial}.`;
}

/** Avatar / image initials derived from the public (non-real) name. */
export function publicInitials(s: { assumedFirstName: string; assumedLastInitial: string }): string {
  return (s.assumedFirstName[0] || '?').toUpperCase() + (s.assumedLastInitial[0] || '?').toUpperCase();
}
