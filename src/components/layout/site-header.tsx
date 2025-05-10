import Link from 'next/link';
import { UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          FriendlyVoice
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/profile" passHref>
            <Button variant="ghost" size="icon">
              <UserCircle2 className="h-6 w-6" />
              <span className="sr-only">Perfil</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
