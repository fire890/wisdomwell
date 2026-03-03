'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { articles as staticArticles, authors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleContent } from '@/components/article-content';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { database } from '@/lib/firebase';
import { ref, get, child, remove } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChange, getUserProfile, type UserProfile } from '@/lib/auth';
import type { Article } from '@/lib/data';

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchArticleAndAuthor = async () => {
      setLoading(true);
      try {
        // 1. 글 데이터 가져오기
        let foundArticle: Article | null = null;
        
        // 정적 데이터에서 먼저 확인
        const staticArticle = staticArticles.find((a) => a.id === params.id);
        if (staticArticle) {
          foundArticle = staticArticle;
        } else {
          // Firebase에서 확인
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, `articles`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            foundArticle = Object.values(data).find((a: any) => a.id === params.id) as Article;
          }
        }

        if (foundArticle) {
          setArticle(foundArticle);
          
          // 2. 글쓴이 프로필 가져오기
          // 정적 저자인 경우 (id가 'author-'로 시작)
          const staticAuthor = authors.find((a) => a.id === foundArticle!.authorId);
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
            // Firestore에서 실제 유저 프로필 가져오기
            const profile = await getUserProfile(foundArticle.authorId);
            if (profile) {
              setAuthorProfile(profile);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndAuthor();
  }, [params.id]);

  const handleDelete = async () => {
    if (!currentUser || !article || currentUser.uid !== article.authorId) {
      toast({
        title: "권한 없음",
        description: "게시글을 삭제할 권한이 없습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await remove(ref(database, `articles/${article.id}`));
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "오류 발생",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-20 text-center">로딩 중...</div>;
  }

  if (!article) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === article.imageId) || PlaceHolderImages[0];
  const displayName = authorProfile?.nickname || authorProfile?.displayName || "알 수 없는 사용자";
  const displayJob = authorProfile?.job || "커리어를 준비 중입니다";
  const avatarUrl = authorProfile?.photoURL || "";

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            priority
          />
        </div>

        <Badge variant="secondary" className="mb-4">
          {article.category}
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-headline">
          {article.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground text-base md:text-lg">
                {displayName}
              </p>
              <p className="text-xs md:text-sm">
                은퇴 전 직업: {displayJob}
              </p>
            </div>
          </div>
          <div className="hidden md:block"><span>&middot;</span></div>
          <time dateTime={article.createdAt} className="text-sm md:text-base">
            {format(new Date(article.createdAt), 'yyyy년 M월 d일', {
              locale: ko,
            })}
          </time>
          {currentUser && currentUser.uid === article.authorId && (
            <Button variant="destructive" onClick={handleDelete} className="ml-auto">
              삭제
            </Button>
          )}
        </div>
      </header>

      <ArticleContent content={article.content} />
    </article>
  );
}
