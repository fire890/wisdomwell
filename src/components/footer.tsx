import Link from 'next/link';
import { Feather } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground font-headline">
              WisdomWell
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-muted-foreground">
            <Link href="#" className="hover:text-primary">
              About
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WisdomWell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
