"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, onAuthStateChange, getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log("Auth state changed, user:", user?.uid);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          console.log("Profile fetched:", profile);
          
          if (profile && profile.nickname && profile.job) {
            router.replace("/"); // Use replace to prevent back-button loops
          } else {
            router.replace("/profile");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setLoading(false); // Only show login button if profile fetch fails
        }
      } else {
        console.log("No user authenticated");
        setLoading(false); // Show login button if no user
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // onAuthStateChange will handle the redirection automatically
    } catch (error: any) {
      console.error("Login failed:", error);
      // Firebase popup closed by user or other error
      if (error.code !== 'auth/popup-closed-by-user') {
        alert("로그인 중 오류가 발생했습니다: " + error.message);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">인증 확인 중...</p>
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
