import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - Mentor Intern | Mentors for Kids',
  description: 'Apply to be a Mentor Intern at Mentors for Kids Foundation. Paid internship with travel reimbursement. Work with underprivileged students in Bangalore.',
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
