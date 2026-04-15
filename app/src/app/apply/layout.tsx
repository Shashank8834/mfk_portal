import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply to be a Mentor | Mentors for Kids',
  description: 'Join our team of mentors and make a direct impact on underprivileged children\'s lives. Paid internship with travel reimbursement.',
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
