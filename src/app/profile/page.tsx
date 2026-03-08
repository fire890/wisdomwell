"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChange, getUserProfile, updateUserProfile, isNicknameAvailable, type UserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      try {
        if (user) {
          console.log("Auth state: user logged in", user.uid);
          setCurrentUser(user);
          const profile = await getUserProfile(user.uid);
          console.log("Profile data:", profile);
          if (profile) {
            setNickname(profile.nickname || "");
            setJob(profile.job || "");
          }
        } else {
          console.log("Auth state: no user, redirecting to login");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error in profile auth listener:", error);
        toast({
          title: "오류 발생",
          description: "데이터를 불러오는 중 문제가 발생했습니다. 페이지를 새로고침해 주세요.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !job.trim()) {
      toast({
        title: "입력 확인",
        description: "활동명과 은퇴 전 직업을 모두 입력해 주세요.",
        variant: "destructive",
      });
      return;
    }

    if (currentUser) {
      setIsSaving(true);
      try {
        // Check for nickname uniqueness
        const isAvailable = await isNicknameAvailable(nickname, currentUser.uid);
        if (!isAvailable) {
          toast({
            title: "활동명 중복",
            description: "이미 사용 중인 활동명입니다. 다른 이름을 입력해 주세요.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }

        await updateUserProfile(currentUser.uid, { nickname, job });
        toast({
          title: "프로필 설정 완료",
          description: "성공적으로 프로필이 업데이트되었습니다. 이제 이야기를 시작해 보세요!",
        });
        
        // Success! Redirect to home
        setTimeout(() => {
          router.push("/");
          router.refresh(); // Refresh to update header etc.
        }, 100);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "업데이트 실패",
          description: "프로필 저장 중 오류가 발생했습니다. 다시 시도해 주세요.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold font-headline">프로필 설정</CardTitle>
          <CardDescription>
            글을 작성할 때 표시될 정보를 입력해 주세요.<br />
            다른 사용자들에게 당신을 소개하는 첫걸음입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nickname" className="text-sm font-medium">활동명 (아이디)</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="어떤 이름으로 불리고 싶으신가요?"
                className="h-11"
                required
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">게시글 상단에 표시됩니다.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job" className="text-sm font-medium">은퇴 전 직업</Label>
              <Input
                id="job"
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="예: 초등학교 교사, 요리사, 엔지니어 등"
                className="h-11"
                required
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">당신의 소중한 경험과 지혜의 배경을 알려주세요.</p>
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : "저장하고 시작하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
