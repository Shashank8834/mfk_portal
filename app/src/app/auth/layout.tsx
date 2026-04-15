import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Mentors for Kids',
  description: 'Sign in to your Mentors for Kids account with phone OTP verification.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
