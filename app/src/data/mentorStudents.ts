// Mock roster for the mentor's primary school (SCH001).
// Each student has a deterministic QR payload `mfk:<id>` that the in-app
// scanner produces. In production these QR codes would be printed on the
// students' name cards / journals.

export type MentorStudent = {
  id: string;
  name: string;
  rollNo: string;
  grade: number;
  schoolId: string;
  qr: string; // value embedded in the QR
};

export const MENTOR_STUDENTS: MentorStudent[] = [
  { id: 'STU001', name: 'Sushmita Reddy',  rollNo: '8A-12', grade: 8, schoolId: 'SCH001', qr: 'mfk:STU001' },
  { id: 'STU002', name: 'Aarav Kumar',     rollNo: '8A-04', grade: 8, schoolId: 'SCH001', qr: 'mfk:STU002' },
  { id: 'STU003', name: 'Diya Nair',       rollNo: '8A-09', grade: 8, schoolId: 'SCH001', qr: 'mfk:STU003' },
  { id: 'STU004', name: 'Rohan Shetty',    rollNo: '8B-15', grade: 8, schoolId: 'SCH001', qr: 'mfk:STU004' },
  { id: 'STU005', name: 'Kavya Hegde',     rollNo: '9A-02', grade: 9, schoolId: 'SCH001', qr: 'mfk:STU005' },
  { id: 'STU006', name: 'Pranav Joshi',    rollNo: '9A-18', grade: 9, schoolId: 'SCH001', qr: 'mfk:STU006' },
  { id: 'STU007', name: 'Tanvi Gowda',     rollNo: '9B-07', grade: 9, schoolId: 'SCH001', qr: 'mfk:STU007' },
  { id: 'STU008', name: 'Vikram Rao',      rollNo: '10A-11', grade: 10, schoolId: 'SCH001', qr: 'mfk:STU008' },
];

export function studentByQR(qr: string): MentorStudent | undefined {
  return MENTOR_STUDENTS.find((s) => s.qr === qr);
}

export function studentById(id: string): MentorStudent | undefined {
  return MENTOR_STUDENTS.find((s) => s.id === id);
}
