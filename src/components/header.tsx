"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Feather, User, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChange, logout, getUserProfile, UserProfile } from '@/lib/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const ADMIN_EMAILS = ["fire9436@gmail.com"];

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

  const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email);

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
              {isAdmin && (
                <Button variant="ghost" asChild className="hidden md:flex gap-2">
                  <Link href="/admin">
                    <ShieldCheck className="h-4 w-4" />
                    <span>관리자</span>
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:opacity-80 transition-opacity focus-visible:ring-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userProfile?.photoURL || currentUser.photoURL || "/default-avatar.png"} alt={userProfile?.nickname || currentUser.displayName || "User"} />
                      <AvatarFallback>{(userProfile?.nickname || currentUser.displayName || "User").charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userProfile?.nickname || currentUser.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userProfile?.job || currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link href="/admin" className="cursor-pointer flex w-full items-center">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>관리자</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>계정 설정</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 ml-2"
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
