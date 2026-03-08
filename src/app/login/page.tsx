"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, onAuthStateChange, getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google";
import { LoaderCircle, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isRedirecting = useRef(false);

  // 리다이렉트 함수 (가장 확실한 방법 사용)
  const performRedirect = (path: string) => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;
    
    // Next.js router와 브라우저 location을 모두 활용하여 확실히 이동
    router.replace(path);
    setTimeout(() => {
      if (window.location.pathname === "/login") {
        window.location.href = path;
      }
    }, 500);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (isRedirecting.current) return;

      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile && profile.nickname && profile.nickname !== "익명" && profile.job) {
            performRedirect("/");
          } else {
            performRedirect("/profile");
          }
        } catch (err) {
          console.error("Profile check error:", err);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    if (isRedirecting.current) return;
    
    try {
      setError(null);
      setLoading(true);
      
      const profile = await signInWithGoogle();

      if (profile && profile.nickname && profile.nickname !== "익명" && profile.job) {
        performRedirect("/");
      } else {
        performRedirect("/profile");
      }
    } catch (err: any) {
      console.error("SignIn error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <LoaderCircle className="animate-spin h-12 w-12 text-primary" />
        <p className="text-lg font-medium animate-pulse">잠시만 기다려 주세요...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-headline">로그인</CardTitle>
          <CardDescription>
            WisdomWell에 오신 것을 환영합니다.<br />
            구글 계정으로 간편하게 시작해 보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="grid gap-4 mt-4">
            <Button variant="outline" size="lg" className="w-full h-12" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-3 h-5 w-5" />
              구글로 계속하기
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              로그인함으로써 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
