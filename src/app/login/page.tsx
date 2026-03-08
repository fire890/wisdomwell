"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, onAuthStateChange, getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google";
import { LoaderCircle, AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takeTooLong, setTakeTooLong] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("LoginPage mounted, starting auth listener");
    
    // 10초 이상 걸리면 사용자에게 수동 조작 옵션 제공
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.warn("Auth check is taking too long...");
        setTakeTooLong(true);
      }
    }, 10000);

    const unsubscribe = onAuthStateChange(async (user) => {
      console.log("Auth state changed, user UID:", user?.uid);
      
      if (user) {
        try {
          console.log("Fetching profile for user:", user.uid);
          const profile = await getUserProfile(user.uid);
          console.log("Profile fetch result:", profile);
          
          if (profile && profile.nickname && profile.job) {
            console.log("Profile complete, redirecting to home");
            router.replace("/");
          } else {
            console.log("Profile incomplete, redirecting to profile settings");
            router.replace("/profile");
          }
        } catch (err: any) {
          console.error("Error during post-auth process:", err);
          setError("프로필 정보를 가져오는 중 오류가 발생했습니다.");
          setLoading(false);
        }
      } else {
        console.log("No user authenticated, showing login UI");
        setLoading(false);
      }
    });
    
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      unsubscribe();
    };
  }, [router, loading]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      setTakeTooLong(false);
      console.log("Starting Google Sign-In popup...");
      await signInWithGoogle();
      console.log("Google Sign-In popup completed");
      // onAuthStateChange will handle the rest
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || "로그인 중 알 수 없는 오류가 발생했습니다.");
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-6 px-4">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin h-12 w-12 text-primary" />
          <div className="text-center">
            <p className="text-lg font-medium animate-pulse">인증 확인 중...</p>
            <p className="text-sm text-muted-foreground mt-1">잠시만 기다려 주세요.</p>
          </div>
        </div>

        {takeTooLong && (
          <Card className="max-w-xs border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div className="space-y-2">
                <p className="text-sm font-medium">응답이 평소보다 늦어지고 있습니다.</p>
                <p className="text-xs text-muted-foreground">네트워크 연결을 확인하거나 아래 버튼을 눌러보세요.</p>
              </div>
              <div className="flex flex-col w-full gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  페이지 새로고침
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">메인 화면으로 가기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
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
