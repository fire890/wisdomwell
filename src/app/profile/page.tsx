"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChange, getUserProfile, updateUserProfile, UserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [nickname, setNickname] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          setNickname(profile.nickname || "");
          setJob(profile.job || "");
        }
        setLoading(false);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !job) {
      toast({
        title: "Required Fields",
        description: "Please enter both nickname and job.",
        variant: "destructive",
      });
      return;
    }

    if (currentUser) {
      try {
        await updateUserProfile(currentUser.uid, { nickname, job });
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        router.push("/"); // Redirect to home after successful update
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Profile Update Failed",
          description: "There was an error updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Setup Profile</CardTitle>
          <CardDescription>
            Please provide your nickname and job to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="job">Job</Label>
              <Input
                id="job"
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Enter your job or occupation"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Save and Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
