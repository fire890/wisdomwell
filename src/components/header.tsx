"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChange, logout, getUserProfile, UserProfile } from '@/lib/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
          {currentUser ? (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile?.photoURL || currentUser.photoURL || "/default-avatar.png"} alt={userProfile?.nickname || currentUser.displayName || "User"} />
                <AvatarFallback>{(userProfile?.nickname || currentUser.displayName || "User").charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" onClick={handleLogout}>
                로그아웃
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/write">글쓰기 시작</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/write">글쓰기 시작</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
