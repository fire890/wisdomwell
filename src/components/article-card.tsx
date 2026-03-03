"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { authors } from '@/lib/data';
import { getUserProfile, type UserProfile } from '@/lib/auth';
import type { Article } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ArticleCardProps {
  article: Partial<Article> & { image?: ImagePlaceholder };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!article.authorId) return;

      // Check static authors first
      const staticAuthor = authors.find(a => a.id === article.authorId);
      if (staticAuthor) {
        setAuthorProfile({
          uid: staticAuthor.id,
          displayName: staticAuthor.name,
          nickname: staticAuthor.name,
          photoURL: staticAuthor.avatarUrl,
          email: '',
          job: staticAuthor.preRetirementCareer,
        });
      } else {
        // Fetch from Firestore
        const profile = await getUserProfile(article.authorId);
        if (profile) {
          setAuthorProfile(profile);
        }
      }
    };

    fetchAuthor();
  }, [article.authorId]);

  if (!article.id || !article.image || !article.content) {
    return null;
  }

  const displayName = authorProfile?.nickname || authorProfile?.displayName || "알 수 없는 사용자";
  const displayJob = authorProfile?.job || "커리어를 준비 중입니다";
  const avatarUrl = authorProfile?.photoURL || "";

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={article.image.imageUrl}
              alt={article.image.description}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 p-6">
          <Badge variant="secondary">{article.category}</Badge>
          <CardTitle className="line-clamp-2 text-xl font-bold leading-snug">
            {article.title}
          </CardTitle>
          <p className="line-clamp-3 text-base text-muted-foreground">
            {article.content.split('\n\n')[0]}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={avatarUrl}
                alt={displayName}
              />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-muted-foreground">
                {displayJob}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
