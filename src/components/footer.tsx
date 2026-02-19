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
              소개
            </Link>
            <Link href="#" className="hover:text-primary">
              서비스 약관
            </Link>
            <Link href="#" className="hover:text-primary">
              개인정보처리방침
            </Link>
            <Link href="#" className="hover:text-primary">
              문의
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WisdomWell. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  );
}
