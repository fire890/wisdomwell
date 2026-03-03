"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChange, getUserProfile, updateUserProfile, type UserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setNickname(profile.nickname || "");
          setJob(profile.job || "");
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

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
      try {
        await updateUserProfile(currentUser.uid, { nickname, job });
        toast({
          title: "프로필 설정 완료",
          description: "성공적으로 프로필이 업데이트되었습니다. 이제 이야기를 시작해 보세요!",
        });
        router.push("/");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "업데이트 실패",
          description: "프로필 저장 중 오류가 발생했습니다. 다시 시도해 주세요.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
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
              />
              <p className="text-xs text-muted-foreground">당신의 소중한 경험과 지혜의 배경을 알려주세요.</p>
            </div>
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              저장하고 시작하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
