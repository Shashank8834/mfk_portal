import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from './providers';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Mentors for Kids | Empowering Education in Bangalore',
  description:
    'Discover government schools, watch student stories, and fund education across Bangalore. A not-for-profit by BCL India, backed by Zerodha.',
  keywords: ['education', 'charity', 'Bangalore', 'mentorship', 'donate', 'NGO', 'BCL India', 'Zerodha'],
  openGraph: {
    title: 'Mentors for Kids | Financial Literacy For Underprivileged Schoolchildren',
    description:
      'Discover government schools, watch student stories, and fund education across Bangalore.',
    url: 'https://mentorsforkids.in',
    siteName: 'Mentors for Kids',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body bg-bg-deep text-text-primary min-h-screen antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
