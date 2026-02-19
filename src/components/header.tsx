import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Feather className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground font-headline">
            WisdomWell
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/write">Start Writing</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
