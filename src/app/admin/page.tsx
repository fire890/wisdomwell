"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChange, getAllUserProfiles, type UserProfile } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoaderCircle, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // 관리자 이메일 목록 (필요에 따라 수정 가능)
  const ADMIN_EMAILS = ["fire9436@gmail.com"]; 

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true);
        try {
          const profiles = await getAllUserProfiles();
          setUsers(profiles);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // 관리자가 아니면 홈으로 리다이렉트 (실제 운영시에는 더 엄격한 보안 필요)
        if (user) {
          console.log("Not an admin:", user.email);
          router.push("/");
        } else {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">관리자 권한 확인 중...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary h-6 w-6" />
              사용자 관리
            </CardTitle>
            <CardDescription>
              WisdomWell에 가입한 모든 사용자들의 목록과 정보를 확인합니다.
            </CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            총 {users.length}명
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">프로필</TableHead>
                  <TableHead>활동명 (ID)</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>은퇴 전 직업</TableHead>
                  <TableHead className="text-right">UID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.photoURL || ""} alt={user.nickname || ""} />
                          <AvatarFallback>{(user.nickname || "U").charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.nickname || "미설정"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {user.job || "미입력"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground font-mono">
                        {user.uid.substring(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      가입된 사용자가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
