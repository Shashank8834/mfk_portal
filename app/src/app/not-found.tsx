import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="font-display font-extrabold text-8xl gradient-text">
          404
        </div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Page Not Found
        </h1>
        <p className="text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link href="/stories">
            <Button variant="secondary">Browse Stories</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
