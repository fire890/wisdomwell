"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, onAuthStateChange, getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google";
import { LoaderCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takeTooLong, setTakeTooLong] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRedirecting = useRef(false);

  useEffect(() => {
    console.log("LoginPage mounted");
    
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) setTakeTooLong(true);
    }, 8000);

    const unsubscribe = onAuthStateChange(async (user) => {
      // 이미 리다이렉트 중이면 중복 실행 방지
      if (isRedirecting.current) return;

      if (user) {
        console.log("User detected by listener:", user.uid);
        try {
          const profile = await getUserProfile(user.uid);
          // 닉네임과 직업이 모두 있어야 완성된 프로필로 간주
          if (profile && profile.nickname && profile.nickname !== "익명" && profile.job) {
            console.log("Profile complete, going home");
            isRedirecting.current = true;
            router.replace("/");
          } else {
            console.log("Profile incomplete, going to profile setup");
            isRedirecting.current = true;
            router.replace("/profile");
          }
        } catch (err) {
          console.error("Listener profile fetch error:", err);
          setLoading(false);
        }
      } else {
        console.log("No user session found");
        setLoading(false);
      }
    });
    
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      unsubscribe();
    };
  }, [router, loading]);

  const handleGoogleSignIn = async () => {
    if (isRedirecting.current) return;
    
    try {
      setError(null);
      setLoading(true);
      console.log("Initiating Google Sign-In...");
      
      // signInWithGoogle returns the created/existing profile
      const profile = await signInWithGoogle();
      console.log("Sign-in successful, profile:", profile);

      isRedirecting.current = true;
      if (profile && profile.nickname && profile.nickname !== "익명" && profile.job) {
        router.replace("/");
      } else {
        router.replace("/profile");
      }
    } catch (err: any) {
      console.error("Sign-in process error:", err);
      isRedirecting.current = false;
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-6 px-4">
        <LoaderCircle className="animate-spin h-12 w-12 text-primary" />
        <div className="text-center">
          <p className="text-lg font-medium animate-pulse">인증 및 프로필 확인 중...</p>
          {takeTooLong && (
            <p className="text-sm text-orange-500 mt-2">연결이 지연되고 있습니다. 잠시만 더 기다려 주세요.</p>
          )}
        </div>
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
