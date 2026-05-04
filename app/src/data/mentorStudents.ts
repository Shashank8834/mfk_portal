// Mock roster for the mentor's primary school (SCH001).
// Each student has a deterministic 6-char PNR; the QR payload `mfk:<pnr>`
// is what the in-app scanner produces. In production these QR codes would be
// printed on the students' name cards / journals and resolve to the public
// /students/<pnr> profile.

import { generatePnr } from '@/lib/utils';

export type MentorStudent = {
  /** Internal id, used as a stable store key. */
  id: string;
  /** Real full name — visible only to the mentor in their roster. Never goes on a public surface. */
  name: string;
  realFirstName: string;
  realLastName: string;
  /** Public pseudonym shown on the child's profile. */
  assumedFirstName: string;
  assumedLastInitial: string;
  /** 6-char alphanumeric public identifier. */
  pnr: string;
  rollNo: string;
  grade: number;
  schoolId: string;
  /** Value embedded in the QR — `mfk:<pnr>`. */
  qr: string;
};

type Seed = {
  id: string;
  name: string;
  assumedFirstName: string;
  assumedLastInitial: string;
  rollNo: string;
  grade: number;
};

const SEEDS: Seed[] = [
  { id: 'STU001', name: 'Sushmita Reddy', assumedFirstName: 'Lyra',    assumedLastInitial: 'K', rollNo: '8A-12',  grade: 8  },
  { id: 'STU002', name: 'Aarav Kumar',    assumedFirstName: 'Falcon',  assumedLastInitial: 'M', rollNo: '8A-04',  grade: 8  },
  { id: 'STU003', name: 'Diya Nair',      assumedFirstName: 'Iris',    assumedLastInitial: 'P', rollNo: '8A-09',  grade: 8  },
  { id: 'STU004', name: 'Rohan Shetty',   assumedFirstName: 'Atlas',   assumedLastInitial: 'D', rollNo: '8B-15',  grade: 8  },
  { id: 'STU005', name: 'Kavya Hegde',    assumedFirstName: 'Nova',    assumedLastInitial: 'B', rollNo: '9A-02',  grade: 9  },
  { id: 'STU006', name: 'Pranav Joshi',   assumedFirstName: 'Comet',   assumedLastInitial: 'V', rollNo: '9A-18',  grade: 9  },
  { id: 'STU007', name: 'Tanvi Gowda',    assumedFirstName: 'Wren',    assumedLastInitial: 'S', rollNo: '9B-07',  grade: 9  },
  { id: 'STU008', name: 'Vikram Rao',     assumedFirstName: 'Orion',   assumedLastInitial: 'T', rollNo: '10A-11', grade: 10 },
];

export const MENTOR_STUDENTS: MentorStudent[] = SEEDS.map((s) => {
  const [realFirstName, ...rest] = s.name.split(' ');
  const realLastName = rest.join(' ');
  const pnr = generatePnr(s.id);
  return {
    id: s.id,
    name: s.name,
    realFirstName,
    realLastName,
    assumedFirstName: s.assumedFirstName,
    assumedLastInitial: s.assumedLastInitial,
    pnr,
    rollNo: s.rollNo,
    grade: s.grade,
    schoolId: 'SCH001',
    qr: `mfk:${pnr}`,
  };
});

/**
 * Resolve a student from a scanned QR. Accepts the canonical `mfk:<pnr>`
 * payload as well as the legacy `mfk:STU001` payload from older printed
 * cards.
 */
export function studentByQR(qr: string): MentorStudent | undefined {
  return MENTOR_STUDENTS.find((s) => s.qr === qr || `mfk:${s.id}` === qr);
}

export function studentById(id: string): MentorStudent | undefined {
  return MENTOR_STUDENTS.find((s) => s.id === id);
}

export function studentByPnr(pnr: string): MentorStudent | undefined {
  return MENTOR_STUDENTS.find((s) => s.pnr === pnr.toUpperCase());
}
