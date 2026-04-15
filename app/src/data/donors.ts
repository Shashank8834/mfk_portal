import { Donor } from '@/types';

export const donors: Donor[] = [
  { id: 'don-001', name: 'Nitin Kamath', isAnonymous: false, totalDonated: 500000, studentsSupported: 12 },
  { id: 'don-002', name: 'Priya Mehta', isAnonymous: false, totalDonated: 250000, studentsSupported: 6 },
  { id: 'don-003', name: 'Anonymous', isAnonymous: true, totalDonated: 100000, studentsSupported: 3 },
  { id: 'don-004', name: 'Ravi Shankar', isAnonymous: false, totalDonated: 75000, studentsSupported: 2 },
  { id: 'don-005', name: 'Anita Desai', isAnonymous: false, totalDonated: 150000, studentsSupported: 4 },
  { id: 'don-006', name: 'Anonymous', isAnonymous: true, totalDonated: 50000, studentsSupported: 1 },
  { id: 'don-007', name: 'Suresh Babu', isAnonymous: false, totalDonated: 200000, studentsSupported: 5 },
  { id: 'don-008', name: 'Deepa Nair', isAnonymous: false, totalDonated: 120000, studentsSupported: 3 },
  { id: 'don-009', name: 'Karthik Reddy', isAnonymous: false, totalDonated: 180000, studentsSupported: 4 },
  { id: 'don-010', name: 'Anonymous', isAnonymous: true, totalDonated: 300000, studentsSupported: 8 },
  { id: 'don-011', name: 'Meenakshi Iyer', isAnonymous: false, totalDonated: 90000, studentsSupported: 2 },
  { id: 'don-012', name: 'Zerodha Foundation', isAnonymous: false, totalDonated: 2000000, studentsSupported: 50 },
];

export function getDonorById(id: string): Donor | undefined {
  return donors.find((d) => d.id === id);
}
