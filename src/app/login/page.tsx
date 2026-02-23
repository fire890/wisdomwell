"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, onAuthStateChange, handleRedirectResult, getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processRedirect = async () => {
      try {
        await handleRedirectResult();
      } catch (error) {
        console.error("Error handling redirect:", error);
      }
    };

    processRedirect();

    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile && (!profile.nickname || !profile.job)) {
          router.push("/profile"); // Redirect to profile setup if info is missing
        } else {
          router.push("/"); // Redirect to home if profile is complete
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Choose your preferred method to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
            {/* Kakao Sign-in will be added later */}
            {/* <Button variant="outline" className="w-full">
              <Image src="/kakao-logo.svg" alt="Kakao Logo" width={16} height={16} className="mr-2" />
              Sign in with Kakao
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
