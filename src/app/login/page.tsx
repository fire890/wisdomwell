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
  const isProcessingManualLogin = useRef(false);

  // 리다이렉트 함수 (확실한 이동 보장)
  const performRedirect = (path: string) => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;
    
    console.log(`Final redirect to ${path}`);
    router.replace(path);
    
    // Fallback: 800ms 후에도 페이지가 그대로라면 강제 이동
    setTimeout(() => {
      if (window.location.pathname === "/login") {
        window.location.href = path;
      }
    }, 800);
  };

  const checkProfileAndRedirect = async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);
      if (profile && profile.nickname && profile.nickname !== "익명" && profile.job) {
        performRedirect("/");
      } else {
        performRedirect("/profile");
      }
    } catch (err) {
      console.error("Profile check error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // 자동 로그인 체크 (이미 세션이 있는 경우)
    const unsubscribe = onAuthStateChange(async (user) => {
      // 수동 로그인 중이거나 이미 이동 중이면 리스너 로직 건너뜀
      if (isProcessingManualLogin.current || isRedirecting.current) return;

      if (user) {
        console.log("Auto-login detected");
        await checkProfileAndRedirect(user.uid);
      } else {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    if (isRedirecting.current || isProcessingManualLogin.current) return;
    
    try {
      setError(null);
      setLoading(true);
      isProcessingManualLogin.current = true;
      
      console.log("Starting manual sign-in");
      const profile = await signInWithGoogle();
      
      if (profile) {
        console.log("Manual sign-in success, profile found");
        if (profile.nickname && profile.nickname !== "익명" && profile.job) {
          performRedirect("/");
        } else {
          performRedirect("/profile");
        }
      }
    } catch (err: any) {
      console.error("Manual sign-in error:", err);
      isProcessingManualLogin.current = false;
      
      // 이미 리다이렉트가 시작되었다면 에러 무시
      if (isRedirecting.current) return;

      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`로그인에 실패했습니다: ${err.message || "알 수 없는 오류"}`);
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
            <Button variant="outline" size="lg" className="w-full h-12" onClick={handleGoogleSignIn} disabled={isProcessingManualLogin.current}>
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
